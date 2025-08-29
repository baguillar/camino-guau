
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
        },
        eventParticipants: {
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

    // Relaxed validation - only require essential fields
    if (!name || !location || !eventDate) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, location, eventDate' 
      }, { status: 400 })
    }

    // Provide sensible defaults for optional fields
    const routeData = {
      name: name.trim(),
      description: description?.trim() || null,
      location: location.trim(),
      distance: distance ? parseFloat(distance) : 1.0, // Default 1km if not provided
      difficulty: difficulty || 'EASY',
      eventDate: new Date(eventDate),
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      entryPrice: entryPrice ? parseFloat(entryPrice) : null,
      requiresConfirmation: true,
    }

    // Validate parsed values
    if (isNaN(routeData.distance) || routeData.distance <= 0) {
      return NextResponse.json({ 
        error: 'Distance must be a positive number' 
      }, { status: 400 })
    }

    if (routeData.maxParticipants && (isNaN(routeData.maxParticipants) || routeData.maxParticipants <= 0)) {
      return NextResponse.json({ 
        error: 'Max participants must be a positive number' 
      }, { status: 400 })
    }

    if (routeData.entryPrice && (isNaN(routeData.entryPrice) || routeData.entryPrice < 0)) {
      return NextResponse.json({ 
        error: 'Entry price must be a non-negative number' 
      }, { status: 400 })
    }

    if (!['EASY', 'MEDIUM', 'HARD'].includes(routeData.difficulty)) {
      return NextResponse.json({ 
        error: 'Difficulty must be EASY, MEDIUM, or HARD' 
      }, { status: 400 })
    }

    // Check if event date is in the future
    if (routeData.eventDate <= new Date()) {
      return NextResponse.json({ 
        error: 'Event date must be in the future' 
      }, { status: 400 })
    }

    const route = await prisma.eventRoute.create({
      data: routeData,
      include: {
        walks: {
          include: { user: true }
        },
        eventParticipants: {
          include: { user: true }
        }
      }
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error('Error creating route:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ 
          error: 'A route with this name already exists' 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/routes - Update existing route
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, name, description, location, distance, difficulty, eventDate, maxParticipants, entryPrice, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Route ID is required' }, { status: 400 })
    }

    // Build update data object with only provided fields
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (location !== undefined) updateData.location = location.trim()
    if (distance !== undefined) updateData.distance = parseFloat(distance)
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (eventDate !== undefined) updateData.eventDate = new Date(eventDate)
    if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants ? parseInt(maxParticipants) : null
    if (entryPrice !== undefined) updateData.entryPrice = entryPrice ? parseFloat(entryPrice) : null
    if (isActive !== undefined) updateData.isActive = Boolean(isActive)

    // Validate updated values
    if (updateData.distance && (isNaN(updateData.distance) || updateData.distance <= 0)) {
      return NextResponse.json({ error: 'Distance must be a positive number' }, { status: 400 })
    }

    if (updateData.difficulty && !['EASY', 'MEDIUM', 'HARD'].includes(updateData.difficulty)) {
      return NextResponse.json({ error: 'Difficulty must be EASY, MEDIUM, or HARD' }, { status: 400 })
    }

    const route = await prisma.eventRoute.update({
      where: { id },
      data: updateData,
      include: {
        walks: {
          include: { user: true }
        },
        eventParticipants: {
          include: { user: true }
        }
      }
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error('Error updating route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/routes - Delete route
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Route ID is required' }, { status: 400 })
    }

    // Check if route has participants
    const participantCount = await prisma.eventParticipant.count({
      where: { eventRouteId: id }
    })

    if (participantCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete route with existing participants. Deactivate it instead.' 
      }, { status: 400 })
    }

    await prisma.eventRoute.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Route deleted successfully' })
  } catch (error) {
    console.error('Error deleting route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
