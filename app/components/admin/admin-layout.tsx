
'use client'

import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, Trophy, Settings, ArrowLeft } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-bold">CG</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la App
                </Button>
              </Link>
              <span className="text-sm text-gray-700">
                Hola, {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              <Link
                href="/admin/stats"
                className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Estadísticas</span>
              </Link>
              
              <Link
                href="/admin/users"
                className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
              >
                <Users className="h-5 w-5" />
                <span>Usuarios</span>
              </Link>
              
              <Link
                href="/admin/achievements"
                className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
              >
                <Trophy className="h-5 w-5" />
                <span>Logros</span>
              </Link>
              
              <Link
                href="/admin/settings"
                className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
                <span>Configuración</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
