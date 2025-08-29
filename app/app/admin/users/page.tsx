
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/admin/admin-layout'
import { UsersManagement } from '@/components/admin/users-management'

export const dynamic = "force-dynamic"

async function getUsersData() {
  const users = await prisma.user.findMany({
    orderBy: { joinedDate: 'desc' },
    include: {
      walks: {
        orderBy: { date: 'desc' },
        take: 5
      },
      achievements: {
        include: {
          achievement: true
        }
      },
      eventParticipations: {
        include: {
          eventRoute: true
        }
      },
      _count: {
        select: {
          walks: true,
          achievements: true,
          eventParticipations: true
        }
      }
    }
  })

  const totalUsers = await prisma.user.count()
  const activeUsers = await prisma.user.count({
    where: {
      lastWalkDate: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  })

  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: true
  })

  return {
    users,
    stats: {
      totalUsers,
      activeUsers,
      usersByRole
    }
  }
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

  const data = await getUsersData()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios registrados en la plataforma
          </p>
        </div>
        
        <UsersManagement 
          users={data.users}
          stats={data.stats}
        />
      </div>
    </AdminLayout>
  )
}
