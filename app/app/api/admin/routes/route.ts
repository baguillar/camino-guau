
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/admin/routes - Get all routes
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const routes = await prisma.eventRoute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        walks: {
          include: { user: true }
        }
      }
    })

    return NextResponse.json(routes)
  } catch (error) {
    console.error('Error fetching routes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/routes - Create new route
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, location, distance, difficulty, eventDate, maxParticipants, entryPrice } = body

    if (!name || !location || !distance || !eventDate) {
      return NextResponse.json({ error: 'Missing required fields: name, location, distance, eventDate' }, { status: 400 })
    }

    const route = await prisma.eventRoute.create({
      data: {
        name,
        description: description || null,
        location,
        distance: parseFloat(distance),
        difficulty: difficulty || 'EASY',
        eventDate: new Date(eventDate),
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        entryPrice: entryPrice ? parseFloat(entryPrice) : null,
        requiresConfirmation: true,
      },
      include: {
        walks: {
          include: { user: true }
        }
      }
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error('Error creating route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
