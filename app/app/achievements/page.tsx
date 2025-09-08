
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Navigation } from '@/components/dashboard/navigation'
import { AchievementsGrid } from '@/components/achievements/achievements-grid'

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user?.id) {
    redirect('/auth/login')
  }

  const [achievements, userAchievements, user] = await Promise.all([
    prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }]
    }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: {
        achievement: true
      }
    }),
    prisma.user.findUnique({
      where: { id: session.user.id }
    })
  ])

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Logros y Objetivos
          </h1>
          <p className="text-gray-600 mt-2">
            Desbloquea logros y celebra tus hitos con tu compañero peludo
          </p>
        </div>

        <AchievementsGrid 
          achievements={achievements}
          userAchievements={userAchievements}
          user={user}
        />
      </div>
    </div>
  )
}
