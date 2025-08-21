
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json(
        { error: 'ID del participante es requerido' },
        { status: 400 }
      )
    }

    const participant = await prisma.eventParticipant.findUnique({
      where: { id: participantId },
      include: {
        user: {
          select: { name: true, email: true }
        },
        eventRoute: {
          select: { name: true, eventDate: true }
        }
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participante no encontrado' },
        { status: 404 }
      )
    }

    if (participant.attendanceConfirmed) {
      return NextResponse.json(
        { error: 'La asistencia ya está confirmada' },
        { status: 400 }
      )
    }

    // Update attendance confirmation
    const updatedParticipant = await prisma.eventParticipant.update({
      where: { id: participantId },
      data: {
        attendanceConfirmed: true,
        confirmedAt: new Date(),
        confirmedBy: session.user.id
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        eventRoute: {
          select: { name: true }
        }
      }
    })

    // TODO: Here you could add achievement checking logic
    // Check if user should get any achievements for completing the event

    return NextResponse.json({
      message: 'Asistencia confirmada exitosamente',
      participant: updatedParticipant
    })

  } catch (error) {
    console.error('Error confirming attendance:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
