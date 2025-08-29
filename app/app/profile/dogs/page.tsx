

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { DogsManagement } from '@/components/dogs/dogs-management'

export const dynamic = "force-dynamic"

export default async function DogsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <DogsManagement />
        </div>
      </div>
    </AppLayout>
  )
}
