
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, UserPlus, Code, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function KilometerManagement() {
  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [kilometers, setKilometers] = useState('');
  const [eventName, setEventName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para códigos de entrada
  const [newCode, setNewCode] = useState({
    eventId: '',
    kilometers: '',
    expiresAt: ''
  });
  const [generatedCodes, setGeneratedCodes] = useState<any[]>([]);

  const searchUsers = async () => {
    if (!searchUser.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchUser)}`);
      if (response.ok) {
        const users = await response.json();
        // Aquí manejarías la lista de usuarios encontrados
        console.log('Usuarios encontrados:', users);
      }
    } catch (error) {
      toast.error('Error al buscar usuarios');
    }
  };

  const addKilometersToUser = async () => {
    if (!selectedUser || !kilometers || !eventName) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/kilometers/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          kilometers: parseFloat(kilometers),
          eventName,
          addedBy: 'admin'
        })
      });

      if (response.ok) {
        setKilometers('');
        setEventName('');
        setSelectedUser(null);
        toast.success('Kilómetros añadidos exitosamente');
      } else {
        toast.error('Error al añadir kilómetros');
      }
    } catch (error) {
      toast.error('Error al añadir kilómetros');
    } finally {
      setIsLoading(false);
    }
  };

  const generateEntryCode = async () => {
    if (!newCode.eventId || !newCode.kilometers) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch('/api/admin/entry-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCode,
          kilometers: parseFloat(newCode.kilometers)
        })
      });

      if (response.ok) {
        const code = await response.json();
        setGeneratedCodes([code, ...generatedCodes]);
        setNewCode({
          eventId: '',
          kilometers: '',
          expiresAt: ''
        });
        toast.success('Código generado exitosamente');
      } else {
        toast.error('Error al generar el código');
      }
    } catch (error) {
      toast.error('Error al generar el código');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado al portapapeles');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">➕ Añadir Manual</TabsTrigger>
          <TabsTrigger value="codes">🔐 Códigos de Entrada</TabsTrigger>
          <TabsTrigger value="history">📝 Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Añadir Kilómetros Manualmente
              </CardTitle>
              <CardDescription>
                Busca un usuario y añádele kilómetros de forma manual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Buscador de usuario */}
              <div className="space-y-2">
                <Label htmlFor="searchUser">Buscar Usuario</Label>
                <div className="flex gap-2">
                  <Input
                    id="searchUser"
                    placeholder="Buscar por nombre o email..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                  <Button onClick={searchUsers} variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Usuario seleccionado */}
              {selectedUser && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">Usuario Seleccionado:</h3>
                  <p>{selectedUser.name} ({selectedUser.email})</p>
                  <p className="text-sm text-gray-600">
                    Kilómetros actuales: {selectedUser.userProgress?.totalKilometers || 0} km
                  </p>
                </div>
              )}

              {/* Formulario para añadir kilómetros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kilometers">Kilómetros a Añadir</Label>
                  <Input
                    id="kilometers"
                    type="number"
                    step="0.1"
                    placeholder="5.5"
                    value={kilometers}
                    onChange={(e) => setKilometers(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventName">Nombre del Evento</Label>
                  <Input
                    id="eventName"
                    placeholder="ej. Ruta del Bosque"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={addKilometersToUser} 
                disabled={isLoading || !selectedUser}
                className="w-full md:w-auto"
              >
                {isLoading ? 'Añadiendo...' : 'Añadir Kilómetros'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generar Códigos de Entrada
              </CardTitle>
              <CardDescription>
                Crea códigos únicos que los usuarios pueden canjear por kilómetros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codeEventId">ID del Evento</Label>
                  <Input
                    id="codeEventId"
                    placeholder="Introduce el ID del evento"
                    value={newCode.eventId}
                    onChange={(e) => setNewCode({...newCode, eventId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codeKilometers">Kilómetros</Label>
                  <Input
                    id="codeKilometers"
                    type="number"
                    step="0.1"
                    placeholder="5.5"
                    value={newCode.kilometers}
                    onChange={(e) => setNewCode({...newCode, kilometers: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codeExpires">Expira (Opcional)</Label>
                  <Input
                    id="codeExpires"
                    type="datetime-local"
                    value={newCode.expiresAt}
                    onChange={(e) => setNewCode({...newCode, expiresAt: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={generateEntryCode} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Generar Código
              </Button>
            </CardContent>
          </Card>

          {/* Códigos generados */}
          {generatedCodes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Códigos Generados</CardTitle>
                <CardDescription>
                  Códigos disponibles para entregar a los usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedCodes.map((code, index) => (
                    <motion.div
                      key={code.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-mono text-lg font-bold">
                          {code.code}
                        </div>
                        <div className="text-sm text-gray-600">
                          {code.kilometers} km • Evento: {code.eventId}
                        </div>
                        {code.expiresAt && (
                          <div className="text-xs text-gray-500">
                            Expira: {new Date(code.expiresAt).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={code.isUsed ? 'secondary' : 'default'}>
                          {code.isUsed ? 'Usado' : 'Disponible'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyCode(code.code)}
                        >
                          Copiar
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Kilómetros</CardTitle>
              <CardDescription>
                Registro de todas las adiciones de kilómetros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Historial de kilómetros (por implementar)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
