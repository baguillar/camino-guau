
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const events = await prisma.eventRoute.findMany({
      where: {
        isActive: true,
        eventDate: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Include events from last 24 hours
        }
      },
      include: {
        _count: {
          select: {
            eventParticipants: true
          }
        },
        ...(session?.user?.id && {
          eventParticipants: {
            where: {
              userId: session.user.id
            },
            select: {
              id: true,
              attendanceConfirmed: true,
              confirmationCode: true,
              registeredAt: true
            }
          }
        })
      },
      orderBy: [
        {
          eventDate: 'asc'
        }
      ]
    })

    // Transform the data to include userParticipation
    const transformedEvents = events.map((event: any) => ({
      ...event,
      userParticipation: session?.user?.id && event.eventParticipants?.[0] || null,
      eventParticipants: undefined // Remove the detailed participants data
    }))

    return NextResponse.json(transformedEvents)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
