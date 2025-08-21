
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AppLayout } from '@/components/layout/app-layout'
import { ProfileContent } from '@/components/profile/profile-content'

export const dynamic = "force-dynamic"

async function getProfileData(userId: string) {
  const [user, walks, userAchievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.walk.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    }),
  ])

  // Get monthly stats
  const currentMonth = new Date()
  currentMonth.setDate(1)
  const monthlyWalks = await prisma.walk.findMany({
    where: {
      userId,
      date: { gte: currentMonth },
    },
  })

  const monthlyKm = monthlyWalks.reduce((sum, walk) => sum + walk.kilometers, 0)
  const monthlyWalkCount = monthlyWalks.length

  return {
    user,
    walks,
    userAchievements,
    monthlyStats: {
      kilometers: monthlyKm,
      walks: monthlyWalkCount,
    },
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const data = await getProfileData(session.user.id)

  return (
    <AppLayout>
      <ProfileContent 
        user={data.user}
        walks={data.walks}
        userAchievements={data.userAchievements}
        monthlyStats={data.monthlyStats}
      />
    </AppLayout>
  )
}
