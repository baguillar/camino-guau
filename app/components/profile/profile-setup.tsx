
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { Dog, User, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileSetup() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Datos del usuario
  const [userImage, setUserImage] = useState(session?.user?.image || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Datos del perro
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogImage, setDogImage] = useState('');
  const [dogId, setDogId] = useState('');

  useEffect(() => {
    if (session?.user) {
      setFirstName((session.user as any).firstName || '');
      setLastName((session.user as any).lastName || '');
    }
  }, [session]);

  const handleUserUpdate = async () => {
    if (!firstName.trim()) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          image: userImage
        }),
      });

      if (response.ok) {
        await update({
          firstName,
          lastName,
          image: userImage
        });
        setStep(2);
        toast.success('Perfil actualizado');
      } else {
        throw new Error('Error actualizando perfil');
      }
    } catch (error) {
      toast.error('Error actualizando perfil');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDogCreate = async () => {
    if (!dogName.trim()) {
      toast.error('Por favor ingresa el nombre de tu perro');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dogName,
          breed: dogBreed,
          image: dogImage
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setDogId(result.dog.id);
        
        // Crear logro de bienvenida
        await fetch('/api/achievements/welcome', {
          method: 'POST',
        });

        toast.success(`¡Bienvenido al Camino Guau, ${dogName}! 🎉`);
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        throw new Error(result.error || 'Error creando perfil del perro');
      }
    } catch (error) {
      toast.error('Error creando perfil del perro');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        {/* Paso 1: Perfil del usuario */}
        {step === 1 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center"
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl">Configura tu perfil</CardTitle>
                <CardDescription>
                  Personaliza tu experiencia en el Camino Guau
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <ImageUpload
                  currentImage={userImage}
                  onImageChange={setUserImage}
                  type="user"
                  size="lg"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Tu nombre"
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Tus apellidos"
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <Button 
                onClick={handleUserUpdate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                {isLoading ? 'Guardando...' : 'Continuar'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Paso 2: Perfil del perro */}
        {step === 2 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
              >
                <Dog className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl">Presenta a tu compañero</CardTitle>
                <CardDescription>
                  Configura el perfil de tu perro para comenzar la aventura
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <ImageUpload
                  currentImage={dogImage}
                  onImageChange={setDogImage}
                  type="dog"
                  dogId={dogId}
                  size="lg"
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dogName">Nombre del perro *</Label>
                  <Input
                    id="dogName"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    placeholder="Ej: Buddy, Luna, Max..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dogBreed">Raza (opcional)</Label>
                  <Input
                    id="dogBreed"
                    value={dogBreed}
                    onChange={(e) => setDogBreed(e.target.value)}
                    placeholder="Ej: Golden Retriever, Mestizo..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">¡Medalla de Bienvenida!</h3>
                    <p className="text-sm text-green-600">Al completar tu perfil, recibirás tu primera medalla del Camino Guau</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleDogCreate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                {isLoading ? 'Creando perfil...' : '¡Comenzar aventura!'}
                <Dog className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
