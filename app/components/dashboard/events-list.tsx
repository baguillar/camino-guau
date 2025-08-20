
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, QrCode, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventsListProps {
  events: any[];
}

export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay eventos próximos</h3>
        <p className="text-gray-500">¡Pronto habrá nuevas aventuras!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Próximos Eventos</h2>
        <p className="text-gray-600">Únete a las aventuras del Camino Guau</p>
      </div>

      <div className="grid gap-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-gray-800">{event.name}</CardTitle>
                    <CardDescription className="mt-1 text-gray-600">
                      {event.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                  >
                    {event.kilometers} km
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {format(new Date(event.date), "EEEE, d 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {format(new Date(event.date), 'HH:mm')}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      // TODO: Implementar registro al evento
                    }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Apuntarme
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      // TODO: Implementar escáner QR
                    }}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Escanear QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
