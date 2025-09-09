import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MonthlyWalkData, MonthlyUserData, DashboardStats } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total counts
    const [totalUsers, totalWalks, totalKilometers, totalAchievements] = await Promise.all([
      prisma.user.count(),
      prisma.walk.count(),
      prisma.walk.aggregate({
        _sum: {
          kilometers: true
        }
      }),
      prisma.achievement.count()
    ])

    // Get monthly walk data - last 12 months
    const monthlyWalksRaw = await prisma.$queryRaw<Array<{
      month: Date
      walks: bigint
      kilometers: number
      duration: number
    }>>`
      SELECT 
        DATE_TRUNC('month', date) as month,
        COUNT(*)::bigint as walks,
        COALESCE(SUM(kilometers), 0) as kilometers,
        COALESCE(AVG(duration), 0) as duration
      FROM "Walk"
      WHERE date >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month DESC
    `

    // Transform the data to match MonthlyWalkData interface
    const monthlyWalks: MonthlyWalkData[] = monthlyWalksRaw.map(row => ({
      month: row.month.toISOString().substring(0, 7), // Format as YYYY-MM
      walks: Number(row.walks),
      totalKm: Number(row.kilometers),
      avgDuration: Number(row.duration)
    }))

    // Get monthly user data - last 12 months
    const monthlyUsersRaw = await prisma.$queryRaw<Array<{
      month: Date
      newUsers: bigint
      activeUsers: bigint
      totalUsers: bigint
    }>>`
      WITH monthly_new_users AS (
        SELECT 
          DATE_TRUNC('month', "joinedDate") as month,
          COUNT(*)::bigint as new_users
        FROM "User"
        WHERE "joinedDate" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "joinedDate")
      ),
      monthly_active_users AS (
        SELECT 
          DATE_TRUNC('month', date) as month,
          COUNT(DISTINCT "userId")::bigint as active_users
        FROM "Walk"
        WHERE date >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', date)
      ),
      monthly_total_users AS (
        SELECT 
          DATE_TRUNC('month', "joinedDate") as month,
          COUNT(*) OVER (ORDER BY DATE_TRUNC('month', "joinedDate"))::bigint as total_users
        FROM "User"
        WHERE "joinedDate" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "joinedDate")
      )
      SELECT 
        COALESCE(mnu.month, mau.month, mtu.month) as month,
        COALESCE(mnu.new_users, 0) as "newUsers",
        COALESCE(mau.active_users, 0) as "activeUsers",
        COALESCE(mtu.total_users, 0) as "totalUsers"
      FROM monthly_new_users mnu
      FULL OUTER JOIN monthly_active_users mau ON mnu.month = mau.month
      FULL OUTER JOIN monthly_total_users mtu ON COALESCE(mnu.month, mau.month) = mtu.month
      ORDER BY month DESC
    `

    // Transform the data to match MonthlyUserData interface
    const monthlyUsers: MonthlyUserData[] = monthlyUsersRaw.map(row => ({
      month: row.month.toISOString().substring(0, 7), // Format as YYYY-MM
      newUsers: Number(row.newUsers),
      activeUsers: Number(row.activeUsers),
      totalUsers: Number(row.totalUsers)
    }))

    const stats: DashboardStats = {
      totalUsers,
      totalWalks,
      totalKilometers: totalKilometers._sum.kilometers || 0,
      totalAchievements,
      monthlyWalks,
      monthlyUsers
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
