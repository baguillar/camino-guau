
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, MapPin, Calendar, User } from 'lucide-react';
import Image from 'next/image';

interface RankingUser {
  id: string;
  name: string | null;
  profileImage: string | null;
  dog: {
    name: string;
    profileImage: string | null;
  } | null;
  stats: {
    totalKilometers: number;
    totalEvents: number;
    totalAchievements: number;
  };
  position: number;
  isCurrentUser: boolean;
}

interface RankingClientProps {
  ranking: RankingUser[];
  currentUserId: string;
}

export function RankingClient({ ranking }: RankingClientProps) {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <span className="text-2xl font-bold text-brand-dark">#{position}</span>;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-brand-light to-brand-light/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              <Trophy className="inline-block mr-3 text-brand-gold" size={48} />
              Ranking <span className="text-brand-gold">Oficial</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los aventureros con más kilómetros recorridos junto a sus compañeros peludos
            </p>
          </motion.div>

          {/* Top 3 Podium */}
          {ranking.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Second Place */}
                <div className="md:order-1 flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative"
                  >
                    <Card className="w-full max-w-sm bg-gradient-to-br from-gray-100 to-gray-200 border-0 shadow-xl">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 mx-auto bg-brand-yellow rounded-full flex items-center justify-center overflow-hidden">
                            {ranking[1].profileImage ? (
                              <Image
                                src={ranking[1].profileImage}
                                alt={ranking[1].name || 'Usuario'}
                                width={80}
                                height={80}
                                className="object-cover"
                              />
                            ) : (
                              <User size={40} className="text-brand-dark" />
                            )}
                          </div>
                          <div className="absolute -top-2 -right-2">
                            <Medal className="text-gray-400" size={28} />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-brand-dark mb-1">
                          {ranking[1].name}
                        </h3>
                        {ranking[1].dog && (
                          <p className="text-sm text-gray-600 mb-3">y {ranking[1].dog.name}</p>
                        )}
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-brand-dark">
                            {ranking[1].stats.totalKilometers} km
                          </p>
                          <p className="text-xs text-gray-600">
                            {ranking[1].stats.totalEvents} eventos • {ranking[1].stats.totalAchievements} medallas
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* First Place */}
                <div className="md:order-2 flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <Card className="w-full max-w-sm bg-gradient-to-br from-yellow-200 to-yellow-400 border-0 shadow-xl scale-110">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                            {ranking[0].profileImage ? (
                              <Image
                                src={ranking[0].profileImage}
                                alt={ranking[0].name || 'Usuario'}
                                width={96}
                                height={96}
                                className="object-cover"
                              />
                            ) : (
                              <User size={48} className="text-brand-dark" />
                            )}
                          </div>
                          <div className="absolute -top-3 -right-1">
                            <Crown className="text-yellow-600" size={32} />
                          </div>
                        </div>
                        <h3 className="font-bold text-xl text-brand-dark mb-1">
                          {ranking[0].name}
                        </h3>
                        {ranking[0].dog && (
                          <p className="text-sm text-brand-dark/70 mb-3 font-medium">y {ranking[0].dog.name}</p>
                        )}
                        <div className="space-y-1">
                          <p className="text-3xl font-bold text-brand-dark">
                            {ranking[0].stats.totalKilometers} km
                          </p>
                          <p className="text-sm text-brand-dark/70 font-semibold">
                            {ranking[0].stats.totalEvents} eventos • {ranking[0].stats.totalAchievements} medallas
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Third Place */}
                <div className="md:order-3 flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <Card className="w-full max-w-sm bg-gradient-to-br from-amber-100 to-amber-300 border-0 shadow-xl">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 mx-auto bg-brand-yellow rounded-full flex items-center justify-center overflow-hidden">
                            {ranking[2].profileImage ? (
                              <Image
                                src={ranking[2].profileImage}
                                alt={ranking[2].name || 'Usuario'}
                                width={80}
                                height={80}
                                className="object-cover"
                              />
                            ) : (
                              <User size={40} className="text-brand-dark" />
                            )}
                          </div>
                          <div className="absolute -top-2 -right-2">
                            <Award className="text-amber-600" size={28} />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-brand-dark mb-1">
                          {ranking[2].name}
                        </h3>
                        {ranking[2].dog && (
                          <p className="text-sm text-gray-600 mb-3">y {ranking[2].dog.name}</p>
                        )}
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-brand-dark">
                            {ranking[2].stats.totalKilometers} km
                          </p>
                          <p className="text-xs text-gray-600">
                            {ranking[2].stats.totalEvents} eventos • {ranking[2].stats.totalAchievements} medallas
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Full Ranking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-center text-brand-dark text-2xl">
                  Clasificación Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ranking.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={`
                        p-4 rounded-lg transition-all duration-300 hover:shadow-md
                        ${user.isCurrentUser ? 'ring-2 ring-brand-gold bg-brand-yellow/20' : 'bg-gray-50'}
                        ${getPositionBg(user.position)}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        {/* Position */}
                        <div className="flex-shrink-0 w-12 flex justify-center">
                          {getPositionIcon(user.position)}
                        </div>

                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center overflow-hidden">
                            {user.profileImage ? (
                              <Image
                                src={user.profileImage}
                                alt={user.name || 'Usuario'}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <User size={24} className="text-brand-dark" />
                            )}
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-brand-dark">
                              {user.name}
                              {user.isCurrentUser && (
                                <span className="ml-2 text-brand-gold text-sm">(Tú)</span>
                              )}
                            </h3>
                          </div>
                          {user.dog && (
                            <p className="text-sm text-gray-600">con {user.dog.name}</p>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex-shrink-0 text-right">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} className="text-brand-gold" />
                              <span className="font-bold text-brand-dark">
                                {user.stats.totalKilometers} km
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={16} className="text-brand-dark" />
                              <span>{user.stats.totalEvents}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy size={16} className="text-brand-gold" />
                              <span>{user.stats.totalAchievements}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {ranking.length === 0 && (
                  <div className="text-center py-8">
                    <Trophy className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      ¡Sé el primero en aparecer en el ranking participando en rutas!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
