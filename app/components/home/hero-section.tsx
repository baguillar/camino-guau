
'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-light via-white to-brand-light/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://i.etsystatic.com/31715137/r/il/318760/3318728368/il_fullxfull.3318728368_s0u8.jpg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23343344' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-brand-yellow rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-4xl">🐕‍🦺</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center">
                  <Trophy size={16} className="text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-brand-dark mb-6 leading-tight">
              Camino <span className="text-brand-gold">Guau</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              La plataforma definitiva para <span className="font-semibold text-brand-gold">compartir aventuras</span> de senderismo con tu perro. Registra kilómetros, gana medallas y conecta con otros amantes de los perros.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/signup">
                <Button size="lg" variant="yellow" className="text-lg px-8 py-3 shadow-lg">
                  Comenzar Aventura
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center">
                    <MapPin className="text-brand-dark" size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">Rutas Épicas</h3>
                <p className="text-gray-600">Descubre nuevas aventuras cada semana con tu compañero peludo</p>
              </motion.div>

              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center">
                    <Trophy className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">30 Medallas</h3>
                <p className="text-gray-600">Desbloquea logros únicos y demuestra tu dedicación</p>
              </motion.div>

              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">Comunidad</h3>
                <p className="text-gray-600">Conecta con otros aventureros y sus perros</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
