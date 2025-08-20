
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { User, Dog, Camera, Save, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface ProfileSetupClientProps {
  user: any;
}

const dogBreeds = [
  'Golden Retriever',
  'Pastor Alemán',
  'Labrador',
  'Border Collie',
  'Beagle',
  'Bulldog Francés',
  'Husky Siberiano',
  'Cocker Spaniel',
  'Mestizo',
  'Otro'
];

const dogImages = [
  'https://www.naomijenkinart.com/images/naomi-uploads/gallery-riley-wm.jpg',
  'https://i.pinimg.com/736x/c1/07/92/c10792b30e3a26d70a5933193faa923d.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4a/Black_Labrador_Retriever_portrait.jpg',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiyo8xH5oc4SfS3SfchgrrYu0tjgzkzjYwloB4-XhEi2n6717MlezsgeprsMy4ZPt27W4WDqv-TfiLkSod7sxGw0MsDJC06R5XsEgyoexFdV_IVfUoBacIUnFyhphqiPOwDl3wBQDDNATIX/s1600/Narla.jpg',
  'https://i.pinimg.com/736x/5a/8a/c4/5a8ac4771e5f7fd9610e01288f2ccd59.jpg',
  'https://m.media-amazon.com/images/I/71L8jWORIuL.jpg',
  'https://lh3.googleusercontent.com/msTFAPzxbXasE-Z70C1mThIHTeRFeNqXlxSi4-DY2dv9PDi7wWq0xhTyWEzsKOF8dx5FpW78D5s0nI-VXXhs3FE=s900',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/English_Cocker_Spaniel_black_portrait.jpg/1024px-English_Cocker_Spaniel_black_portrait.jpg'
];

export function ProfileSetupClient({ user }: ProfileSetupClientProps) {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const existingDog = user?.dogs?.[0];

  const [userForm, setUserForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    image: user?.image || ''
  });

  const [dogForm, setDogForm] = useState({
    name: existingDog?.name || '',
    breed: existingDog?.breed || '',
    image: existingDog?.image || dogImages[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userForm,
          dog: dogForm
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar perfil');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error?.message || 'Error al guardar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      <Header user={session?.user} />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="absolute left-4 top-20 md:relative md:left-0 md:top-0 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurar Perfiles</h1>
          <p className="text-gray-600">Completa la información tuya y de tu compañero perruno</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Perfil del Usuario */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center">
                  <User className="w-12 h-12 mx-auto text-orange-500 mb-3" />
                  <CardTitle className="text-xl">Tu Perfil</CardTitle>
                  <CardDescription>Información personal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar del usuario */}
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={userForm.image} alt="Tu foto" />
                      <AvatarFallback className="bg-orange-500 text-white text-2xl">
                        {userForm.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Cambiar foto
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        value={userForm.firstName}
                        onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={userForm.lastName}
                        onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Perfil del Perro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center">
                  <Dog className="w-12 h-12 mx-auto text-blue-500 mb-3" />
                  <CardTitle className="text-xl">Perfil de tu Perro</CardTitle>
                  <CardDescription>Información de tu compañero</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar del perro */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Image
                        src={dogForm.image}
                        alt="Foto del perro"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {dogImages.slice(0, 8).map((imgUrl, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setDogForm({ ...dogForm, image: imgUrl })}
                          className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                            dogForm.image === imgUrl ? 'border-blue-500 scale-110' : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Opción ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dogName">Nombre del perro *</Label>
                    <Input
                      id="dogName"
                      value={dogForm.name}
                      onChange={(e) => setDogForm({ ...dogForm, name: e.target.value })}
                      placeholder="Nombre de tu perro"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dogBreed">Raza</Label>
                    <Select 
                      value={dogForm.breed || "mestizo"} 
                      onValueChange={(value) => setDogForm({ ...dogForm, breed: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la raza" />
                      </SelectTrigger>
                      <SelectContent>
                        {dogBreeds.map((breed) => (
                          <SelectItem key={breed} value={breed.toLowerCase()}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
              disabled={isLoading || !userForm.firstName || !dogForm.name}
            >
              {isLoading ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Perfiles
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </main>
    </div>
  );
}
