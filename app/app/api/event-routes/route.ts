
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/event-routes - Get active routes for users
export async function GET() {
  try {
    const routes = await prisma.eventRoute.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(routes)
  } catch (error) {
    console.error('Error fetching event routes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
