
'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { Header } from '@/components/layout/header';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { EventsList } from '@/components/dashboard/events-list';
import { StampCollection } from '@/components/dashboard/stamp-collection';
import { AchievementsList } from '@/components/dashboard/achievements-list';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, MapPin, Calendar, Trophy, Award } from 'lucide-react';

interface DashboardClientProps {
  userProgress: any;
  upcomingEvents: any[];
  session: Session;
}

export function DashboardClient({ userProgress, upcomingEvents, session }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const user = userProgress?.user;
  const hasDog = user?.dogs && user.dogs.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      <Header user={session?.user} />
      
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Bienvenida */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            ¡Hola, {user?.firstName || session.user.name}! 🐕
          </h1>
          <p className="text-lg text-gray-600">
            {hasDog 
              ? `Tú y ${user.dogs[0].name} han recorrido ${userProgress?.totalKilometers || 0} km en su aventura`
              : 'Configura el perfil de tu perro para comenzar la aventura'
            }
          </p>
          {hasDog && userProgress?.totalKilometers > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">
                {userProgress.totalKilometers >= 1000 ? 'Leyenda del Camino' :
                 userProgress.totalKilometers >= 500 ? 'Aventurero Épico' :
                 userProgress.totalKilometers >= 100 ? 'Caminante Oro' :
                 userProgress.totalKilometers >= 50 ? 'Caminante Plata' :
                 userProgress.totalKilometers >= 25 ? 'Caminante Bronce' : 'Explorador Novato'}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Alerta si no tiene perro configurado */}
        {!hasDog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="text-center">
                <Dog className="w-12 h-12 mx-auto text-orange-500 mb-2" />
                <CardTitle className="text-orange-800">¡Configura a tu compañero!</CardTitle>
                <CardDescription>
                  Para comenzar tu aventura en el Camino Guau, necesitas configurar el perfil de tu perro
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <motion.a
                  href="/profile/setup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Dog className="w-5 h-5" />
                  Configurar Perfil
                </motion.a>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navegación por pestañas - Responsiva */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center overflow-x-auto px-2"
        >
          <div className="flex bg-white rounded-xl p-1 shadow-lg min-w-max">
            {[
              { id: 'overview', label: 'Progreso', icon: MapPin },
              { id: 'events', label: 'Eventos', icon: Calendar },
              { id: 'stamps', label: 'Sellos', icon: Trophy },
              { id: 'achievements', label: 'Logros', icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contenido por pestañas */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <ProgressOverview 
              userProgress={userProgress} 
              user={user}
            />
          )}
          
          {activeTab === 'events' && (
            <EventsList events={upcomingEvents} />
          )}
          
          {activeTab === 'stamps' && (
            <StampCollection 
              stamps={user?.userStamps || []}
              totalStamps={user?.userStamps?.length || 0}
            />
          )}
          
          {activeTab === 'achievements' && (
            <AchievementsList 
              achievements={user?.achievements || []}
              userProgress={userProgress}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}
