'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, MapPin, Clock, TrendingUp, Star } from 'lucide-react'
import { DashboardStats } from '@/lib/types'

export default function AdminStatsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data: DashboardStats = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
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

  if (error || !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            Error al cargar las estadísticas: {error || 'Datos no disponibles'}
          </div>
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
              Usuarios registrados
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
              Paseos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKilometers.toLocaleString()} km</div>
            <p className="text-xs text-muted-foreground">
              Kilómetros recorridos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logros</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAchievements}</div>
            <p className="text-xs text-muted-foreground">
              Logros disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas mensuales de paseos */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Mensuales de Paseos</CardTitle>
          <CardDescription>
            Resumen de los últimos 12 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.monthlyWalks.slice(0, 6).map((monthData, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{monthData.month}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{monthData.walks} paseos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{monthData.totalKm.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{monthData.avgDuration.toFixed(0)} min promedio</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas mensuales de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Mensuales de Usuarios</CardTitle>
          <CardDescription>
            Crecimiento de usuarios por mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.monthlyUsers.slice(0, 6).map((monthData, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{monthData.month}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{monthData.newUsers} nuevos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{monthData.activeUsers} activos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>{monthData.totalUsers} total</span>
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
