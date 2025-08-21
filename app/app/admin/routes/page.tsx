
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/admin/admin-layout'
import { RoutesManagement } from '@/components/admin/routes-management'

export const dynamic = "force-dynamic"

async function getRoutes() {
  const routes = await prisma.eventRoute.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      walks: {
        include: { user: true }
      }
    }
  })
  return routes
}

export default async function AdminRoutesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

  const routes = await getRoutes()

  return (
    <AdminLayout>
      <RoutesManagement routes={routes} />
    </AdminLayout>
  )
}
