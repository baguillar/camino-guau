
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Lock } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface StampCollectionProps {
  stamps: any[];
  totalStamps: number;
}

// Función para obtener color de rareza
const getRarityColor = (rarity: string) => {
  switch (rarity?.toLowerCase()) {
    case 'legendary':
      return 'from-purple-500 to-pink-500 border-purple-300';
    case 'epic':
      return 'from-purple-400 to-indigo-500 border-purple-200';
    case 'rare':
      return 'from-blue-400 to-cyan-500 border-blue-200';
    case 'common':
    default:
      return 'from-gray-300 to-gray-400 border-gray-200';
  }
};

// Función para obtener color de texto de rareza
const getRarityTextColor = (rarity: string) => {
  switch (rarity?.toLowerCase()) {
    case 'legendary':
      return 'text-purple-800';
    case 'epic':
      return 'text-indigo-800';
    case 'rare':
      return 'text-blue-800';
    case 'common':
    default:
      return 'text-gray-800';
  }
};

export function StampCollection({ stamps, totalStamps }: StampCollectionProps) {
  const [availableStamps, setAvailableStamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const collectedStampIds = stamps.map(userStamp => userStamp.stamp?.id);

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const response = await fetch('/api/stamps');
        if (response.ok) {
          const stampsData = await response.json();
          setAvailableStamps(stampsData);
        }
      } catch (error) {
        console.error('Error fetching stamps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStamps();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Colección de Sellos</h2>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Colección de Sellos</h2>
        <p className="text-gray-600 mb-4">
          Has coleccionado {totalStamps} de {availableStamps.length} sellos disponibles
        </p>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Star className="w-4 h-4 mr-2" />
          {availableStamps.length > 0 ? Math.round((totalStamps / availableStamps.length) * 100) : 0}% Completado
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {availableStamps.map((stamp, index) => {
          const isCollected = collectedStampIds.includes(stamp.id);
          const rarityColor = getRarityColor(stamp.rarity);
          const textColor = getRarityTextColor(stamp.rarity);
          
          return (
            <motion.div
              key={stamp.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all hover:shadow-xl ${
                isCollected 
                  ? `bg-gradient-to-br ${rarityColor} shadow-lg transform hover:scale-105` 
                  : 'bg-gray-50 border-gray-200 hover:shadow-md'
              }`}>
                <CardHeader className="pb-2 text-center">
                  <div className={`relative w-20 h-20 mx-auto mb-2 ${
                    !isCollected ? 'filter grayscale opacity-40' : ''
                  }`}>
                    <Image
                      src={stamp.image}
                      alt={stamp.name}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                    {!isCollected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <Lock className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <CardTitle className={`text-sm font-bold ${
                    isCollected ? textColor : 'text-gray-500'
                  }`}>
                    {stamp.name}
                  </CardTitle>
                  {stamp.rarity && isCollected && (
                    <Badge variant="outline" className={`text-xs ${textColor} border-current mt-1`}>
                      {stamp.rarity.charAt(0).toUpperCase() + stamp.rarity.slice(1)}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  <p className={`text-xs ${
                    isCollected ? textColor : 'text-gray-400'
                  }`}>
                    {stamp.description}
                  </p>
                  {isCollected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${rarityColor} rounded-full flex items-center justify-center shadow-lg`}>
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {totalStamps === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100"
        >
          <Trophy className="w-16 h-16 mx-auto text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-blue-700 mb-2">¡Comienza tu colección!</h3>
          <p className="text-blue-600 max-w-md mx-auto">
            Participa en eventos y completa desafíos para desbloquear increíbles sellos digitales con diferentes niveles de rareza.
          </p>
        </motion.div>
      )}

      {totalStamps > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200"
        >
          <div className="flex justify-center items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-bold text-green-800">
              ¡{totalStamps} sello{totalStamps !== 1 ? 's' : ''} desbloqueado{totalStamps !== 1 ? 's' : ''}!
            </span>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-green-600">
            Sigue participando en eventos para completar tu colección
          </p>
        </motion.div>
      )}
    </div>
  );
}
