
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock,
  CheckCircle,
  AlertCircle,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Route {
  id: string;
  title: string;
  description: string | null;
  kilometers: number;
  date: string;
  maxParticipants: number | null;
  createdBy: string | null;
  isUserRegistered: boolean;
  participantsCount: number;
  averageRating: number;
  reviewsCount: number;
  createdAt: string;
}

interface RoutesClientProps {
  routes: Route[];
  currentUserId: string;
}

export function RoutesClient({ routes, currentUserId }: RoutesClientProps) {
  const [loadingRoutes, setLoadingRoutes] = useState<Set<string>>(new Set());

  const handleRegistration = async (routeId: string, isRegistering: boolean) => {
    setLoadingRoutes(prev => new Set(prev).add(routeId));
    
    try {
      const response = await fetch('/api/routes/register', {
        method: isRegistering ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al procesar la solicitud');
        return;
      }

      toast.success(isRegistering ? '¡Te has apuntado exitosamente!' : 'Te has desapuntado de la ruta');
      
      // Refresh the page to update the data
      window.location.reload();
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoadingRoutes(prev => {
        const newSet = new Set(prev);
        newSet.delete(routeId);
        return newSet;
      });
    }
  };

  const getRouteStatus = (route: Route) => {
    const now = new Date();
    const routeDate = new Date(route.date);
    const isExpired = routeDate < now;
    const isFull = route.maxParticipants && route.participantsCount >= route.maxParticipants;

    if (isExpired) return { status: 'expired', label: 'Expirada', color: 'bg-gray-500' };
    if (isFull) return { status: 'full', label: 'Completa', color: 'bg-red-500' };
    if (route.isUserRegistered) return { status: 'registered', label: 'Apuntado', color: 'bg-green-500' };
    return { status: 'available', label: 'Disponible', color: 'bg-brand-yellow' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Rutas <span className="text-brand-gold">Disponibles</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuevas aventuras para compartir con tu perro. Apúntate a las rutas que más te interesen.
            </p>
          </motion.div>

          {/* Routes Grid */}
          {routes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route, index) => {
                const routeStatus = getRouteStatus(route);
                const isLoading = loadingRoutes.has(route.id);
                const canRegister = routeStatus.status === 'available' || routeStatus.status === 'registered';
                const routeDate = new Date(route.date);
                const isExpired = routeDate < new Date();

                return (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
                      {/* Status Badge */}
                      <div className="relative">
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className={`${routeStatus.color} text-white border-0`}>
                            {routeStatus.label}
                          </Badge>
                        </div>
                        
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-brand-dark to-brand-gold p-6 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={20} />
                            <h3 className="text-xl font-bold">{route.title}</h3>
                          </div>
                          <p className="text-white/90 text-sm">
                            Organizado por {route.createdBy || 'Admin'}
                          </p>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        {/* Description */}
                        {route.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {route.description}
                          </p>
                        )}

                        {/* Route Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-brand-dark">
                            <Calendar size={16} />
                            <span className="text-sm font-semibold">
                              {format(routeDate, 'EEEE, dd MMMM yyyy', { locale: es })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-brand-dark">
                            <Clock size={16} />
                            <span className="text-sm">
                              {format(routeDate, 'HH:mm', { locale: es })} horas
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-brand-dark">
                            <MapPin size={16} />
                            <span className="text-sm font-semibold">
                              {route.kilometers} kilómetros
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-brand-dark">
                            <Users size={16} />
                            <span className="text-sm">
                              {route.participantsCount} apuntados
                              {route.maxParticipants && ` / ${route.maxParticipants} max`}
                            </span>
                          </div>

                          {/* Rating */}
                          {route.reviewsCount > 0 && (
                            <div className="flex items-center gap-2">
                              <Star className="text-brand-yellow fill-current" size={16} />
                              <span className="text-sm font-semibold">
                                {route.averageRating} ({route.reviewsCount} valoraciones)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                          {isExpired ? (
                            <Button disabled className="w-full" variant="outline">
                              <AlertCircle size={16} className="mr-2" />
                              Ruta Expirada
                            </Button>
                          ) : routeStatus.status === 'full' && !route.isUserRegistered ? (
                            <Button disabled className="w-full" variant="outline">
                              <Users size={16} className="mr-2" />
                              Ruta Completa
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleRegistration(route.id, !route.isUserRegistered)}
                              disabled={isLoading || !canRegister}
                              className="w-full"
                              variant={route.isUserRegistered ? "outline" : "yellow"}
                            >
                              {isLoading ? (
                                "Procesando..."
                              ) : route.isUserRegistered ? (
                                <>
                                  <CheckCircle size={16} className="mr-2" />
                                  Desapuntarse
                                </>
                              ) : (
                                <>
                                  <Heart size={16} className="mr-2" />
                                  Apuntarse
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <MapPin className="mx-auto h-24 w-24 text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-brand-dark mb-4">
                No hay rutas disponibles
              </h2>
              <p className="text-gray-600 mb-8">
                Actualmente no hay rutas programadas. ¡Mantente atento para nuevas aventuras!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
