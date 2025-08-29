import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/admin/admin-layout'
import { UsersManagement } from '@/components/admin/users-management'

export const dynamic = "force-dynamic"

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      walks: {
        select: {
          id: true,
          userId: true,
          kilometers: true,
          duration: true,
          date: true,
          notes: true,
          weather: true,
          dogMood: true,
          eventRouteId: true,
          dogCondition: true,
          userFeedback: true,
          rating: true
        }
      },
      achievements: {
        include: {
          achievement: true
        }
      },
      eventParticipants: {
        include: {
          eventRoute: true
        }
      },
      _count: {
        select: {
          walks: true,
          achievements: true,
          eventParticipants: true
        }
      }
    },
    orderBy: {
      joinedDate: 'desc'
    }
  })

  // Transformar los datos para incluir totalKilometers y totalWalks
  const transformedUsers = users.map(user => ({
    ...user,
    totalKilometers: user.walks.reduce((total, walk) => total + walk.kilometers, 0),
    totalWalks: user._count.walks
  }))

  return transformedUsers
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

  const users = await getUsers()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios registrados en la plataforma
          </p>
        </div>
        
        <UsersManagement users={users} />
      </div>
    </AdminLayout>
  )
}
