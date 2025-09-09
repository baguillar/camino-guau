'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  averageSessionsPerUser: number;
}

interface RouteStats {
  totalRoutes: number;
  popularRoutes: Array<{
    id: string;
    name: string;
    completions: number;
  }>;
  averageRating: number;
}

interface ActivityStats {
  totalSessions: number;
  totalDistance: number;
  averageDistance: number;
  sessionsThisWeek: number;
}

export default function StatsPage() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    averageSessionsPerUser: 0
  });

  const [routeStats, setRouteStats] = useState<RouteStats>({
    totalRoutes: 0,
    popularRoutes: [],
    averageRating: 0
  });

  const [activityStats, setActivityStats] = useState<ActivityStats>({
    totalSessions: 0,
    totalDistance: 0,
    averageDistance: 0,
    sessionsThisWeek: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simular datos mientras se implementa la API real
        setTimeout(() => {
          setUserStats({
            totalUsers: 1247,
            activeUsers: 892,
            newUsersThisMonth: 156,
            averageSessionsPerUser: 3.2
          });

          setRouteStats({
            totalRoutes: 45,
            popularRoutes: [
              { id: '1', name: 'Parque Central', completions: 234 },
              { id: '2', name: 'Ruta del Río', completions: 189 },
              { id: '3', name: 'Sendero Montaña', completions: 156 }
            ],
            averageRating: 4.6
          });

          setActivityStats({
            totalSessions: 3891,
            totalDistance: 15678.5,
            averageDistance: 4.03,
            sessionsThisWeek: 287
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Estadísticas de la Plataforma</h1>
        <Badge variant="secondary">
          Actualizado: {new Date().toLocaleDateString('es-ES')}
        </Badge>
      </div>

      {/* Estadísticas de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats.newUsersThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rutas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routeStats.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">
              Rating promedio: {routeStats.averageRating}/5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityStats.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{activityStats.sessionsThisWeek} esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rutas Populares */}
      <Card>
        <CardHeader>
          <CardTitle>Rutas Más Populares</CardTitle>
          <CardDescription>
            Las rutas con mayor número de completaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeStats.popularRoutes.map((route, index) => (
              <div key={route.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <span className="font-medium">{route.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {route.completions} completaciones
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Actividad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(activityStats.totalDistance / 1000).toFixed(1)} km
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio: {activityStats.averageDistance.toFixed(2)} km por sesión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sesiones por Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.averageSessionsPerUser.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio por usuario registrado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Actividad Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityStats.sessionsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Sesiones completadas esta semana
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}