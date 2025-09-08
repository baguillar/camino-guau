
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Route, Trophy, MapPin } from 'lucide-react'
import { DashboardStats } from '@/lib/types'

interface StatsOverviewProps {
  stats: DashboardStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-blue-200" />
              <div className="ml-4">
                <p className="text-blue-100">Total Usuarios</p>
                <p className="text-3xl font-bold">{formatNumber(stats.totalUsers)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Route className="h-10 w-10 text-green-200" />
              <div className="ml-4">
                <p className="text-green-100">Total Caminatas</p>
                <p className="text-3xl font-bold">{formatNumber(stats.totalWalks)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-10 w-10 text-purple-200" />
              <div className="ml-4">
                <p className="text-purple-100">Kilómetros Totales</p>
                <p className="text-3xl font-bold">{formatNumber(stats.totalKilometers)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-10 w-10 text-orange-200" />
              <div className="ml-4">
                <p className="text-orange-100">Logros Desbloqueados</p>
                <p className="text-3xl font-bold">{formatNumber(stats.totalAchievements)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Walks */}
        <Card>
          <CardHeader>
            <CardTitle>Caminatas por Mes</CardTitle>
            <CardDescription>
              Actividad de caminatas en los últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.monthlyWalks.slice(0, 6).map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{data.month}</p>
                    <p className="text-sm text-gray-600">{data.totalKm.toFixed(1)} km</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{data.walks}</p>
                    <p className="text-sm text-gray-600">caminatas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Users */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios por Mes</CardTitle>
            <CardDescription>
              Nuevos registros en los últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.monthlyUsers.slice(0, 6).map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{data.month}</p>
                    <p className="text-sm text-gray-600">Total: {data.totalUsers}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{data.newUsers}</p>
                    <p className="text-sm text-gray-600">nuevos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
