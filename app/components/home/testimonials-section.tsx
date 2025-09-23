
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'María González',
    dogName: 'Luna',
    content: 'Camino Guau ha transformado nuestros fines de semana. Luna está más feliz que nunca y hemos conocido a una comunidad increíble de amantes de los perros.',
    rating: 5,
    avatar: '👩',
    dogAvatar: '🐕'
  },
  {
    name: 'Carlos Mendoza',
    dogName: 'Max',
    content: 'Las medallas me motivan cada semana a participar. Max y yo ya llevamos 15 rutas completadas y no paramos de descubrir lugares nuevos.',
    rating: 5,
    avatar: '👨',
    dogAvatar: '🦮'
  },
  {
    name: 'Ana Rodríguez',
    dogName: 'Coco',
    content: 'El sistema de ranking me encanta. Es sano competir con otros usuarios y ver cómo Coco se divierte tanto en cada aventura.',
    rating: 5,
    avatar: '👩‍🦰',
    dogAvatar: '🐶'
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-light/30 to-white">
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
              Lo que dicen nuestros <span className="text-brand-gold">aventureros</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Miles de perros y sus humanos ya viven aventuras increíbles con Camino Guau
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-brand-yellow text-brand-yellow" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 mb-6 italic">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center text-2xl">
                          {testimonial.avatar}
                        </div>
                        <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-lg">
                          {testimonial.dogAvatar}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-dark">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">y {testimonial.dogName}</p>
                      </div>
                    </div>
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
