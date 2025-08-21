
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const { confirmationCode } = await request.json()

    if (!confirmationCode) {
      return NextResponse.json(
        { error: 'Código de confirmación es requerido' },
        { status: 400 }
      )
    }

    const participant = await prisma.eventParticipant.findUnique({
      where: { confirmationCode: confirmationCode.toUpperCase() },
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
        { error: 'Código de confirmación no válido' },
        { status: 404 }
      )
    }

    if (participant.attendanceConfirmed) {
      return NextResponse.json(
        { error: 'La asistencia ya está confirmada para este código' },
        { status: 400 }
      )
    }

    // Update attendance confirmation
    const updatedParticipant = await prisma.eventParticipant.update({
      where: { confirmationCode: confirmationCode.toUpperCase() },
      data: {
        attendanceConfirmed: true,
        confirmedAt: new Date(),
        confirmedBy: session.user.id
      }
    })

    return NextResponse.json({
      message: 'Asistencia confirmada exitosamente',
      userName: participant.user.name || participant.user.email,
      eventName: participant.eventRoute.name
    })

  } catch (error) {
    console.error('Error confirming by code:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
