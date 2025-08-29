

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Dog, Loader2 } from 'lucide-react'
import { DogCard } from './dog-card'
import { DogForm } from './dog-form'
import { toast } from 'sonner'
import { DogSex } from '@prisma/client'

interface Dog {
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

export function DogsManagement() {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDog, setEditingDog] = useState<Dog | undefined>(undefined)

  useEffect(() => {
    fetchDogs()
  }, [])

  const fetchDogs = async () => {
    try {
      const response = await fetch('/api/dogs')
      
      if (!response.ok) {
        throw new Error('Error al cargar los perros')
      }

      const data = await response.json()
      setDogs(data.dogs)
    } catch (error) {
      console.error('Error fetching dogs:', error)
      toast.error('Error al cargar los perros')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDog = () => {
    setEditingDog(undefined)
    setIsFormOpen(true)
  }

  const handleEditDog = (dog: Dog) => {
    setEditingDog(dog)
    setIsFormOpen(true)
  }

  const handleDeleteDog = (dogId: string) => {
    setDogs(prev => prev.filter(dog => dog.id !== dogId))
  }

  const handleFormSave = () => {
    setIsFormOpen(false)
    setEditingDog(undefined)
    fetchDogs() // Refresh the list
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingDog(undefined)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Cargando perros...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dog className="h-5 w-5" />
            <span>Mis Perros</span>
          </CardTitle>
          <CardDescription>
            Gestiona la información de tus perros para una mejor experiencia en los paseos
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              {dogs.length === 0 
                ? 'No tienes perros registrados' 
                : `Tienes ${dogs.length} perro${dogs.length !== 1 ? 's' : ''} registrado${dogs.length !== 1 ? 's' : ''}`
              }
            </p>
            <Button onClick={handleAddDog}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Perro
            </Button>
          </div>

          {dogs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Dog className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No tienes perros registrados
              </h3>
              <p className="text-gray-500 mb-4">
                Añade información sobre tus perros para personalizar tu experiencia
              </p>
              <Button onClick={handleAddDog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Registrar mi primer perro
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  onEdit={handleEditDog}
                  onDelete={handleDeleteDog}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDog ? 'Editar Perro' : 'Registrar Nuevo Perro'}
            </DialogTitle>
          </DialogHeader>
          <DogForm
            dog={editingDog}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
