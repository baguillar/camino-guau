
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  User,
  MapPin,
  Calendar,
  Trophy,
  TrendingUp,
  Route,
  Clock,
  Zap,
  Edit,
  Mail,
  Settings
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
  weather: string | null
  dogMood: string | null
}

interface UserAchievement {
  id: string
  unlockedAt: Date
  achievement: {
    name: string
    description: string
    icon: string
    category: string
  }
}

interface MonthlyStats {
  kilometers: number
  walks: number
}

interface ProfileContentProps {
  user: User | null
  walks: Walk[]
  userAchievements: UserAchievement[]
  monthlyStats: MonthlyStats
}

export function ProfileContent({ 
  user, 
  walks, 
  userAchievements, 
  monthlyStats 
}: ProfileContentProps) {
  if (!user) return null

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
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-blue-100">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Miembro desde {format(new Date(user.joinedDate), 'MMMM yyyy', { locale: es })}
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Route className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {user.totalWalks}
              </p>
              <p className="text-sm text-gray-600">Caminatas Totales</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {user.totalKilometers.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Kilómetros Totales</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {user.currentStreak}
              </p>
              <p className="text-sm text-gray-600">Racha Actual</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {userAchievements?.length ?? 0}
              </p>
              <p className="text-sm text-gray-600">Logros Desbloqueados</p>
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
                Historial de Caminatas
              </CardTitle>
              <Link href="/walks/new">
                <Button size="sm">
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
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {walk.kilometers} km
                            </span>
                            {walk.duration && (
                              <Badge variant="secondary">{walk.duration} min</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {format(new Date(walk.date), "d 'de' MMMM, yyyy", { locale: es })}
                          </p>
                          {walk.notes && (
                            <p className="text-sm text-gray-600 mt-1">{walk.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {walk.weather && (
                          <Badge variant="outline" className="text-xs">
                            {walk.weather === 'sunny' ? '☀️' : 
                             walk.weather === 'cloudy' ? '☁️' : '🌧️'}
                          </Badge>
                        )}
                        {walk.dogMood && (
                          <Badge variant="outline" className="text-xs">
                            {walk.dogMood === 'happy' ? '😊' : 
                             walk.dogMood === 'neutral' ? '😐' : '😴'}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay caminatas aún
                  </h3>
                  <p className="text-gray-500">
                    ¡Registra tu primera aventura!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Monthly Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Este Mes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Caminatas</span>
                <span className="text-2xl font-bold text-gray-900">
                  {monthlyStats?.walks ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kilómetros</span>
                <span className="text-2xl font-bold text-gray-900">
                  {(monthlyStats?.kilometers ?? 0).toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
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
              {userAchievements?.length > 0 ? (
                <div className="space-y-3">
                  {userAchievements.slice(0, 3).map((ua, index) => (
                    <motion.div
                      key={ua.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                    >
                      <div className="relative w-8 h-8">
                        <Image
                          src={`/achievements/${ua.achievement.icon}.png`}
                          alt={ua.achievement.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {ua.achievement.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(ua.unlockedAt), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    ¡Sal a caminar para ganar tu primer logro!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Best Streak */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 mx-auto mb-3 text-orange-200" />
              <p className="text-3xl font-bold mb-2">{user.bestStreak}</p>
              <p className="text-orange-100 text-sm">Mejor Racha</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
