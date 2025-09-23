
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  User, 
  Dog,
  Target,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    role: string;
  };
  dog: {
    id: string;
    name: string;
    age: number | null;
    breed: string | null;
    characterWithPeople: string | null;
    characterWithDogs: string | null;
    isCastrated: boolean;
    profileImage: string | null;
  } | null;
  stats: {
    totalEvents: number;
    totalKilometers: number;
    totalAchievements: number;
  };
  recentParticipations: Array<{
    id: string;
    route: {
      title: string;
      kilometers: number;
      date: string;
    };
    attendedAt: string | null;
  }>;
  recentAchievements: Array<{
    id: string;
    achievement: {
      name: string;
      description: string;
      medalIcon: string;
    };
    unlockedAt: string;
  }>;
}

export function DashboardClient({ 
  user, 
  dog, 
  stats, 
  recentParticipations, 
  recentAchievements 
}: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              ¡Bienvenido de vuelta, <span className="text-brand-gold">{user.name}</span>!
            </h1>
            {dog && (
              <p className="text-xl text-gray-600">
                Listo para nuevas aventuras con <span className="font-semibold text-brand-dark">{dog.name}</span> 🐕
              </p>
            )}
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-brand-yellow to-brand-gold text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-brand-dark/80 font-semibold">Eventos Completados</p>
                      <p className="text-4xl font-bold text-brand-dark mt-2">{stats.totalEvents}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Calendar className="text-brand-dark" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-brand-dark to-gray-800 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 font-semibold">Kilómetros Totales</p>
                      <p className="text-4xl font-bold mt-2">{stats.totalKilometers.toFixed(1)} km</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <MapPin className="text-white" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-brand-gold to-orange-500 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 font-semibold">Medallas Ganadas</p>
                      <p className="text-4xl font-bold mt-2">{stats.totalAchievements}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Trophy className="text-white" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brand-dark">
                    <Award className="text-brand-gold" />
                    Logros Recientes
                  </CardTitle>
                  <CardDescription>Tus últimas medallas desbloqueadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentAchievements.length > 0 ? (
                    <div className="space-y-4">
                      {recentAchievements.map((ua, index) => (
                        <motion.div
                          key={ua.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-brand-light/50 rounded-lg"
                        >
                          <div className="text-4xl">{ua.achievement.medalIcon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-brand-dark">{ua.achievement.name}</h4>
                            <p className="text-sm text-gray-600">{ua.achievement.description}</p>
                            <p className="text-xs text-brand-gold font-medium mt-1">
                              Desbloqueado {format(new Date(ua.unlockedAt), 'dd/MM/yyyy', { locale: es })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500">¡Participa en rutas para desbloquear medallas!</p>
                    </div>
                  )}
                  <div className="mt-6">
                    <Link href="/profile">
                      <Button variant="outline" className="w-full">
                        Ver Todas las Medallas
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brand-dark">
                    <User className="text-brand-gold" />
                    Mi Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Info */}
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-brand-yellow rounded-full flex items-center justify-center text-2xl mb-3">
                      {user.profileImage ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden relative">
                          <Image
                            src={user.profileImage}
                            alt={user.name || 'Usuario'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-brand-dark">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-brand-dark">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  {/* Dog Info */}
                  {dog && (
                    <>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Dog className="text-brand-gold" size={20} />
                          <span className="font-semibold text-brand-dark">Mi Compañero</span>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto bg-brand-light rounded-full flex items-center justify-center text-xl mb-2">
                            {dog.profileImage ? (
                              <div className="w-16 h-16 rounded-full overflow-hidden relative">
                                <Image
                                  src={dog.profileImage}
                                  alt={dog.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              '🐕'
                            )}
                          </div>
                          <h4 className="font-semibold text-brand-dark">{dog.name}</h4>
                          <p className="text-sm text-gray-600">
                            {dog.age && `${dog.age} años`} {dog.breed && ` • ${dog.breed}`}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <Link href="/profile">
                    <Button variant="yellow" className="w-full">
                      Editar Perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-dark">
                  <TrendingUp className="text-brand-gold" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>Tus últimas participaciones en rutas</CardDescription>
              </CardHeader>
              <CardContent>
                {recentParticipations.length > 0 ? (
                  <div className="space-y-4">
                    {recentParticipations.map((participation, index) => (
                      <motion.div
                        key={participation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center">
                          <MapPin className="text-brand-dark" size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-brand-dark">{participation.route.title}</h4>
                          <p className="text-sm text-gray-600">
                            {participation.route.kilometers} km • {format(new Date(participation.route.date), 'dd/MM/yyyy', { locale: es })}
                          </p>
                        </div>
                        <div className="text-brand-gold">
                          <Target size={20} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">¡No has participado en rutas aún!</p>
                    <Link href="/routes">
                      <Button variant="yellow" className="mt-4">
                        Explorar Rutas
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Link href="/routes">
              <Button variant="yellow" size="lg" className="w-full h-16 text-lg">
                <MapPin className="mr-2" />
                Explorar Rutas
              </Button>
            </Link>
            
            <Link href="/ranking">
              <Button variant="outline" size="lg" className="w-full h-16 text-lg">
                <Trophy className="mr-2" />
                Ver Ranking
              </Button>
            </Link>
            
            <Link href="/profile">
              <Button variant="secondary" size="lg" className="w-full h-16 text-lg">
                <User className="mr-2" />
                Mi Perfil
              </Button>
            </Link>

            {user.role === 'ADMIN' && (
              <Link href="/admin">
                <Button variant="gold" size="lg" className="w-full h-16 text-lg">
                  <Zap className="mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
