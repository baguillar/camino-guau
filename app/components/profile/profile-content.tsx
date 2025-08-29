

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Target,
  TrendingUp,
  Dog,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProfileContentProps {
  user: {
    id: string
    name?: string | null
    email: string
    totalKilometers: number
    totalWalks: number
    currentStreak: number
    bestStreak: number
    joinedDate: Date
  } | null
  walks: Array<{
    id: string
    kilometers: number
    date: Date
    notes?: string | null
    duration?: number | null
  }>
  userAchievements: Array<{
    id: string
    unlockedAt: Date
    achievement: {
      id: string
      name: string
      description: string
      icon: string
      category: string
    }
  }>
  monthlyStats: {
    kilometers: number
    walks: number
  }
}

export function ProfileContent({ user, walks, userAchievements, monthlyStats }: ProfileContentProps) {
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p>Usuario no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name || 'Usuario'}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Miembro desde {format(new Date(user.joinedDate), 'MMMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href="/profile/dogs">
                  <Button variant="outline">
                    <Dog className="h-4 w-4 mr-2" />
                    Mis Perros
                  </Button>
                </Link>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kilómetros</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalKilometers.toFixed(1)} km</div>
              <p className="text-xs text-muted-foreground">
                +{monthlyStats.kilometers.toFixed(1)} km este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paseos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalWalks}</div>
              <p className="text-xs text-muted-foreground">
                +{monthlyStats.walks} este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.currentStreak}</div>
              <p className="text-xs text-muted-foreground">días consecutivos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mejor Racha</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.bestStreak}</div>
              <p className="text-xs text-muted-foreground">días consecutivos</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="walks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="walks">Últimos Paseos</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
          </TabsList>

          <TabsContent value="walks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Últimos Paseos</CardTitle>
                <CardDescription>Historial de tus paseos más recientes</CardDescription>
              </CardHeader>
              <CardContent>
                {walks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No tienes paseos registrados aún
                  </p>
                ) : (
                  <div className="space-y-4">
                    {walks.map((walk) => (
                      <div
                        key={walk.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {walk.kilometers.toFixed(1)} km
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(walk.date), 'dd MMM yyyy, HH:mm', { locale: es })}
                            </p>
                            {walk.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {walk.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {walk.duration && (
                            <p className="text-sm text-muted-foreground">
                              {walk.duration} min
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logros Desbloqueados</CardTitle>
                <CardDescription>
                  Has desbloqueado {userAchievements.length} logros
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userAchievements.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No has desbloqueado logros aún
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {userAchievements.map((userAchievement) => (
                      <div
                        key={userAchievement.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <div className="text-3xl">
                          {userAchievement.achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {userAchievement.achievement.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {userAchievement.achievement.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">
                              {userAchievement.achievement.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(userAchievement.unlockedAt), 'dd MMM yyyy', { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
