

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { Dog, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { DogSex } from '@prisma/client'

const dogFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  breed: z.string().optional(),
  sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).default('UNKNOWN'),
  age: z.number().int().min(0).max(30).optional(),
  photo: z.string().url().optional(),
  obedience: z.number().int().min(1).max(10).default(5),
  socializationWithDogs: z.number().int().min(1).max(10).default(5),
  socializationWithPeople: z.number().int().min(1).max(10).default(5),
  specialCharacteristic: z.string().max(200).optional()
})

type DogFormData = z.infer<typeof dogFormSchema>

interface DogFormProps {
  dog?: {
    id: string
    name: string
    breed?: string | null
    sex: DogSex
    age?: number | null
    photo?: string | null
    obedience: number
    socializationWithDogs: number
    socializationWithPeople: number
    specialCharacteristic?: string | null
  }
  onSave: () => void
  onCancel: () => void
}

export function DogForm({ dog, onSave, onCancel }: DogFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(dog?.photo || null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DogFormData>({
    resolver: zodResolver(dogFormSchema),
    defaultValues: {
      name: dog?.name || '',
      breed: dog?.breed || '',
      sex: dog?.sex || 'UNKNOWN',
      age: dog?.age || undefined,
      photo: dog?.photo || undefined,
      obedience: dog?.obedience || 5,
      socializationWithDogs: dog?.socializationWithDogs || 5,
      socializationWithPeople: dog?.socializationWithPeople || 5,
      specialCharacteristic: dog?.specialCharacteristic || ''
    }
  })

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 5MB.')
      return
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Solo se permiten imágenes.')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al subir la imagen')
      }

      const data = await response.json()
      setValue('photo', data.url)
      setPhotoPreview(data.url)
      toast.success('Imagen subida correctamente')
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: DogFormData) => {
    setIsLoading(true)

    try {
      const url = dog ? `/api/dogs/${dog.id}` : '/api/dogs'
      const method = dog ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar el perro')
      }

      toast.success(dog ? 'Perro actualizado correctamente' : 'Perro registrado correctamente')
      onSave()
    } catch (error) {
      console.error('Error saving dog:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar el perro')
    } finally {
      setIsLoading(false)
    }
  }

  const watchedObedience = watch('obedience')
  const watchedSocializationDogs = watch('socializationWithDogs')
  const watchedSocializationPeople = watch('socializationWithPeople')

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Dog className="h-5 w-5" />
          <span>{dog ? 'Editar Perro' : 'Registrar Nuevo Perro'}</span>
        </CardTitle>
        <CardDescription>
          {dog ? 'Actualiza la información de tu perro' : 'Añade la información de tu perro para una mejor experiencia'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-4">
            <Label>Foto del Perro</Label>
            <div className="flex items-center space-x-4">
              {photoPreview && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="w-full"
                />
                {isUploading && (
                  <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Subiendo imagen...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Nombre de tu perro"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                {...register('breed')}
                placeholder="Ej: Labrador, Pastor Alemán, Mestizo..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sexo</Label>
              <Select
                value={watch('sex') || 'UNKNOWN'}
                onValueChange={(value: DogSex) => setValue('sex', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Macho</SelectItem>
                  <SelectItem value="FEMALE">Hembra</SelectItem>
                  <SelectItem value="UNKNOWN">No especificado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad (años)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="30"
                {...register('age', { valueAsNumber: true })}
                placeholder="Edad en años"
              />
            </div>
          </div>

          {/* Behavioral Characteristics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Características de Comportamiento</h3>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Obediencia: {watchedObedience}/10</Label>
                <Slider
                  value={[watchedObedience]}
                  onValueChange={(value) => setValue('obedience', value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  1 = Poco obediente, 10 = Muy obediente
                </p>
              </div>

              <div className="space-y-3">
                <Label>Socialización con perros: {watchedSocializationDogs}/10</Label>
                <Slider
                  value={[watchedSocializationDogs]}
                  onValueChange={(value) => setValue('socializationWithDogs', value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  1 = Tímido/Agresivo, 10 = Muy sociable
                </p>
              </div>

              <div className="space-y-3">
                <Label>Socialización con personas: {watchedSocializationPeople}/10</Label>
                <Slider
                  value={[watchedSocializationPeople]}
                  onValueChange={(value) => setValue('socializationWithPeople', value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  1 = Tímido/Agresivo, 10 = Muy sociable
                </p>
              </div>
            </div>
          </div>

          {/* Special Characteristic */}
          <div className="space-y-2">
            <Label htmlFor="specialCharacteristic">Característica Especial</Label>
            <Textarea
              id="specialCharacteristic"
              {...register('specialCharacteristic')}
              placeholder="Algo especial sobre tu perro que te gustaría compartir..."
              rows={3}
            />
            {errors.specialCharacteristic && (
              <p className="text-sm text-red-600">{errors.specialCharacteristic.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {dog ? 'Actualizar' : 'Registrar'} Perro
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
