
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Shield, ShieldCheck, Eye, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface UserManagementProps {
  recentUsers: any[];
}

export function UserManagement({ recentUsers }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(recentUsers);

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !isAdmin })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isAdmin: !isAdmin } : user
        ));
        toast.success(`Usuario ${!isAdmin ? 'promovido a' : 'removido de'} administrador`);
      }
    } catch (error) {
      toast.error('Error al actualizar el usuario');
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setUsers(recentUsers);
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const searchResults = await response.json();
        setUsers(searchResults);
      }
    } catch (error) {
      toast.error('Error al buscar usuarios');
    }
  };

  const resetUserPassword = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST'
      });

      if (response.ok) {
        const { tempPassword } = await response.json();
        toast.success(`Contraseña temporal: ${tempPassword}`);
      }
    } catch (error) {
      toast.error('Error al resetear la contraseña');
    }
  };

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            />
            <Button onClick={searchUsers}>
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Gestiona los usuarios registrados en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image} alt={user.firstName || user.name} />
                    <AvatarFallback>
                      {(user.firstName || user.name)?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {user.firstName || user.name}
                      </h3>
                      {user.isAdmin && (
                        <Badge variant="destructive">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {user.userProgress?.totalKilometers || 0} km
                      </span>
                      <span>
                        {user.userProgress?.eventsCompleted || 0} eventos
                      </span>
                      <span>
                        {user.dogs?.length || 0} perro(s)
                      </span>
                      <span>
                        Desde {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                  >
                    {user.isAdmin ? (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Remover Admin
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Hacer Admin
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resetUserPassword(user.id)}
                  >
                    Resetear Contraseña
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-center">
              {users.filter(u => u.isAdmin).length}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Administradores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-center">
              {users.filter(u => u.userProgress?.totalKilometers > 0).length}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Usuarios Activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-center">
              {users.filter(u => u.dogs?.length > 0).length}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Con Perros Registrados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
