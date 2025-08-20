
'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users, MapPin } from 'lucide-react';

interface RankingClientProps {
  usersRanking: any[];
  currentUserId: string;
  userPosition: number;
  session: Session;
}

export function RankingClient({ usersRanking, currentUserId, userPosition, session }: RankingClientProps) {
  const [activeTab, setActiveTab] = useState('kilometers');

  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (position === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (position === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{position}</span>;
  };

  const getRankColor = (position: number) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (position === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (position === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600';
    return 'bg-gradient-to-r from-blue-400 to-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      <Header user={session?.user} />
      
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-orange-500" />
            Comunidad Guau
          </h1>
          <p className="text-lg text-gray-600">
            Ve cómo te comparas con otros aventureros perrunos
          </p>
        </motion.div>

        {/* Tu posición */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-orange-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Tu Posición Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  #{userPosition}
                </div>
                <div className="text-center">
                  <p className="font-semibold">{session.user?.name}</p>
                  <p className="text-sm text-gray-600">¡Sigue así!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs de rankings */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kilometers">🏃‍♀️ Kilómetros</TabsTrigger>
            <TabsTrigger value="stamps">🎭 Sellos</TabsTrigger>
            <TabsTrigger value="events">📅 Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="kilometers" className="space-y-4">
            <div className="grid gap-4">
              {usersRanking.slice(0, 20).map((userProgress, index) => (
                <motion.div
                  key={userProgress.user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`transition-all hover:scale-105 ${
                    userProgress.user.id === currentUserId ? 'ring-2 ring-orange-300' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={userProgress.user.image || userProgress.user.dogs?.[0]?.image} 
                            alt={userProgress.user.firstName || userProgress.user.name} 
                          />
                          <AvatarFallback>
                            {(userProgress.user.firstName || userProgress.user.name)?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {userProgress.user.firstName || userProgress.user.name}
                            </h3>
                            {userProgress.user.dogs?.[0] && (
                              <span className="text-sm text-gray-500">
                                & {userProgress.user.dogs[0].name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-lg font-bold text-orange-600">
                              {userProgress.totalKilometers} km
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {userProgress.eventsCompleted} eventos
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {userProgress.stampsCollected} sellos
                            </Badge>
                          </div>
                        </div>

                        {index < 3 && (
                          <div className={`w-2 h-16 rounded-full ${getRankColor(index + 1)}`} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stamps" className="space-y-4">
            <div className="grid gap-4">
              {[...usersRanking]
                .sort((a, b) => b.stampsCollected - a.stampsCollected)
                .slice(0, 20)
                .map((userProgress, index) => (
                  <motion.div
                    key={userProgress.user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`transition-all hover:scale-105 ${
                      userProgress.user.id === currentUserId ? 'ring-2 ring-orange-300' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <Avatar className="h-12 w-12">
                            <AvatarImage 
                              src={userProgress.user.image || userProgress.user.dogs?.[0]?.image} 
                              alt={userProgress.user.firstName || userProgress.user.name} 
                            />
                            <AvatarFallback>
                              {(userProgress.user.firstName || userProgress.user.name)?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {userProgress.user.firstName || userProgress.user.name}
                              </h3>
                              {userProgress.user.dogs?.[0] && (
                                <span className="text-sm text-gray-500">
                                  & {userProgress.user.dogs[0].name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-lg font-bold text-purple-600">
                                {userProgress.stampsCollected} sellos
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {userProgress.totalKilometers} km
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {userProgress.eventsCompleted} eventos
                              </Badge>
                            </div>
                          </div>

                          {index < 3 && (
                            <div className={`w-2 h-16 rounded-full ${getRankColor(index + 1)}`} />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="grid gap-4">
              {[...usersRanking]
                .sort((a, b) => b.eventsCompleted - a.eventsCompleted)
                .slice(0, 20)
                .map((userProgress, index) => (
                  <motion.div
                    key={userProgress.user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`transition-all hover:scale-105 ${
                      userProgress.user.id === currentUserId ? 'ring-2 ring-orange-300' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <Avatar className="h-12 w-12">
                            <AvatarImage 
                              src={userProgress.user.image || userProgress.user.dogs?.[0]?.image} 
                              alt={userProgress.user.firstName || userProgress.user.name} 
                            />
                            <AvatarFallback>
                              {(userProgress.user.firstName || userProgress.user.name)?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {userProgress.user.firstName || userProgress.user.name}
                              </h3>
                              {userProgress.user.dogs?.[0] && (
                                <span className="text-sm text-gray-500">
                                  & {userProgress.user.dogs[0].name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-lg font-bold text-green-600">
                                {userProgress.eventsCompleted} eventos
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {userProgress.totalKilometers} km
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {userProgress.stampsCollected} sellos
                              </Badge>
                            </div>
                          </div>

                          {index < 3 && (
                            <div className={`w-2 h-16 rounded-full ${getRankColor(index + 1)}`} />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
