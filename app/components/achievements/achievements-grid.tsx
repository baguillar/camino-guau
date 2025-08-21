
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Lock, CheckCircle2, Trophy, Calendar, MapPin, Route } from 'lucide-react'

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

interface User {
  id: string
  name: string | null
  totalKilometers: number
  totalWalks: number
  currentStreak: number
  bestStreak: number
}

interface AchievementsGridProps {
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  user: User | null
}

export function AchievementsGrid({ achievements, userAchievements, user }: AchievementsGridProps) {
  const unlockedAchievementIds = userAchievements?.map(ua => ua.achievementId) ?? []
  
  const getProgressPercentage = (achievement: Achievement): number => {
    if (!user) return 0
    
    if (achievement.kmRequired) {
      return Math.min((user.totalKilometers / achievement.kmRequired) * 100, 100)
    }
    if (achievement.walksRequired) {
      return Math.min((user.totalWalks / achievement.walksRequired) * 100, 100)
    }
    if (achievement.streakRequired) {
      return Math.min((user.bestStreak / achievement.streakRequired) * 100, 100)
    }
    return 0
  }

  const getProgressText = (achievement: Achievement): string => {
    if (!user) return ''
    
    if (achievement.kmRequired) {
      return `${user.totalKilometers.toFixed(1)} / ${achievement.kmRequired} km`
    }
    if (achievement.walksRequired) {
      return `${user.totalWalks} / ${achievement.walksRequired} caminatas`
    }
    if (achievement.streakRequired) {
      return `${user.bestStreak} / ${achievement.streakRequired} días`
    }
    return ''
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DISTANCE': return MapPin
      case 'WALKS': return Route
      case 'STREAK': return Calendar
      default: return Trophy
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DISTANCE': return 'bg-green-100 text-green-700'
      case 'WALKS': return 'bg-blue-100 text-blue-700'
      case 'STREAK': return 'bg-orange-100 text-orange-700'
      default: return 'bg-purple-100 text-purple-700'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'DISTANCE': return 'Distancia'
      case 'WALKS': return 'Caminatas'
      case 'STREAK': return 'Constancia'
      default: return 'Especial'
    }
  }

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

  // Group achievements by category
  const groupedAchievements = achievements?.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = []
    }
    acc[achievement.category].push(achievement)
    return acc
  }, {} as Record<string, Achievement[]>) ?? {}

  return (
    <div className="space-y-12">
      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-blue-200" />
            <p className="text-2xl font-bold">{unlockedAchievementIds?.length ?? 0}</p>
            <p className="text-blue-100 text-sm">Desbloqueados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4 text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-gray-200" />
            <p className="text-2xl font-bold">{(achievements?.length ?? 0) - (unlockedAchievementIds?.length ?? 0)}</p>
            <p className="text-gray-100 text-sm">Por desbloquear</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-green-200" />
            <p className="text-2xl font-bold">{user?.totalKilometers?.toFixed(1) ?? 0}</p>
            <p className="text-green-100 text-sm">Kilómetros</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <Route className="h-8 w-8 mx-auto mb-2 text-orange-200" />
            <p className="text-2xl font-bold">{user?.totalWalks ?? 0}</p>
            <p className="text-orange-100 text-sm">Caminatas</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements by Category */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
        const CategoryIcon = getCategoryIcon(category)
        return (
          <div key={category}>
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-full ${getCategoryColor(category)} mr-4`}>
                <CategoryIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getCategoryName(category)}
                </h2>
                <p className="text-gray-600">
                  {categoryAchievements.filter(a => unlockedAchievementIds.includes(a.id)).length} de {categoryAchievements.length} desbloqueados
                </p>
              </div>
            </div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categoryAchievements.map((achievement) => {
                const isUnlocked = unlockedAchievementIds.includes(achievement.id)
                const progress = getProgressPercentage(achievement)
                const progressText = getProgressText(achievement)
                const userAchievement = userAchievements?.find(ua => ua.achievementId === achievement.id)

                return (
                  <motion.div key={achievement.id} variants={itemVariants}>
                    <Card className={`border-0 shadow-lg transition-all duration-300 hover:scale-105 ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                        : 'bg-gray-50 grayscale'
                    }`}>
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className={`relative w-16 h-16 mx-auto mb-4 ${!isUnlocked ? 'opacity-40' : ''}`}>
                            <Image
                              src={`/achievements/${achievement.icon}.png`}
                              alt={achievement.name}
                              fill
                              className="object-contain"
                            />
                            {isUnlocked && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>

                          <h3 className={`font-bold text-lg mb-2 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {achievement.name}
                          </h3>

                          <p className={`text-sm mb-4 ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                            {achievement.description}
                          </p>

                          {isUnlocked ? (
                            <div className="space-y-2">
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                ¡Desbloqueado!
                              </Badge>
                              {userAchievement && (
                                <p className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(userAchievement.unlockedAt), { 
                                    addSuffix: true, 
                                    locale: es 
                                  })}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Progreso</span>
                                  <span className="text-gray-700 font-medium">
                                    {progress.toFixed(0)}%
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-gray-500 text-center">
                                  {progressText}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
