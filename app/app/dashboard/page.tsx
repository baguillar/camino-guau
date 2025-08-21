
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { AppLayout } from '@/components/layout/app-layout'

export const dynamic = "force-dynamic"

async function getDashboardData(userId: string) {
  const [user, walks, achievements, userAchievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.walk.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    }),
  ])

  // Calculate recent stats
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentWalks = await prisma.walk.findMany({
    where: {
      userId,
      date: { gte: last30Days },
    },
  })

  const totalRecentKm = recentWalks.reduce((sum, walk) => sum + walk.kilometers, 0)
  const totalRecentWalks = recentWalks.length

  return {
    user,
    walks,
    achievements,
    userAchievements,
    stats: {
      totalWalks: user?.totalWalks || 0,
      totalKilometers: user?.totalKilometers || 0,
      currentStreak: user?.currentStreak || 0,
      bestStreak: user?.bestStreak || 0,
      recentKm: totalRecentKm,
      recentWalks: totalRecentWalks,
      unlockedAchievements: userAchievements?.length || 0,
      totalAchievements: achievements?.length || 0,
    },
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const data = await getDashboardData(session.user.id)

  return (
    <AppLayout>
      <DashboardContent 
        user={data.user}
        walks={data.walks}
        achievements={data.achievements}
        userAchievements={data.userAchievements}
        stats={data.stats}
      />
    </AppLayout>
  )
}
