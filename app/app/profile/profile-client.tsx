
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Dog, 
  Trophy, 
  MapPin, 
  Calendar, 
  Edit,
  Lock,
  Unlock,
  Star,
  Target,
  Award
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProfileClientProps {
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
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    medalIcon: string;
    isUnlocked: boolean;
    unlockedAt: string | null;
  }>;
  recentParticipations: Array<{
    id: string;
    route: {
      title: string;
      kilometers: number;
      date: string;
    };
    attendedAt: string | null;
  }>;
}

export function ProfileClient({ user, dog, stats, achievements, recentParticipations }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState('achievements');

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  const achievementsByType = {
    EVENTS_TOTAL: achievements.filter(a => a.type === 'EVENTS_TOTAL'),
    KILOMETERS_TOTAL: achievements.filter(a => a.type === 'KILOMETERS_TOTAL'),
    EVENTS_CONSECUTIVE: achievements.filter(a => a.type === 'EVENTS_CONSECUTIVE'),
    MONTHLY_COMPLETE: achievements.filter(a => a.type === 'MONTHLY_COMPLETE'),
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EVENTS_TOTAL': return 'Eventos Totales';
      case 'KILOMETERS_TOTAL': return 'Kilómetros Totales';
      case 'EVENTS_CONSECUTIVE': return 'Eventos Consecutivos';
      case 'MONTHLY_COMPLETE': return 'Completar Meses';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header with User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* User Profile Card */}
            <Card className="lg:col-span-1 shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto bg-brand-yellow rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.name || 'Usuario'}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <User size={48} className="text-brand-dark" />
                  )}
                </div>
                <CardTitle className="text-brand-dark">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {user.role === 'ADMIN' && (
                  <Badge className="bg-brand-gold text-white w-fit mx-auto">
                    Administrador
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Edit size={16} className="mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Dog Profile Card */}
            {dog && (
              <Card className="lg:col-span-1 shadow-xl border-0">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto bg-brand-light rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {dog.profileImage ? (
                      <Image
                        src={dog.profileImage}
                        alt={dog.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🐕</span>
                    )}
                  </div>
                  <CardTitle className="text-brand-dark flex items-center justify-center gap-2">
                    <Dog size={20} />
                    {dog.name}
                  </CardTitle>
                  <CardDescription>
                    {dog.age && `${dog.age} años`} {dog.breed && ` • ${dog.breed}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dog.characterWithPeople && (
                    <div>
                      <p className="text-sm font-semibold text-brand-dark">Con personas:</p>
                      <p className="text-sm text-gray-600">{dog.characterWithPeople}</p>
                    </div>
                  )}
                  {dog.characterWithDogs && (
                    <div>
                      <p className="text-sm font-semibold text-brand-dark">Con otros perros:</p>
                      <p className="text-sm text-gray-600">{dog.characterWithDogs}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-dark">Castrado:</span>
                    <Badge variant={dog.isCastrated ? "default" : "secondary"}>
                      {dog.isCastrated ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Edit size={16} className="mr-2" />
                    Editar Info del Perro
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stats Card */}
            <Card className="lg:col-span-1 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-dark">
                  <Trophy className="text-brand-gold" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-dark mb-1">
                    {stats.totalKilometers} km
                  </div>
                  <p className="text-sm text-gray-600">Total recorridos</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-brand-dark">
                      {stats.totalEvents}
                    </div>
                    <p className="text-xs text-gray-600">Eventos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-brand-dark">
                      {stats.totalAchievements}
                    </div>
                    <p className="text-xs text-gray-600">Medallas</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-brand-gold">
                    {Math.round((stats.totalAchievements / achievements.length) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Progreso total</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-brand-light">
                <TabsTrigger value="achievements" className="data-[state=active]:bg-brand-yellow">
                  <Award className="mr-2" size={16} />
                  Medallas
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-brand-yellow">
                  <MapPin className="mr-2" size={16} />
                  Actividad
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-brand-yellow">
                  <Target className="mr-2" size={16} />
                  Progreso
                </TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="space-y-6">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-brand-dark">
                      Mis Medallas ({unlockedAchievements.length}/{achievements.length})
                    </CardTitle>
                    <CardDescription>
                      Todas las medallas que has desbloqueado en tus aventuras
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <AnimatePresence>
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                              p-4 rounded-lg text-center transition-all duration-300 hover:scale-105
                              ${achievement.isUnlocked 
                                ? 'bg-gradient-to-br from-brand-yellow to-brand-gold cursor-pointer' 
                                : 'bg-gray-100 opacity-60'
                              }
                            `}
                            title={achievement.description}
                          >
                            <div className="text-3xl mb-2">
                              {achievement.isUnlocked ? achievement.medalIcon : '🔒'}
                            </div>
                            <p className={`text-xs font-semibold ${
                              achievement.isUnlocked ? 'text-brand-dark' : 'text-gray-500'
                            }`}>
                              {achievement.name}
                            </p>
                            {achievement.isUnlocked && achievement.unlockedAt && (
                              <p className="text-xs text-brand-dark/70 mt-1">
                                {format(new Date(achievement.unlockedAt), 'dd/MM', { locale: es })}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-brand-dark">Actividad Reciente</CardTitle>
                    <CardDescription>
                      Tu historial de participaciones en rutas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentParticipations.length > 0 ? (
                      <div className="space-y-4">
                        {recentParticipations.map((participation, index) => (
                          <motion.div
                            key={participation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-brand-light/50 rounded-lg"
                          >
                            <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center">
                              <MapPin className="text-brand-dark" size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-brand-dark">
                                {participation.route.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {participation.route.kilometers} km • {format(new Date(participation.route.date), 'dd/MM/yyyy', { locale: es })}
                              </p>
                            </div>
                            <div className="text-brand-gold">
                              <Star size={20} fill="currentColor" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500">¡No has participado en rutas aún!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                {Object.entries(achievementsByType).map(([type, typeAchievements]) => (
                  <Card key={type} className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-brand-dark">{getTypeLabel(type)}</CardTitle>
                      <CardDescription>
                        {typeAchievements.filter(a => a.isUnlocked).length} de {typeAchievements.length} desbloqueadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {typeAchievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`
                              p-4 rounded-lg border-2 transition-all duration-300
                              ${achievement.isUnlocked 
                                ? 'border-brand-gold bg-brand-yellow/20' 
                                : 'border-gray-200 bg-gray-50'
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {achievement.isUnlocked ? (
                                  <Unlock className="text-brand-gold" size={24} />
                                ) : (
                                  <Lock className="text-gray-400" size={24} />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-semibold ${
                                  achievement.isUnlocked ? 'text-brand-dark' : 'text-gray-500'
                                }`}>
                                  {achievement.medalIcon} {achievement.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {achievement.description}
                                </p>
                                {achievement.isUnlocked && achievement.unlockedAt && (
                                  <p className="text-xs text-brand-gold font-semibold mt-2">
                                    Desbloqueada {format(new Date(achievement.unlockedAt), 'dd/MM/yyyy', { locale: es })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
