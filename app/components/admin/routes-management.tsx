
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  MapPin,
  Plus,
  Edit2,
  Users,
  Star,
  Trash2,
  Route as RouteIcon,
  Mountain,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface EventRoute {
  id: string
  name: string
  description: string | null
  location: string
  distance: number
  difficulty: string
  isActive: boolean
  createdAt: Date
  walks: Array<{
    id: string
    user: { name: string | null }
    rating: number | null
  }>
}

interface RoutesManagementProps {
  routes: EventRoute[]
}

const difficultyLabels = {
  EASY: { label: 'Fácil', color: 'bg-green-100 text-green-800' },
  MEDIUM: { label: 'Intermedio', color: 'bg-yellow-100 text-yellow-800' },
  HARD: { label: 'Difícil', color: 'bg-red-100 text-red-800' }
}

export function RoutesManagement({ routes: initialRoutes }: RoutesManagementProps) {
  const [routes, setRoutes] = useState(initialRoutes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<EventRoute | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    distance: '',
    difficulty: 'EASY'
  })
  
  const { toast } = useToast()
  const router = useRouter()

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      distance: '',
      difficulty: 'EASY'
    })
    setEditingRoute(null)
  }

  const openEditDialog = (route: EventRoute) => {
    setEditingRoute(route)
    setFormData({
      name: route.name,
      description: route.description || '',
      location: route.location,
      distance: route.distance.toString(),
      difficulty: route.difficulty
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.location || !formData.distance) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const url = editingRoute ? `/api/admin/routes/${editingRoute.id}` : '/api/admin/routes'
      const method = editingRoute ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          distance: parseFloat(formData.distance)
        }),
      })

      if (response.ok) {
        const updatedRoute = await response.json()
        
        if (editingRoute) {
          setRoutes(routes.map(r => r.id === editingRoute.id ? updatedRoute : r))
          toast({
            title: "¡Ruta actualizada! ✅",
            description: `${formData.name} ha sido actualizada correctamente.`,
          })
        } else {
          setRoutes([updatedRoute, ...routes])
          toast({
            title: "¡Nueva ruta creada! 🎉",
            description: `${formData.name} está lista para los usuarios.`,
          })
        }

        setIsDialogOpen(false)
        resetForm()
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "No se pudo guardar la ruta.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salió mal. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRouteStatus = async (route: EventRoute) => {
    try {
      const response = await fetch(`/api/admin/routes/${route.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...route,
          isActive: !route.isActive
        }),
      })

      if (response.ok) {
        const updatedRoute = await response.json()
        setRoutes(routes.map(r => r.id === route.id ? updatedRoute : r))
        toast({
          title: route.isActive ? "Ruta desactivada" : "Ruta activada",
          description: `${route.name} está ahora ${route.isActive ? 'inactiva' : 'activa'}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado de la ruta.",
        variant: "destructive",
      })
    }
  }

  const getRouteStats = (route: EventRoute) => {
    const totalWalks = route.walks.length
    const avgRating = route.walks.length > 0 
      ? route.walks.filter(w => w.rating).reduce((acc, w) => acc + (w.rating || 0), 0) / route.walks.filter(w => w.rating).length
      : 0

    return { totalWalks, avgRating }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Rutas EventosGuau 🗺️
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las rutas propuestas por EventosGuau para los usuarios
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Ruta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? 'Editar Ruta' : 'Nueva Ruta EventosGuau'}
              </DialogTitle>
              <DialogDescription>
                {editingRoute 
                  ? 'Modifica los detalles de la ruta existente.'
                  : 'Crea una nueva ruta propuesta por EventosGuau para los usuarios.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Ruta *</Label>
                <Input
                  id="name"
                  placeholder="Ruta del Parque Central"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  placeholder="Parque Central, Madrid"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distance">Distancia (km) *</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="2.5"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData({...formData, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">🟢 Fácil</SelectItem>
                      <SelectItem value="MEDIUM">🟡 Intermedio</SelectItem>
                      <SelectItem value="HARD">🔴 Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe la ruta, puntos de interés, consejos..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingRoute ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {editingRoute ? 'Actualizar' : 'Crear'} Ruta
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Routes Grid */}
      <div className="grid gap-6">
        {routes.length > 0 ? (
          routes.map((route, index) => {
            const stats = getRouteStats(route)
            const difficultyStyle = difficultyLabels[route.difficulty as keyof typeof difficultyLabels] || difficultyLabels.EASY
            
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-0 shadow-lg ${!route.isActive ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center text-xl">
                          <RouteIcon className="h-5 w-5 mr-2 text-blue-600" />
                          {route.name}
                          {!route.isActive && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Inactiva
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {route.location}
                          </div>
                          <div className="flex items-center">
                            <Mountain className="h-4 w-4 mr-1" />
                            {route.distance} km
                          </div>
                          <Badge className={`text-xs ${difficultyStyle.color}`}>
                            {difficultyStyle.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(route)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={route.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleRouteStatus(route)}
                        >
                          {route.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {route.description && (
                      <p className="text-gray-600 mb-4">{route.description}</p>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-blue-600 mr-1" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalWalks}</p>
                        <p className="text-xs text-blue-600">Caminatas</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <div className="flex items-center justify-center mb-1">
                          <Star className="h-4 w-4 text-yellow-600 mr-1" />
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
                        </p>
                        <p className="text-xs text-yellow-600">Valoración</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-green-600 mb-1">Creada</p>
                        <p className="text-sm font-medium text-green-600">
                          {format(new Date(route.createdAt), 'dd MMM', { locale: es })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <RouteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay rutas creadas
              </h3>
              <p className="text-gray-600 mb-6">
                Crea la primera ruta EventosGuau para que los usuarios puedan disfrutarla
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Ruta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
