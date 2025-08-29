
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from './empty-state'
import { DashboardSkeleton, WalksSkeleton, AchievementsSkeleton } from './loading-skeleton'
import { 
  MapPin, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Target,
  Clock,
  Award,
  Star
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface Walk {
  id: string
  kilometers: number
  duration: number | null
  date: Date
  notes: string | null
  eventRoute?: {
    name: string
    difficulty: string
  } | null
}

interface Achievement {
  id: string
  achievement: {
    name: string
    description: string
    icon: string
    category: string
  }
  unlockedAt: Date
  progress: number
}

interface UserStats {
  totalKilometers: number
  totalWalks: number
  currentStreak: number
  bestStreak: number
  lastWalkDate: Date | null
}

interface DashboardData {
  user: {
    name: string | null
    email: string
  } & UserStats
  recentWalks: Walk[]
  recentAchievements: Achievement[]
  upcomingEvents: Array<{
    id: string
    name: string
    eventDate: Date
    location: string
    difficulty: string
    distance: number
  }>
  weeklyGoal: {
    target: number
    current: number
    progress: number
  }
}

interface ImprovedDashboardProps {
  initialData?: DashboardData
  isLoading?: boolean
}

export function ImprovedDashboard({ initialData, isLoading = false }: ImprovedDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(initialData || null)
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    if (!initialData && !loading) {
      fetchDashboardData()
    }
  }, [initialData, loading])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!data) {
    return (
      <EmptyState
        type="general"
        title="Error al cargar el dashboard"
        description="No se pudo cargar la información del dashboard. Intenta recargar la página."
        actionLabel="Recargar"
        actionHref="/dashboard"
      />
    )
  }

  const { user, recentWalks, recentAchievements, upcomingEvents, weeklyGoal } = data

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola{user.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu actividad reciente
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paseos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalWalks}</div>
            <p className="text-xs text-muted-foreground">
              {user.totalKilometers.toFixed(1)} km recorridos
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
            <p className="text-xs text-muted-foreground">
              Mejor racha: {user.bestStreak} días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Semanal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyGoal.current}/{weeklyGoal.target}</div>
            <Progress value={weeklyGoal.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Paseo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.lastWalkDate ? (
                format(new Date(user.lastWalkDate), 'dd/MM', { locale: es })
              ) : (
                'Nunca'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.lastWalkDate ? (
                format(new Date(user.lastWalkDate), 'yyyy', { locale: es })
              ) : (
                '¡Hora de empezar!'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Walks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Paseos Recientes</CardTitle>
              <CardDescription>Tus últimas aventuras</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/walks">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentWalks.length === 0 ? (
              <EmptyState
                type="walks"
                title="¡Tu primera aventura te espera!"
                description="Registra tu primer paseo y comienza a acumular kilómetros."
              />
            ) : (
              <div className="space-y-4">
                {recentWalks.slice(0, 3).map((walk) => (
                  <div key={walk.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{walk.kilometers} km</span>
                        {walk.eventRoute && (
                          <Badge variant="secondary" className="text-xs">
                            {walk.eventRoute.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(walk.date), 'dd MMM yyyy', { locale: es })}
                      </p>
                      {walk.notes && (
                        <p className="text-xs text-muted-foreground truncate max-w-48">
                          {walk.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {walk.duration && (
                        <p className="text-sm font-medium">{walk.duration} min</p>
                      )}
                      {walk.eventRoute && (
                        <Badge 
                          variant={
                            walk.eventRoute.difficulty === 'EASY' ? 'secondary' :
                            walk.eventRoute.difficulty === 'MEDIUM' ? 'default' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {walk.eventRoute.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Logros Recientes</CardTitle>
              <CardDescription>Tus últimos desbloqueos</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/achievements">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAchievements.length === 0 ? (
              <EmptyState
                type="achievements"
                title="¡Logros esperándote!"
                description="Completa paseos para desbloquear increíbles logros."
              />
            ) : (
              <div className="space-y-4">
                {recentAchievements.slice(0, 3).map((userAchievement) => (
                  <div key={userAchievement.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{userAchievement.achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {userAchievement.achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Desbloqueado el {format(new Date(userAchievement.unlockedAt), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {userAchievement.achievement.category}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Próximos EventosGuau</CardTitle>
              <CardDescription>No te pierdas estas aventuras grupales</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/events">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.name}</h4>
                    <Badge 
                      variant={
                        event.difficulty === 'EASY' ? 'secondary' :
                        event.difficulty === 'MEDIUM' ? 'default' : 'destructive'
                      }
                    >
                      {event.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{event.distance} km</span>
                    <span>{format(new Date(event.eventDate), 'dd MMM', { locale: es })}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>¿Qué quieres hacer hoy?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild className="h-20 flex-col space-y-2">
              <Link href="/walks/new">
                <MapPin className="h-6 w-6" />
                <span>Registrar Paseo</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col space-y-2">
              <Link href="/events">
                <Calendar className="h-6 w-6" />
                <span>Ver Eventos</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col space-y-2">
              <Link href="/profile">
                <Award className="h-6 w-6" />
                <span>Mi Perfil</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
