
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trophy, Calendar, Star, Target, Award } from 'lucide-react';
import Image from 'next/image';
import { CountingNumber } from '@/components/ui/counting-number';
import { ProgressOverviewMobile } from './progress-overview-mobile';

interface ProgressOverviewProps {
  userProgress: any;
  user: any;
}

export function ProgressOverview({ userProgress, user }: ProgressOverviewProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (isMobile) {
    return <ProgressOverviewMobile userProgress={userProgress} user={user} />;
  }
  const progress = userProgress || {
    totalKilometers: 0,
    eventsCompleted: 0,
    stampsCollected: 0,
    currentLevel: 1,
    experiencePoints: 0
  };

  // Sistema de hitos expandido más allá de 100km
  const milestones = [25, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000];
  
  // Encontrar el próximo hito
  const nextMilestone = milestones.find(milestone => progress.totalKilometers < milestone);
  const currentTarget = nextMilestone || milestones[milestones.length - 1];
  
  // Calcular progreso hacia el siguiente hito
  const previousMilestone = milestones.find((_, index) => milestones[index + 1] === nextMilestone) || 0;
  const progressToNext = nextMilestone ? 
    ((progress.totalKilometers - previousMilestone) / (nextMilestone - previousMilestone)) * 100 : 100;
  
  const dog = user?.dogs?.[0];
  const achievements = user?.achievements || [];

  // Determinar el nivel basado en kilómetros
  const getLevel = (km: number) => {
    if (km >= 2000) return 'Leyenda del Camino';
    if (km >= 1500) return 'Maestro Peregrino';
    if (km >= 1000) return 'Gran Caminante';
    if (km >= 750) return 'Explorador Supremo';
    if (km >= 500) return 'Aventurero Épico';
    if (km >= 300) return 'Caminante Heroico';
    if (km >= 200) return 'Explorador Avanzado';
    if (km >= 150) return 'Peregrino Experto';
    if (km >= 100) return 'Caminante Oro';
    if (km >= 50) return 'Caminante Plata';
    if (km >= 25) return 'Caminante Bronce';
    return 'Explorador Novato';
  };

  const currentLevel = getLevel(progress.totalKilometers);

  return (
    <div className="space-y-6">
      {/* Progreso Principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Pasaporte Digital */}
        <Card className="bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 text-white shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
              <MapPin className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Pasaporte Digital</CardTitle>
            <CardDescription className="text-orange-100">
              Tu progreso en el Camino Guau
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <CountingNumber value={progress.totalKilometers} />
                <span className="text-2xl ml-1">km</span>
              </div>
              <p className="text-orange-100">
                {nextMilestone ? `Siguiente hito: ${nextMilestone} km` : '¡Leyenda completada!'}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {nextMilestone ? `Progreso a ${nextMilestone} km` : 'Progreso máximo'}
                </span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="bg-white/20 [&>div]:bg-white" />
            </div>

            <div className="text-center text-sm space-y-2">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-base px-4 py-2">
                {currentLevel}
              </Badge>
              {nextMilestone && (
                <p className="text-orange-100">
                  Faltan {nextMilestone - progress.totalKilometers} km para el siguiente nivel
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información del Perro */}
        {dog && (
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto relative mb-3">
                {dog.image ? (
                  <Image
                    src={dog.image}
                    alt={dog.name}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {dog.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">{dog.name}</CardTitle>
              <CardDescription>{dog.breed || 'Raza mixta'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    <CountingNumber value={progress.eventsCompleted} />
                  </div>
                  <p className="text-sm text-gray-600">Eventos</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    <CountingNumber value={progress.stampsCollected} />
                  </div>
                  <p className="text-sm text-gray-600">Sellos</p>
                </div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className="gap-2 px-3 py-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {currentLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Estadísticas Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            icon: Target, 
            value: progress.totalKilometers, 
            label: 'Kilómetros', 
            color: 'text-orange-600 bg-orange-100',
            suffix: ' km'
          },
          { 
            icon: Calendar, 
            value: progress.eventsCompleted, 
            label: 'Eventos', 
            color: 'text-blue-600 bg-blue-100' 
          },
          { 
            icon: Trophy, 
            value: progress.stampsCollected, 
            label: 'Sellos', 
            color: 'text-green-600 bg-green-100' 
          },
          { 
            icon: Award, 
            value: achievements.length, 
            label: 'Logros', 
            color: 'text-purple-600 bg-purple-100' 
          }
        ].map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">
                <CountingNumber value={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Logros Recientes */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Logros Desbloqueados
              </CardTitle>
              <CardDescription>
                Tus últimos logros conseguidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.slice(0, 4).map((userAchievement: any, index: number) => (
                  <motion.div
                    key={userAchievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{userAchievement.achievement?.name}</p>
                      <p className="text-sm text-gray-600">{userAchievement.achievement?.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
