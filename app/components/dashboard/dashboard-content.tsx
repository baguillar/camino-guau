
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  MapPin,
  Calendar,
  Zap,
  TrendingUp,
  Plus,
  Trophy,
  Clock,
  Route
} from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  totalKilometers: number
  totalWalks: number
  currentStreak: number
  bestStreak: number
  joinedDate: Date
}

interface Walk {
  id: string
  kilometers: number
  duration: number | null
  date: Date
  notes: string | null
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  kmRequired: number | null
  walksRequired: number | null
  streakRequired: number | null
}

interface UserAchievement {
  id: string
  achievementId: string
  unlockedAt: Date
  achievement: Achievement
}

interface Stats {
  totalWalks: number
  totalKilometers: number
  currentStreak: number
  bestStreak: number
  recentKm: number
  recentWalks: number
  unlockedAchievements: number
  totalAchievements: number
}

interface DashboardContentProps {
  user: User | null
  walks: Walk[]
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  stats: Stats
}

export function DashboardContent({
  user,
  walks,
  achievements,
  userAchievements,
  stats
}: DashboardContentProps) {
  const unlockedAchievementIds = userAchievements?.map(ua => ua.achievementId) ?? []
  const recentAchievements = achievements?.filter(a => unlockedAchievementIds.includes(a.id)).slice(0, 3) ?? []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ¡Hola, {user?.name || 'Aventurero'}! 🐕
        </h1>
        <p className="text-gray-600 text-lg">
          Listo para otra aventura con tu compañero peludo
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Caminatas</p>
                  <p className="text-3xl font-bold">{stats?.totalWalks ?? 0}</p>
                </div>
                <Route className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Kilómetros</p>
                  <p className="text-3xl font-bold">{(stats?.totalKilometers ?? 0).toFixed(1)}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Racha Actual</p>
                  <p className="text-3xl font-bold">{stats?.currentStreak ?? 0}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Logros</p>
                  <p className="text-3xl font-bold">{stats?.unlockedAchievements ?? 0}/{stats?.totalAchievements ?? 0}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Actividad Reciente
              </CardTitle>
              <Link href="/walks/new">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Caminata
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {walks?.length > 0 ? (
                <div className="space-y-4">
                  {walks.map((walk, index) => (
                    <motion.div
                      key={walk.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {walk.kilometers} km
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(walk.date), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </p>
                          {walk.notes && (
                            <p className="text-sm text-gray-600 mt-1">{walk.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {walk.duration && (
                          <Badge variant="secondary">{walk.duration} min</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ¡Hora de la primera aventura!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Registra tu primera caminata y comienza a desbloquear logros
                  </p>
                  <Link href="/walks/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Caminata
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Logros Recientes
              </CardTitle>
              <Link href="/achievements">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentAchievements?.length > 0 ? (
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={`/achievements/${achievement.icon}.png`}
                          alt={achievement.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Sin logros aún
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    ¡Sal a caminar para desbloquear tu primer logro!
                  </p>
                  <Link href="/achievements">
                    <Button variant="outline" size="sm">
                      Ver disponibles
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Este Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Caminatas</span>
                    <span className="font-medium">{stats?.recentWalks ?? 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(((stats?.recentWalks ?? 0) / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Kilómetros</span>
                    <span className="font-medium">{(stats?.recentKm ?? 0).toFixed(1)} km</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(((stats?.recentKm ?? 0) / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
