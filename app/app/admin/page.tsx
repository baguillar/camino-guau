
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const dynamic = "force-dynamic"

async function getAdminData() {
  const [users, walks, achievements, appConfig] = await Promise.all([
    prisma.user.findMany({
      orderBy: { joinedDate: 'desc' },
      take: 10,
      include: {
        walks: { take: 1, orderBy: { date: 'desc' } },
        achievements: { take: 3 },
      },
    }),
    prisma.walk.findMany({
      orderBy: { date: 'desc' },
      take: 10,
      include: { user: true },
    }),
    prisma.achievement.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { users: { include: { user: true } } },
    }),
    prisma.appConfig.findMany(),
  ])

  // Calculate stats
  const totalUsers = await prisma.user.count()
  const totalWalks = await prisma.walk.count()
  const totalKilometers = await prisma.walk.aggregate({
    _sum: { kilometers: true },
  })
  const totalAchievements = await prisma.achievement.count()

  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentUsers = await prisma.user.count({
    where: { joinedDate: { gte: last30Days } },
  })
  const recentWalks = await prisma.walk.count({
    where: { date: { gte: last30Days } },
  })

  return {
    users,
    walks,
    achievements,
    appConfig,
    stats: {
      totalUsers,
      totalWalks,
      totalKilometers: totalKilometers._sum.kilometers || 0,
      totalAchievements,
      recentUsers,
      recentWalks,
    },
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

  const data = await getAdminData()

  return (
    <AdminLayout>
      <AdminDashboard 
        users={data.users}
        walks={data.walks}
        achievements={data.achievements}
        appConfig={data.appConfig}
        stats={data.stats}
      />
    </AdminLayout>
  )
}
