
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, Heart, Dog, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // User form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Dog data
    dogName: '',
    dogAge: '',
    dogBreed: '',
    dogCharacterWithPeople: '',
    dogCharacterWithDogs: '',
    dogIsCastrated: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.dogName) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al crear la cuenta');
        return;
      }

      toast.success('¡Cuenta creada exitosamente!');
      
      // Automatically sign in
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Error al iniciar sesión automáticamente');
        router.push('/auth/signin');
      } else {
        router.replace('/dashboard');
      }

    } catch (error) {
      toast.error('Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-dark">
            <User size={20} />
            Información Personal
          </CardTitle>
          <CardDescription>
            Datos básicos para tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-brand-dark">
              Nombre completo *
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-brand-dark">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-brand-dark">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-dark"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-brand-dark">
                Confirmar contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-dark"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dog Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-dark">
            <Dog size={20} />
            Información de tu Perro
          </CardTitle>
          <CardDescription>
            Cuéntanos sobre tu compañero de aventuras
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dog Name and Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dogName" className="text-sm font-semibold text-brand-dark">
                Nombre del perro *
              </label>
              <Input
                id="dogName"
                type="text"
                placeholder="Nombre de tu perro"
                value={formData.dogName}
                onChange={(e) => handleInputChange('dogName', e.target.value)}
                className="border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dogAge" className="text-sm font-semibold text-brand-dark">
                Edad (años)
              </label>
              <Input
                id="dogAge"
                type="number"
                placeholder="Edad"
                min="0"
                max="25"
                value={formData.dogAge}
                onChange={(e) => handleInputChange('dogAge', e.target.value)}
                className="border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
              />
            </div>
          </div>

          {/* Dog Breed */}
          <div className="space-y-2">
            <label htmlFor="dogBreed" className="text-sm font-semibold text-brand-dark">
              Raza
            </label>
            <Input
              id="dogBreed"
              type="text"
              placeholder="Ej: Golden Retriever, Mestizo, etc."
              value={formData.dogBreed}
              onChange={(e) => handleInputChange('dogBreed', e.target.value)}
              className="border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
            />
          </div>

          {/* Character descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dogCharacterWithPeople" className="text-sm font-semibold text-brand-dark">
                Carácter con personas
              </label>
              <Textarea
                id="dogCharacterWithPeople"
                placeholder="Ej: Muy sociable y cariñoso"
                value={formData.dogCharacterWithPeople}
                onChange={(e) => handleInputChange('dogCharacterWithPeople', e.target.value)}
                className="border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dogCharacterWithDogs" className="text-sm font-semibold text-brand-dark">
                Carácter con otros perros
              </label>
              <Textarea
                id="dogCharacterWithDogs"
                placeholder="Ej: Juguetón y amigable"
                value={formData.dogCharacterWithDogs}
                onChange={(e) => handleInputChange('dogCharacterWithDogs', e.target.value)}
                className="border-gray-200 focus:border-brand-yellow focus:ring-brand-yellow"
                rows={3}
              />
            </div>
          </div>

          {/* Castrated checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dogIsCastrated"
              checked={formData.dogIsCastrated}
              onCheckedChange={(checked) => handleInputChange('dogIsCastrated', checked)}
            />
            <label 
              htmlFor="dogIsCastrated" 
              className="text-sm font-medium text-brand-dark cursor-pointer"
            >
              Mi perro está castrado/esterilizado
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="yellow"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta y Comenzar Aventura'}
      </Button>
    </form>
  );
}
