
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { eventRouteId } = await request.json()

    if (!eventRouteId) {
      return NextResponse.json(
        { error: 'ID del evento es requerido' },
        { status: 400 }
      )
    }

    // Check if event exists and is active
    const event = await prisma.eventRoute.findUnique({
      where: { id: eventRouteId },
      include: {
        _count: {
          select: {
            eventParticipants: true
          }
        }
      }
    })

    if (!event || !event.isActive) {
      return NextResponse.json(
        { error: 'Evento no encontrado o inactivo' },
        { status: 404 }
      )
    }

    // Check if event is in the future
    if (new Date(event.eventDate) < new Date()) {
      return NextResponse.json(
        { error: 'No puedes registrarte a un evento pasado' },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingParticipation = await prisma.eventParticipant.findUnique({
      where: {
        userId_eventRouteId: {
          userId: session.user.id,
          eventRouteId: eventRouteId
        }
      }
    })

    if (existingParticipation) {
      return NextResponse.json(
        { error: 'Ya estás registrado en este evento' },
        { status: 400 }
      )
    }

    // Check if event is full
    if (event.maxParticipants && event._count.eventParticipants >= event.maxParticipants) {
      return NextResponse.json(
        { error: 'El evento está completo' },
        { status: 400 }
      )
    }

    // Generate unique confirmation code
    let confirmationCode: string
    let isUnique = false
    let attempts = 0
    
    do {
      confirmationCode = generateConfirmationCode()
      const existing = await prisma.eventParticipant.findUnique({
        where: { confirmationCode }
      })
      isUnique = !existing
      attempts++
      
      if (attempts > 10) {
        throw new Error('No se pudo generar un código único')
      }
    } while (!isUnique)

    // Create participation
    const participation = await prisma.eventParticipant.create({
      data: {
        userId: session.user.id,
        eventRouteId: eventRouteId,
        confirmationCode: confirmationCode!
      },
      include: {
        eventRoute: {
          select: {
            name: true,
            eventDate: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Registro exitoso',
      confirmationCode: participation.confirmationCode,
      eventName: participation.eventRoute.name
    })

  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
