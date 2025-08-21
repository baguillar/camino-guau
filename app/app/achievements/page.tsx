
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AppLayout } from '@/components/layout/app-layout'
import { AchievementsGrid } from '@/components/achievements/achievements-grid'

export const dynamic = "force-dynamic"

async function getAchievementsData(userId: string) {
  const [achievements, userAchievements, user] = await Promise.all([
    prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
    }),
  ])

  return {
    achievements,
    userAchievements,
    user,
  }
}

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const data = await getAchievementsData(session.user.id)

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Logros y Medallas 🏆
          </h1>
          <p className="text-gray-600 text-lg">
            Desbloquea insignias por tus aventuras con tu compañero canino
          </p>
          <div className="mt-4 flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-gray-600">Por desbloquear</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Desbloqueado</span>
            </div>
          </div>
        </div>

        <AchievementsGrid 
          achievements={data.achievements || []}
          userAchievements={data.userAchievements || []}
          user={data.user}
        />
      </div>
    </AppLayout>
  )
}
