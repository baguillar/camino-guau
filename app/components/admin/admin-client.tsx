
'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Trophy, 
  Plus, 
  QrCode, 
  Send, 
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';
import { EventManagement } from './event-management';
import { UserManagement } from './user-management';
import { NotificationCenter } from './notification-center';
import { KilometerManagement } from './kilometer-management';

interface AdminClientProps {
  stats: {
    totalUsers: number;
    totalEvents: number;
    totalKilometers: number;
    totalAttendances: number;
  };
  recentEvents: any[];
  recentUsers: any[];
  session: Session;
}

export function AdminClient({ stats, recentEvents, recentUsers, session }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      <Header user={session?.user} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <Settings className="h-8 w-8 text-orange-500" />
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona eventos, usuarios y el sistema Camino Guau
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📊 Resumen</TabsTrigger>
            <TabsTrigger value="events">📅 Eventos</TabsTrigger>
            <TabsTrigger value="users">👥 Usuarios</TabsTrigger>
            <TabsTrigger value="kilometers">🏃‍♀️ Kilómetros</TabsTrigger>
            <TabsTrigger value="notifications">🔔 Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      Aventureros registrados
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      Eventos organizados
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kilómetros Total</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalKilometers.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                      Distancia recorrida
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Participaciones</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAttendances}</div>
                    <p className="text-xs text-muted-foreground">
                      Total asistencias
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Eventos y usuarios recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eventos Recientes</CardTitle>
                  <CardDescription>Últimos eventos creados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('es-ES')} • {event.kilometers} km
                        </p>
                      </div>
                      <Badge variant="outline">
                        {event._count.attendances} asistencias
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Recientes</CardTitle>
                  <CardDescription>Nuevos registros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} alt={user.firstName || user.name} />
                        <AvatarFallback>
                          {(user.firstName || user.name)?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-medium">{user.firstName || user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.userProgress?.totalKilometers || 0} km • {user.dogs.length} perro(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <EventManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement recentUsers={recentUsers} />
          </TabsContent>

          <TabsContent value="kilometers">
            <KilometerManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
