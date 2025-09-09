
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, MapPin, Clock, TrendingUp, Star } from 'lucide-react'

interface StatsData {
  totalUsers: number
  totalWalks: number
  totalDistance: number
  averageRating: number
  popularLocations: string[]
  recentActivity: {
    date: string
    walks: number
    newUsers: number
  }[]
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const fetchStats = async () => {
      // Aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalUsers: 1247,
        totalWalks: 3892,
        totalDistance: 15678.5,
        averageRating: 4.7,
        popularLocations: ['Parque Central', 'Malecón', 'Plaza Mayor', 'Parque de los Perros'],
        recentActivity: [
          { date: '2024-01-15', walks: 45, newUsers: 8 },
          { date: '2024-01-14', walks: 38, newUsers: 5 },
          { date: '2024-01-13', walks: 52, newUsers: 12 },
          { date: '2024-01-12', walks: 41, newUsers: 7 },
          { date: '2024-01-11', walks: 35, newUsers: 4 },
        ]
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando estadísticas...</div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error al cargar las estadísticas</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Estadísticas</h1>
        <Badge variant="secondary">
          <TrendingUp className="w-4 h-4 mr-1" />
          En tiempo real
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paseos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWalks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDistance.toLocaleString()} km</div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">
              +0.2 desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ubicaciones populares */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicaciones Más Populares</CardTitle>
          <CardDescription>
            Los lugares favoritos para pasear con perros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.popularLocations.map((location, index) => (
              <Badge key={index} variant="outline">
                <MapPin className="w-3 h-3 mr-1" />
                {location}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Resumen de los últimos 5 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{day.date}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{day.walks} paseos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{day.newUsers} nuevos usuarios</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
