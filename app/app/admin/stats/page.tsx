

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/admin/admin-layout'
import { StatsOverview } from '@/components/admin/stats-overview'
import { MonthlyWalkData, MonthlyUserData } from '@/lib/types'

export const dynamic = "force-dynamic"

async function getStatsData() {
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

  // Basic stats
  const [
    totalUsers,
    totalWalks,
    totalKilometers,
    totalAchievements,
    totalEventRoutes,
    totalEventParticipants
  ] = await Promise.all([
    prisma.user.count(),
    prisma.walk.count(),
    prisma.walk.aggregate({ _sum: { kilometers: true } }),
    prisma.achievement.count(),
    prisma.eventRoute.count(),
    prisma.eventParticipant.count()
  ])

  // Recent activity
  const [
    recentUsers,
    recentWalks,
    recentEventParticipants,
    activeUsers7Days,
    activeUsers30Days
  ] = await Promise.all([
    prisma.user.count({ where: { joinedDate: { gte: last30Days } } }),
    prisma.walk.count({ where: { date: { gte: last30Days } } }),
    prisma.eventParticipant.count({ where: { registeredAt: { gte: last30Days } } }),
    prisma.user.count({ where: { lastWalkDate: { gte: last7Days } } }),
    prisma.user.count({ where: { lastWalkDate: { gte: last30Days } } })
  ])

  // Top users
  const topUsersByKm = await prisma.user.findMany({
    orderBy: { totalKilometers: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      totalKilometers: true,
      totalWalks: true
    }
  })

  const topUsersByWalks = await prisma.user.findMany({
    orderBy: { totalWalks: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      totalKilometers: true,
      totalWalks: true
    }
  })

  // Monthly data for charts with proper typing
  const monthlyWalksRaw = await prisma.$queryRaw<Array<{
    month: Date
    walks: bigint
    kilometers: number
    avgDuration: number
  }>>`
    SELECT 
      DATE_TRUNC('month', date) as month,
      COUNT(*) as walks,
      SUM(kilometers) as kilometers,
      AVG(COALESCE(duration, 0)) as avgDuration
    FROM walks 
    WHERE date >= ${lastYear}
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY month
  `

  // Get monthly user data with all required fields
  const monthlyUsersRaw = await prisma.$queryRaw<Array<{
    month: Date
    newUsers: bigint
    activeUsers: bigint
    totalUsers: bigint
  }>>`
    WITH monthly_new_users AS (
      SELECT 
        DATE_TRUNC('month', "joinedDate") as month,
        COUNT(*) as newUsers
      FROM users 
      WHERE "joinedDate" >= ${lastYear}
      GROUP BY DATE_TRUNC('month', "joinedDate")
    ),
    monthly_active_users AS (
      SELECT 
        DATE_TRUNC('month', "lastWalkDate") as month,
        COUNT(DISTINCT id) as activeUsers
      FROM users 
      WHERE "lastWalkDate" >= ${lastYear}
      GROUP BY DATE_TRUNC('month', "lastWalkDate")
    ),
    monthly_total_users AS (
      SELECT 
        DATE_TRUNC('month', "joinedDate") as month,
        COUNT(*) OVER (ORDER BY DATE_TRUNC('month', "joinedDate") ROWS UNBOUNDED PRECEDING) as totalUsers
      FROM users 
      WHERE "joinedDate" >= ${lastYear}
      GROUP BY DATE_TRUNC('month', "joinedDate")
    )
    SELECT 
      COALESCE(mnu.month, mau.month, mtu.month) as month,
      COALESCE(mnu.newUsers, 0) as newUsers,
      COALESCE(mau.activeUsers, 0) as activeUsers,
      COALESCE(mtu.totalUsers, 0) as totalUsers
    FROM monthly_new_users mnu
    FULL OUTER JOIN monthly_active_users mau ON mnu.month = mau.month
    FULL OUTER JOIN monthly_total_users mtu ON COALESCE(mnu.month, mau.month) = mtu.month
    ORDER BY month
  `

  // Transform the raw SQL results to proper types
  const monthlyWalks: MonthlyWalkData[] = monthlyWalksRaw.map((item: {
    month: Date
    walks: bigint
    kilometers: number
    avgDuration: number
  }) => ({
    month: item.month.toISOString().slice(0, 7), // Convert Date to YYYY-MM string
    walks: Number(item.walks),
    totalKm: Number(item.kilometers), // Map kilometers to totalKm
    avgDuration: Number(item.avgDuration)
  }))

  const monthlyUsers: MonthlyUserData[] = monthlyUsersRaw.map((item: {
    month: Date
    newUsers: bigint
    activeUsers: bigint
    totalUsers: bigint
  }) => ({
    month: item.month.toISOString().slice(0, 7), // Convert Date to YYYY-MM string
    newUsers: Number(item.newUsers),
    activeUsers: Number(item.activeUsers),
    totalUsers: Number(item.totalUsers)
  }))

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

  // Event route stats
  const eventRouteStats = await prisma.eventRoute.findMany({
    include: {
      _count: {
        select: {
          eventParticipants: true,
          walks: true
        }
      }
    },
    orderBy: {
      eventParticipants: {
        _count: 'desc'
      }
    }
  })

  return {
    totalUsers,
    totalWalks,
    totalKilometers: totalKilometers._sum.kilometers || 0,
    totalAchievements,
    monthlyWalks,
    monthlyUsers,
    // Additional data for extended functionality
    basicStats: {
      totalUsers,
      totalWalks,
      totalKilometers: totalKilometers._sum.kilometers || 0,
      totalAchievements,
      totalEventRoutes,
      totalEventParticipants
    },
    recentActivity: {
      recentUsers,
      recentWalks,
      recentEventParticipants,
      activeUsers7Days,
      activeUsers30Days
    },
    topUsers: {
      byKilometers: topUsersByKm,
      byWalks: topUsersByWalks
    },
    achievementStats,
    eventRouteStats
  }
}

export default async function StatsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

  const data = await getStatsData()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground">
            Análisis detallado de la actividad en la plataforma
          </p>
        </div>
        
        <StatsOverview stats={data} />
      </div>
    </AdminLayout>
  )
}
