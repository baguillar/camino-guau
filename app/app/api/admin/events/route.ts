
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }
    
    const events = await prisma.eventRoute.findMany({
      where: {
        isActive: true,
        eventDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Include events from last 7 days
        }
      },
      include: {
        eventParticipants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: [
            {
              attendanceConfirmed: 'asc' // Pending first
            },
            {
              registeredAt: 'asc'
            }
          ]
        }
      },
      orderBy: [
        {
          eventDate: 'desc'
        }
      ]
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching admin events:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
