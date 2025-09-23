
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Trophy, 
  Calendar, 
  Star, 
  Camera, 
  BarChart3,
  Users,
  Award
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Rutas de Senderismo',
    description: 'Únete a rutas organizadas semanalmente. El admin crea nuevas aventuras y tú decides en cuáles participar.',
    color: 'bg-brand-yellow',
    textColor: 'text-brand-dark'
  },
  {
    icon: Calendar,
    title: 'Registro de Participación',
    description: 'Apúntate fácilmente a las rutas que te interesen. El admin confirma tu asistencia real después del evento.',
    color: 'bg-brand-gold',
    textColor: 'text-white'
  },
  {
    icon: Trophy,
    title: 'Sistema de Medallas',
    description: '30 medallas únicas que se desbloquean automáticamente: eventos totales, kilómetros, rachas consecutivas y completar meses.',
    color: 'bg-brand-dark',
    textColor: 'text-white'
  },
  {
    icon: BarChart3,
    title: 'Ranking Público',
    description: 'Compite sanamente con otros usuarios. Ve tu posición en el ranking de kilómetros con fotos de perfil.',
    color: 'bg-brand-light',
    textColor: 'text-brand-dark'
  },
  {
    icon: Star,
    title: 'Valoraciones de Rutas',
    description: 'Valora cada ruta del 1 al 5 estrellas y deja comentarios para ayudar a otros aventureros.',
    color: 'bg-brand-yellow',
    textColor: 'text-brand-dark'
  },
  {
    icon: Camera,
    title: 'Perfiles con Fotos',
    description: 'Sube fotos tuyas y de tu perro. Personaliza tu perfil con toda la información de tu compañero peludo.',
    color: 'bg-brand-gold',
    textColor: 'text-white'
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
              Todo lo que necesitas para tus <span className="text-brand-gold">aventuras</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Camino Guau no es solo una app, es tu compañero perfecto para vivir experiencias únicas con tu perro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="mb-4">
                      <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-4 mx-auto`}>
                        <feature.icon className={`w-8 h-8 ${feature.textColor}`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-brand-dark text-center">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
