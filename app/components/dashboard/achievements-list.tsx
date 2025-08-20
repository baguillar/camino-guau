
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Target } from 'lucide-react';
import Image from 'next/image';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  type: string;
  isUnlocked: boolean;
  progress?: number;
}

interface AchievementsListProps {
  achievements: any[];
  userProgress: any;
}

export function AchievementsList({ achievements, userProgress }: AchievementsListProps) {
  // Logros predefinidos del sistema
  const systemAchievements: Achievement[] = [
    {
      id: '1',
      name: 'Primeros Pasos',
      description: 'Completa tu primer evento',
      icon: 'https://cdn.abacus.ai/images/62987810-4aed-47bb-9db8-d06fc167b839.png',
      threshold: 1,
      type: 'events',
      isUnlocked: (userProgress?.eventsCompleted || 0) >= 1,
      progress: userProgress?.eventsCompleted || 0
    },
    {
      id: '2',
      name: 'Caminante Bronce',
      description: 'Recorre 25 kilómetros',
      icon: 'https://cdn.abacus.ai/images/62987810-4aed-47bb-9db8-d06fc167b839.png',
      threshold: 25,
      type: 'kilometers',
      isUnlocked: (userProgress?.totalKilometers || 0) >= 25,
      progress: userProgress?.totalKilometers || 0
    },
    {
      id: '3',
      name: 'Caminante Plata',
      description: 'Recorre 50 kilómetros',
      icon: 'https://cdn.abacus.ai/images/6bbd07d5-48a1-4dd6-9d47-0da23b49315e.png',
      threshold: 50,
      type: 'kilometers',
      isUnlocked: (userProgress?.totalKilometers || 0) >= 50,
      progress: userProgress?.totalKilometers || 0
    },
    {
      id: '4',
      name: 'Caminante Oro',
      description: 'Recorre 100 kilómetros - ¡Meta del Camino Guau!',
      icon: 'https://cdn.abacus.ai/images/9caa4760-9639-4746-8909-2b6bfc1ddd1f.png',
      threshold: 100,
      type: 'kilometers',
      isUnlocked: (userProgress?.totalKilometers || 0) >= 100,
      progress: userProgress?.totalKilometers || 0
    },
    {
      id: '5',
      name: 'Coleccionista',
      description: 'Colecciona 5 sellos digitales',
      icon: 'https://cdn.abacus.ai/images/78ab44ae-7e5f-4990-9d79-df0e36ed5086.png',
      threshold: 5,
      type: 'stamps',
      isUnlocked: (userProgress?.stampsCollected || 0) >= 5,
      progress: userProgress?.stampsCollected || 0
    },
    {
      id: '6',
      name: 'Peregrino Experto',
      description: 'Participa en 10 eventos',
      icon: 'https://cdn.abacus.ai/images/ff6c00cd-096d-4a50-9bdb-6831a32ff22c.png',
      threshold: 10,
      type: 'events',
      isUnlocked: (userProgress?.eventsCompleted || 0) >= 10,
      progress: userProgress?.eventsCompleted || 0
    }
  ];

  const unlockedCount = systemAchievements.filter(a => a.isUnlocked).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sistema de Logros</h2>
        <p className="text-gray-600 mb-4">
          Desbloquea logros completando desafíos y metas
        </p>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Award className="w-4 h-4 mr-2" />
          {unlockedCount} de {systemAchievements.length} desbloqueados
        </Badge>
      </div>

      <div className="grid gap-4">
        {systemAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all hover:shadow-lg ${
              achievement.isUnlocked
                ? 'bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-yellow-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Icono del logro */}
                  <div className={`relative w-16 h-16 ${
                    !achievement.isUnlocked ? 'filter grayscale opacity-60' : ''
                  }`}>
                    <Image
                      src={achievement.icon}
                      alt={achievement.name}
                      fill
                      className="object-contain"
                    />
                    {achievement.isUnlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Información del logro */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          achievement.isUnlocked ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${
                          achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      <Badge 
                        variant={achievement.isUnlocked ? "default" : "secondary"}
                        className={achievement.isUnlocked ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {achievement.isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                      </Badge>
                    </div>

                    {/* Barra de progreso */}
                    {!achievement.isUnlocked && achievement.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progreso</span>
                          <span>{achievement.progress}/{achievement.threshold}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((achievement.progress / achievement.threshold) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {unlockedCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100"
        >
          <Target className="w-16 h-16 mx-auto text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold text-purple-700 mb-2">¡Desbloquea tu primer logro!</h3>
          <p className="text-purple-600 max-w-md mx-auto">
            Participa en eventos y completa desafíos para comenzar a desbloquear increíbles logros.
          </p>
        </motion.div>
      )}
    </div>
  );
}
