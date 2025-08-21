

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminSettingsContent } from '@/components/admin/admin-settings'

export const dynamic = "force-dynamic"

async function getAdminSettings() {
  const appConfig = await prisma.appConfig.findMany({
    orderBy: { key: 'asc' },
  })

  return { appConfig }
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

  const data = await getAdminSettings()

  return (
    <AdminLayout>
      <AdminSettingsContent appConfig={data.appConfig} />
    </AdminLayout>
  )
}
