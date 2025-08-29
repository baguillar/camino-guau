

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dog, Edit, Trash2, MoreVertical, Heart, Users } from 'lucide-react'
import Image from 'next/image'
import { DogSex } from '@prisma/client'
import { toast } from 'sonner'

interface DogCardProps {
  dog: {
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
  onEdit: (dog: any) => void
  onDelete: (dogId: string) => void
}

export function DogCard({ dog, onEdit, onDelete }: DogCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const getSexLabel = (sex: DogSex) => {
    switch (sex) {
      case 'MALE': return 'Macho'
      case 'FEMALE': return 'Hembra'
      default: return 'No especificado'
    }
  }

  const getSexColor = (sex: DogSex) => {
    switch (sex) {
      case 'MALE': return 'bg-blue-100 text-blue-800'
      case 'FEMALE': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${dog.name}?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/dogs/${dog.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el perro')
      }

      toast.success('Perro eliminado correctamente')
      onDelete(dog.id)
    } catch (error) {
      console.error('Error deleting dog:', error)
      toast.error('Error al eliminar el perro')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {dog.photo ? (
                <Image
                  src={dog.photo}
                  alt={dog.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Dog className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{dog.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getSexColor(dog.sex)}>
                  {getSexLabel(dog.sex)}
                </Badge>
                {dog.age && (
                  <Badge variant="outline">{dog.age} años</Badge>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(dog)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {dog.breed && (
          <div>
            <p className="text-sm font-medium text-gray-600">Raza</p>
            <p className="text-lg">{dog.breed}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
            </div>
            <p className="text-xs text-gray-500">Obediencia</p>
            <p className="text-lg font-semibold">{dog.obedience}/10</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-1">
              <Dog className="h-4 w-4 mr-1 text-amber-500" />
            </div>
            <p className="text-xs text-gray-500">Con Perros</p>
            <p className="text-lg font-semibold">{dog.socializationWithDogs}/10</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 mr-1 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500">Con Personas</p>
            <p className="text-lg font-semibold">{dog.socializationWithPeople}/10</p>
          </div>
        </div>

        {dog.specialCharacteristic && (
          <div className="border-t pt-3">
            <p className="text-sm font-medium text-gray-600 mb-1">Característica Especial</p>
            <p className="text-sm text-gray-700 line-clamp-2">{dog.specialCharacteristic}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
