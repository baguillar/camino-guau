
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bell, Users, User, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function NotificationCenter() {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'general',
    targetUsers: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);

  const notificationTypes = [
    { value: 'general', label: 'General', icon: Bell },
    { value: 'event', label: 'Evento', icon: Calendar },
    { value: 'achievement', label: 'Logro', icon: Trophy },
    { value: 'milestone', label: 'Hito', icon: Users }
  ];

  const targetOptions = [
    { value: 'all', label: 'Todos los usuarios', icon: Users },
    { value: 'active', label: 'Solo usuarios activos', icon: User },
    { value: 'admins', label: 'Solo administradores', icon: User }
  ];

  const sendNotification = async () => {
    if (!notification.title || !notification.message) {
      toast.error('Completa el título y mensaje');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });

      if (response.ok) {
        const result = await response.json();
        setSentNotifications([result, ...sentNotifications]);
        setNotification({
          title: '',
          message: '',
          type: 'general',
          targetUsers: 'all'
        });
        toast.success(`Notificación enviada a ${result.recipients} usuarios`);
      } else {
        toast.error('Error al enviar la notificación');
      }
    } catch (error) {
      toast.error('Error al enviar la notificación');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      const response = await fetch('/api/admin/notifications/test', {
        method: 'POST'
      });

      if (response.ok) {
        toast.success('Notificación de prueba enviada');
      }
    } catch (error) {
      toast.error('Error al enviar notificación de prueba');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">📤 Enviar</TabsTrigger>
          <TabsTrigger value="templates">📝 Plantillas</TabsTrigger>
          <TabsTrigger value="history">📊 Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Enviar Notificación Push
              </CardTitle>
              <CardDescription>
                Envía notificaciones instantáneas a los usuarios de la app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationTitle">Título *</Label>
                  <Input
                    id="notificationTitle"
                    placeholder="ej. ¡Nuevo evento disponible!"
                    value={notification.title}
                    onChange={(e) => setNotification({...notification, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificationType">Tipo</Label>
                  <Select value={notification.type} onValueChange={(value) => setNotification({...notification, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationMessage">Mensaje *</Label>
                <Textarea
                  id="notificationMessage"
                  placeholder="Describe el contenido de la notificación..."
                  value={notification.message}
                  onChange={(e) => setNotification({...notification, message: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetUsers">Destinatarios</Label>
                <Select value={notification.targetUsers} onValueChange={(value) => setNotification({...notification, targetUsers: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetOptions.map((target) => (
                      <SelectItem key={target.value} value={target.value}>
                        <div className="flex items-center gap-2">
                          <target.icon className="h-4 w-4" />
                          {target.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={sendNotification} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Notificación'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={sendTestNotification}
                >
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas Predefinidas</CardTitle>
              <CardDescription>
                Plantillas rápidas para notificaciones comunes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Nuevo Evento",
                    message: "¡Hemos añadido un nuevo evento emocionante! Revisa los detalles en la app.",
                    type: "event"
                  },
                  {
                    title: "¡Logro Desbloqueado!",
                    message: "¡Felicidades! Has desbloqueado un nuevo logro. ¡Sigue así!",
                    type: "achievement"
                  },
                  {
                    title: "Recordatorio de Evento",
                    message: "No olvides el evento de mañana. ¡Te esperamos!",
                    type: "event"
                  },
                  {
                    title: "Milestone Alcanzado",
                    message: "¡Increíble! Has alcanzado un nuevo hito en tu aventura.",
                    type: "milestone"
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => setNotification({
                    ...notification,
                    title: template.title,
                    message: template.message,
                    type: template.type
                  })}>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold">{template.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.message}</p>
                      <Badge variant="outline" className="mt-2">
                        {template.type}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Notificaciones</CardTitle>
              <CardDescription>
                Notificaciones enviadas recientemente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sentNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay notificaciones enviadas aún
                </div>
              ) : (
                <div className="space-y-4">
                  {sentNotifications.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{notif.title}</h3>
                          <p className="text-sm text-gray-600">{notif.message}</p>
                        </div>
                        <Badge variant="outline">
                          {notif.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Enviada a {notif.recipients} usuarios</span>
                        <span>{new Date(notif.createdAt).toLocaleDateString('es-ES')} • {new Date(notif.createdAt).toLocaleTimeString('es-ES')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
