
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/admin/stats - Get comprehensive statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // days
    const type = searchParams.get('type') || 'overview'

    const now = new Date()
    const periodDays = parseInt(period)
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)

    if (type === 'overview') {
      // Basic overview stats
      const [
        totalUsers,
        totalWalks,
        totalKilometers,
        activeUsers,
        recentWalks
      ] = await Promise.all([
        prisma.user.count(),
        prisma.walk.count(),
        prisma.walk.aggregate({ _sum: { kilometers: true } }),
        prisma.user.count({ where: { lastWalkDate: { gte: startDate } } }),
        prisma.walk.count({ where: { date: { gte: startDate } } })
      ])

      return NextResponse.json({
        totalUsers,
        totalWalks,
        totalKilometers: totalKilometers._sum.kilometers || 0,
        activeUsers,
        recentWalks,
        period: periodDays
      })
    }

    if (type === 'daily') {
      // Daily activity for charts
      const dailyStats = await prisma.$queryRaw`
        SELECT 
          DATE(date) as day,
          COUNT(*) as walks,
          SUM(kilometers) as kilometers,
          COUNT(DISTINCT "userId") as unique_users
        FROM walks 
        WHERE date >= ${startDate}
        GROUP BY DATE(date)
        ORDER BY day
      `

      return NextResponse.json(dailyStats)
    }

    if (type === 'users') {
      // User-related stats
      const userStats = await prisma.user.groupBy({
        by: ['role'],
        _count: true,
        _avg: {
          totalKilometers: true,
          totalWalks: true
        }
      })

      const topUsers = await prisma.user.findMany({
        orderBy: { totalKilometers: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          totalKilometers: true,
          totalWalks: true,
          joinedDate: true
        }
      })

      return NextResponse.json({
        userStats,
        topUsers
      })
    }

    if (type === 'achievements') {
      // Achievement stats
      const achievementStats = await prisma.achievement.findMany({
        include: {
          _count: {
            select: {
              users: true
            }
          }
        },
        orderBy: {
          users: {
            _count: 'desc'
          }
        }
      })

      return NextResponse.json(achievementStats)
    }

    if (type === 'events') {
      // Event route stats
      const eventStats = await prisma.eventRoute.findMany({
        include: {
          _count: {
            select: {
              eventParticipants: true,
              walks: true
            }
          }
        },
        orderBy: {
          eventDate: 'desc'
        }
      })

      const participationStats = await prisma.eventParticipant.groupBy({
        by: ['eventRouteId'],
        _count: true,
        orderBy: {
          _count: {
            eventRouteId: 'desc'
          }
        }
      })

      return NextResponse.json({
        eventStats,
        participationStats
      })
    }

    return NextResponse.json({ error: 'Invalid stats type' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
