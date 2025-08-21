
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AchievementsManager } from '@/components/admin/achievements-manager'

export const dynamic = "force-dynamic"

async function getAchievementsData() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      users: {
        include: { user: { select: { name: true, email: true } } }
      }
    }
  })

  return { achievements }
}

export default async function AdminAchievementsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

  const data = await getAchievementsData()

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Logros 🏆
          </h1>
          <p className="text-gray-600">
            Configura los logros disponibles y sus requisitos
          </p>
        </div>

        <AchievementsManager achievements={data.achievements || []} />
      </div>
    </AdminLayout>
  )
}
