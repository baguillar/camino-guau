
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  MapPin, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Award,
  Route,
  UserCheck
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface StatsData {
  basicStats: {
    totalUsers: number
    totalWalks: number
    totalKilometers: number
    totalAchievements: number
    totalEventRoutes: number
    totalEventParticipants: number
  }
  recentActivity: {
    recentUsers: number
    recentWalks: number
    recentEventParticipants: number
    activeUsers7Days: number
    activeUsers30Days: number
  }
  topUsers: {
    byKilometers: Array<{
      id: string
      name: string | null
      email: string
      totalKilometers: number
      totalWalks: number
    }>
    byWalks: Array<{
      id: string
      name: string | null
      email: string
      totalKilometers: number
      totalWalks: number
    }>
  }
  chartData: {
    monthlyWalks: Array<{
      month: Date
      walks: number
      kilometers: number
    }>
    monthlyUsers: Array<{
      month: Date
      users: number
    }>
  }
  achievementStats: Array<{
    id: string
    name: string
    description: string
    icon: string
    category: string
    _count: {
      users: number
    }
  }>
  eventRouteStats: Array<{
    id: string
    name: string
    location: string
    distance: number
    difficulty: string
    eventDate: Date
    _count: {
      eventParticipants: number
      walks: number
    }
  }>
}

interface StatsOverviewProps {
  data: StatsData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function StatsOverview({ data }: StatsOverviewProps) {
  const { basicStats, recentActivity, topUsers, chartData, achievementStats, eventRouteStats } = data

  // Prepare chart data
  const monthlyData = chartData.monthlyWalks.map(item => ({
    month: format(new Date(item.month), 'MMM yyyy', { locale: es }),
    walks: Number(item.walks),
    kilometers: Number(item.kilometers)
  }))

  const userGrowthData = chartData.monthlyUsers.map(item => ({
    month: format(new Date(item.month), 'MMM yyyy', { locale: es }),
    users: Number(item.users)
  }))

  const achievementDistribution = achievementStats.slice(0, 5).map((achievement, index) => ({
    name: achievement.name,
    value: achievement._count.users,
    color: COLORS[index % COLORS.length]
  }))

  return (
    <div className="space-y-6">
      {/* Basic Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{basicStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{recentActivity.recentUsers} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paseos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{basicStats.totalWalks}</div>
            <p className="text-xs text-muted-foreground">
              +{recentActivity.recentWalks} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kilómetros Totales</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{basicStats.totalKilometers.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              km recorridos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity.activeUsers30Days}</div>
            <p className="text-xs text-muted-foreground">
              últimos 30 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Mensual</CardTitle>
            <CardDescription>Paseos y kilómetros por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="walks" fill="#8884d8" name="Paseos" />
                <Bar yAxisId="right" dataKey="kilometers" fill="#82ca9d" name="Kilómetros" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de Usuarios</CardTitle>
            <CardDescription>Nuevos usuarios por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Users and Achievement Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Usuarios por Kilómetros</CardTitle>
            <CardDescription>Los usuarios más activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.byKilometers.slice(0, 5).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{user.name || 'Sin nombre'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{user.totalKilometers.toFixed(1)} km</p>
                    <p className="text-sm text-muted-foreground">{user.totalWalks} paseos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Logros</CardTitle>
            <CardDescription>Logros más populares</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={achievementDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {achievementDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Routes Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de EventosGuau</CardTitle>
          <CardDescription>Rendimiento de las rutas de eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{basicStats.totalEventRoutes}</div>
              <p className="text-sm text-muted-foreground">Rutas Creadas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{basicStats.totalEventParticipants}</div>
              <p className="text-sm text-muted-foreground">Participaciones</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{recentActivity.recentEventParticipants}</div>
              <p className="text-sm text-muted-foreground">Este Mes</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Rutas Más Populares</h4>
            {eventRouteStats.slice(0, 5).map((route, index) => (
              <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <h5 className="font-medium">{route.name}</h5>
                    <Badge variant={
                      route.difficulty === 'EASY' ? 'secondary' :
                      route.difficulty === 'MEDIUM' ? 'default' : 'destructive'
                    }>
                      {route.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {route.location} • {route.distance} km
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(route.eventDate), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{route._count.eventParticipants} participantes</p>
                  <p className="text-sm text-muted-foreground">{route._count.walks} paseos</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Logros</CardTitle>
          <CardDescription>Popularidad de los diferentes logros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievementStats.slice(0, 10).map((achievement, index) => {
              const percentage = (achievement._count.users / basicStats.totalUsers) * 100
              return (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{achievement.name}</span>
                      <Badge variant="secondary">{achievement.category}</Badge>
                    </div>
                    <span className="text-sm font-medium">
                      {achievement._count.users} usuarios ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
