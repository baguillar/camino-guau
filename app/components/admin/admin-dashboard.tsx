
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Users,
  Route,
  Trophy,
  TrendingUp,
  MapPin,
  UserPlus,
  Calendar,
  Settings
} from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  totalKilometers: number
  totalWalks: number
  joinedDate: Date
  walks: Array<{ date: Date }>
  achievements: Array<{ id: string }>
}

interface Walk {
  id: string
  kilometers: number
  date: Date
  user: { name: string | null; email: string }
}

interface Achievement {
  id: string
  name: string
  category: string
  users: Array<{ user: { name: string | null } }>
}

interface AppConfig {
  id: string
  key: string
  value: string
}

interface Stats {
  totalUsers: number
  totalWalks: number
  totalKilometers: number
  totalAchievements: number
  recentUsers: number
  recentWalks: number
}

interface AdminDashboardProps {
  users: User[]
  walks: Walk[]
  achievements: Achievement[]
  appConfig: AppConfig[]
  stats: Stats
}

export function AdminDashboard({
  users,
  walks,
  achievements,
  appConfig,
  stats
}: AdminDashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Panel de Administración 🛠️
        </h1>
        <p className="text-gray-600 text-lg">
          Gestiona usuarios, logros y configuración de Camino Guau
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Usuarios</p>
                  <p className="text-3xl font-bold">{stats?.totalUsers ?? 0}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    +{stats?.recentUsers ?? 0} este mes
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Caminatas</p>
                  <p className="text-3xl font-bold">{stats?.totalWalks ?? 0}</p>
                  <p className="text-green-100 text-xs mt-1">
                    +{stats?.recentWalks ?? 0} este mes
                  </p>
                </div>
                <Route className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Kilómetros Totales</p>
                  <p className="text-3xl font-bold">{(stats?.totalKilometers ?? 0).toFixed(1)}</p>
                  <p className="text-orange-100 text-xs mt-1">km recorridos</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Logros Disponibles</p>
                  <p className="text-3xl font-bold">{stats?.totalAchievements ?? 0}</p>
                  <p className="text-purple-100 text-xs mt-1">medallas activas</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Users */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Usuarios Recientes
              </CardTitle>
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.slice(0, 5).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.name || 'Usuario'}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span>{user?.totalWalks} caminatas</span>
                          <span>{user?.totalKilometers?.toFixed(1)} km</span>
                          <span>{user?.achievements?.length} logros</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user?.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                        {user?.role || 'USER'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(user?.joinedDate), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </p>
                    </div>
                  </motion.div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    No hay usuarios registrados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/achievements" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  Gestionar Logros
                </Button>
              </Link>
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Usuarios
                </Button>
              </Link>
              <Link href="/admin/routes" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Route className="h-4 w-4 mr-2" />
                  Gestionar Rutas
                </Button>
              </Link>
              <Link href="/admin/settings" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {walks?.slice(0, 5).map((walk, index) => (
                  <motion.div
                    key={walk.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {walk?.user?.name || 'Usuario'}
                      </p>
                      <p className="text-gray-500">
                        {walk?.kilometers} km
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(walk?.date), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </p>
                  </motion.div>
                )) || (
                  <p className="text-gray-500 text-sm">
                    No hay actividad reciente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Popular Achievements */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Logros Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {achievements?.slice(0, 3).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-900">{achievement?.name}</span>
                    <Badge variant="outline">
                      {achievement?.users?.length || 0}
                    </Badge>
                  </motion.div>
                )) || (
                  <p className="text-gray-500 text-sm">
                    No hay logros disponibles
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
