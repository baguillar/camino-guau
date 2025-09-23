
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Plus,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Route {
  id: string;
  title: string;
  description: string | null;
  kilometers: number;
  date: string;
  maxParticipants: number | null;
  createdBy: string | null;
  participantsCount: number;
  createdAt: string;
  participants: Array<{
    id: string;
    userId: string;
    userName: string | null;
    userEmail: string;
    dogName: string | null;
    registeredAt: string;
    attended: boolean;
    attendedAt: string | null;
  }>;
}

interface AdminClientProps {
  routes: Route[];
  stats: {
    totalUsers: number;
    totalRoutes: number;
    totalParticipations: number;
    totalKilometers: number;
  };
  currentUserId: string;
}

export function AdminClient({ routes, stats }: AdminClientProps) {
  const [loadingParticipations, setLoadingParticipations] = useState<Set<string>>(new Set());

  const handleAttendanceToggle = async (participationId: string, attended: boolean) => {
    setLoadingParticipations(prev => new Set(prev).add(participationId));

    try {
      const response = await fetch('/api/admin/attendance', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participationId,
          attended,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al actualizar la asistencia');
        return;
      }

      toast.success(attended ? 'Asistencia confirmada' : 'Asistencia removida');
      window.location.reload();
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoadingParticipations(prev => {
        const newSet = new Set(prev);
        newSet.delete(participationId);
        return newSet;
      });
    }
  };

  const upcomingRoutes = routes.filter(r => new Date(r.date) >= new Date());
  const pastRoutes = routes.filter(r => new Date(r.date) < new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Panel de <span className="text-brand-gold">Administración</span>
            </h1>
            <p className="text-xl text-gray-600">
              Gestiona rutas, usuarios y supervisa la actividad de Camino Guau
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 font-semibold">Total Usuarios</p>
                      <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                    </div>
                    <Users className="text-blue-200" size={32} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 font-semibold">Total Rutas</p>
                      <p className="text-3xl font-bold mt-2">{stats.totalRoutes}</p>
                    </div>
                    <MapPin className="text-green-200" size={32} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 font-semibold">Participaciones</p>
                      <p className="text-3xl font-bold mt-2">{stats.totalParticipations}</p>
                    </div>
                    <UserCheck className="text-purple-200" size={32} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 font-semibold">Total KM</p>
                      <p className="text-3xl font-bold mt-2">
                        {routes.reduce((acc, r) => acc + (r.participants.filter(p => p.attended).length * r.kilometers), 0).toFixed(1)}
                      </p>
                    </div>
                    <BarChart3 className="text-orange-200" size={32} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Tabs defaultValue="routes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-brand-light">
                <TabsTrigger value="routes" className="data-[state=active]:bg-brand-yellow">
                  <MapPin className="mr-2" size={16} />
                  Gestionar Rutas
                </TabsTrigger>
                <TabsTrigger value="attendance" className="data-[state=active]:bg-brand-yellow">
                  <UserCheck className="mr-2" size={16} />
                  Asistencias
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-brand-yellow">
                  <Settings className="mr-2" size={16} />
                  Configuración
                </TabsTrigger>
              </TabsList>

              <TabsContent value="routes" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-brand-dark">Gestión de Rutas</h2>
                  <Button variant="yellow" size="lg">
                    <Plus className="mr-2" size={20} />
                    Nueva Ruta
                  </Button>
                </div>

                {/* Upcoming Routes */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-brand-dark">Próximas Rutas ({upcomingRoutes.length})</CardTitle>
                    <CardDescription>
                      Rutas programadas para el futuro
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingRoutes.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingRoutes.map((route, index) => (
                          <motion.div
                            key={route.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 bg-brand-light/50 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-brand-dark">{route.title}</h3>
                                {route.description && (
                                  <p className="text-gray-600 mt-1">{route.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit size={16} className="mr-1" />
                                  Editar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                                  <Trash2 size={16} className="mr-1" />
                                  Eliminar
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-brand-gold" />
                                <span className="text-sm font-semibold">
                                  {format(new Date(route.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-brand-gold" />
                                <span className="text-sm">{route.kilometers} km</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users size={16} className="text-brand-gold" />
                                <span className="text-sm">
                                  {route.participantsCount} apuntados
                                  {route.maxParticipants && ` / ${route.maxParticipants} max`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Activa
                                </Badge>
                              </div>
                            </div>

                            {route.participants.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-brand-dark mb-2">Participantes:</p>
                                <div className="flex flex-wrap gap-2">
                                  {route.participants.map((participant) => (
                                    <Badge key={participant.id} variant="outline" className="text-xs">
                                      {participant.userName} 
                                      {participant.dogName && ` (${participant.dogName})`}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500">No hay rutas próximas programadas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-6">
                <h2 className="text-2xl font-bold text-brand-dark">Control de Asistencias</h2>

                {/* Past Routes for Attendance */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-brand-dark">Rutas Pasadas ({pastRoutes.length})</CardTitle>
                    <CardDescription>
                      Marca la asistencia real de los participantes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pastRoutes.length > 0 ? (
                      <div className="space-y-6">
                        {pastRoutes.map((route) => (
                          <div key={route.id} className="p-6 bg-gray-50 rounded-lg">
                            <div className="mb-4">
                              <h3 className="text-lg font-bold text-brand-dark">{route.title}</h3>
                              <p className="text-sm text-gray-600">
                                {format(new Date(route.date), 'dd/MM/yyyy HH:mm', { locale: es })} • {route.kilometers} km
                              </p>
                            </div>

                            {route.participants.length > 0 ? (
                              <div className="space-y-3">
                                {route.participants.map((participant) => (
                                  <div
                                    key={participant.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center">
                                        <span className="text-brand-dark font-semibold text-sm">
                                          {participant.userName?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-semibold text-brand-dark">
                                          {participant.userName}
                                          {participant.dogName && (
                                            <span className="text-gray-600 font-normal"> y {participant.dogName}</span>
                                          )}
                                        </p>
                                        <p className="text-xs text-gray-500">{participant.userEmail}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {participant.attended ? (
                                        <Badge className="bg-green-100 text-green-800">
                                          <CheckCircle size={14} className="mr-1" />
                                          Asistió
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="border-gray-300">
                                          <XCircle size={14} className="mr-1" />
                                          No asistió
                                        </Badge>
                                      )}
                                      
                                      <Button
                                        size="sm"
                                        variant={participant.attended ? "outline" : "default"}
                                        onClick={() => handleAttendanceToggle(participant.id, !participant.attended)}
                                        disabled={loadingParticipations.has(participant.id)}
                                      >
                                        {loadingParticipations.has(participant.id) ? (
                                          "..."
                                        ) : participant.attended ? (
                                          "Marcar falta"
                                        ) : (
                                          "Marcar asistencia"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">No hay participantes registrados</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500">No hay rutas pasadas para revisar</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <h2 className="text-2xl font-bold text-brand-dark">Configuración del Sistema</h2>
                
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-brand-dark">Acciones Rápidas</CardTitle>
                    <CardDescription>
                      Herramientas de administración del sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start h-16">
                        <Users className="mr-3" size={20} />
                        <div className="text-left">
                          <p className="font-semibold">Gestionar Usuarios</p>
                          <p className="text-xs text-gray-500">Ver y editar perfiles de usuarios</p>
                        </div>
                      </Button>

                      <Button variant="outline" className="justify-start h-16">
                        <BarChart3 className="mr-3" size={20} />
                        <div className="text-left">
                          <p className="font-semibold">Reportes y Estadísticas</p>
                          <p className="text-xs text-gray-500">Análisis detallado de la actividad</p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
