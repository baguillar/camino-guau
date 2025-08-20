
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Plus, QrCode, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function EventManagement() {
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    kilometers: ''
  });
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.kilometers) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          kilometers: parseFloat(newEvent.kilometers)
        })
      });

      if (response.ok) {
        const event = await response.json();
        setEvents([event, ...events]);
        setNewEvent({
          name: '',
          description: '',
          date: '',
          location: '',
          kilometers: ''
        });
        toast.success('Evento creado exitosamente');
      } else {
        toast.error('Error al crear el evento');
      }
    } catch (error) {
      toast.error('Error al crear el evento');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEventActive = async (eventId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event.id === eventId ? { ...event, isActive: !isActive } : event
        ));
        toast.success(`Evento ${!isActive ? 'activado' : 'desactivado'}`);
      }
    } catch (error) {
      toast.error('Error al actualizar el evento');
    }
  };

  const generateQRCode = (eventId: string, qrCode: string) => {
    // Aquí podrías implementar la generación/descarga del QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`;
    window.open(qrUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear evento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Evento
          </CardTitle>
          <CardDescription>
            Añade un nuevo evento al sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Nombre del Evento *</Label>
              <Input
                id="eventName"
                placeholder="ej. Ruta del Bosque Encantado"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventKilometers">Kilómetros *</Label>
              <Input
                id="eventKilometers"
                type="number"
                step="0.1"
                placeholder="5.5"
                value={newEvent.kilometers}
                onChange={(e) => setNewEvent({...newEvent, kilometers: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Fecha *</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventLocation">Ubicación</Label>
              <Input
                id="eventLocation"
                placeholder="ej. Parque Natural de..."
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDescription">Descripción</Label>
            <Textarea
              id="eventDescription"
              placeholder="Describe el evento, dificultad, qué llevar, etc."
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            />
          </div>

          <Button 
            onClick={createEvent} 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? 'Creando...' : 'Crear Evento'}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de eventos existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Existentes</CardTitle>
          <CardDescription>
            Gestiona los eventos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay eventos creados aún
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-600">{event.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={event.isActive ? 'default' : 'secondary'}>
                        {event.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEventActive(event.id, event.isActive)}
                      >
                        {event.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(event.date).toLocaleDateString('es-ES')} • {new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="font-semibold text-orange-600">
                      {event.kilometers} km
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500">
                      QR Code: <code className="bg-gray-100 px-2 py-1 rounded">{event.qrCode}</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateQRCode(event.id, event.qrCode)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Ver QR
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
