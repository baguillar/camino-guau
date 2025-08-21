
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Clock, MapPin, Sun, CloudRain, Cloud, Smile, Frown, Meh, Loader2, Route, Star, Heart, Activity } from 'lucide-react'

interface EventRoute {
  id: string
  name: string
  location: string
  distance: number
  difficulty: string
  description: string | null
}

interface NewWalkFormProps {
  userId: string
}

export function NewWalkForm({ userId }: NewWalkFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingRoutes, setLoadingRoutes] = useState(true)
  const [eventRoutes, setEventRoutes] = useState<EventRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<EventRoute | null>(null)
  const [formData, setFormData] = useState({
    kilometers: '',
    duration: '',
    notes: '',
    weather: '',
    dogMood: '',
    eventRouteId: '',
    dogCondition: '',
    userFeedback: '',
    rating: ''
  })
  
  const router = useRouter()
  const { toast } = useToast()

  // Load available routes
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const response = await fetch('/api/event-routes')
        if (response.ok) {
          const routes = await response.json()
          setEventRoutes(routes)
        }
      } catch (error) {
        console.error('Error loading routes:', error)
      } finally {
        setLoadingRoutes(false)
      }
    }

    loadRoutes()
  }, [])

  // Update kilometers when route is selected
  useEffect(() => {
    if (selectedRoute) {
      setFormData(prev => ({
        ...prev,
        kilometers: selectedRoute.distance.toString()
      }))
    }
  }, [selectedRoute])

  const weatherOptions = [
    { value: 'sunny', label: 'Soleado', icon: Sun },
    { value: 'cloudy', label: 'Nublado', icon: Cloud },
    { value: 'rainy', label: 'Lluvioso', icon: CloudRain }
  ]

  const moodOptions = [
    { value: 'happy', label: 'Feliz', icon: Smile },
    { value: 'neutral', label: 'Normal', icon: Meh },
    { value: 'tired', label: 'Cansado', icon: Frown }
  ]

  const dogConditionOptions = [
    { value: 'excelente', label: 'Excelente - Lleno de energía', icon: Heart },
    { value: 'bueno', label: 'Bueno - Activo y contento', icon: Smile },
    { value: 'regular', label: 'Regular - Algo cansado', icon: Meh },
    { value: 'cansado', label: 'Cansado - Necesita descanso', icon: Activity }
  ]

  const ratingOptions = [
    { value: '5', label: '⭐⭐⭐⭐⭐ Excelente' },
    { value: '4', label: '⭐⭐⭐⭐ Muy buena' },
    { value: '3', label: '⭐⭐⭐ Buena' },
    { value: '2', label: '⭐⭐ Regular' },
    { value: '1', label: '⭐ Mala' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.kilometers || parseFloat(formData.kilometers) <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa una distancia válida.",
        variant: "destructive",
      })
      return
    }

    if (parseFloat(formData.kilometers) > 50) {
      toast({
        title: "Error", 
        description: "La distancia no puede ser mayor a 50 km.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/walks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kilometers: parseFloat(formData.kilometers),
          duration: formData.duration ? parseInt(formData.duration) : null,
          notes: formData.notes || null,
          weather: formData.weather || null,
          dogMood: formData.dogMood || null,
          eventRouteId: formData.eventRouteId || null,
          dogCondition: formData.dogCondition || null,
          userFeedback: formData.userFeedback || null,
          rating: formData.rating ? parseInt(formData.rating) : null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        toast({
          title: "¡Caminata registrada! 🎉",
          description: `${formData.kilometers} km añadidos a tu historial.`,
        })

        // Check for new achievements
        if (data?.newAchievements && data.newAchievements.length > 0) {
          setTimeout(() => {
            toast({
              title: "¡Nuevo logro desbloqueado! 🏆",
              description: `Has obtenido: ${data.newAchievements[0].name}`,
            })
          }, 1000)
        }

        router.push('/dashboard')
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: "Error al registrar caminata",
          description: error.message || "No se pudo guardar la caminata.",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRouteSelect = (routeId: string) => {
    if (routeId === "none") {
      setSelectedRoute(null)
      setFormData(prev => ({
        ...prev,
        eventRouteId: '',
        kilometers: '' // Reset kilometers when no route selected
      }))
    } else {
      const route = eventRoutes.find(r => r.id === routeId)
      setSelectedRoute(route || null)
      setFormData(prev => ({
        ...prev,
        eventRouteId: routeId
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* EventosGuau Route Selection */}
      <div className="space-y-2">
        <Label className="flex items-center">
          <Route className="h-4 w-4 mr-2 text-purple-600" />
          Ruta EventosGuau
        </Label>
        <Select 
          value={formData.eventRouteId} 
          onValueChange={handleRouteSelect}
          disabled={loadingRoutes || isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loadingRoutes ? "Cargando rutas..." : "¿Seguiste alguna ruta propuesta?"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin ruta específica</SelectItem>
            {eventRoutes.map((route) => (
              <SelectItem key={route.id} value={route.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  <span className="text-sm text-gray-500">{route.location} - {route.distance}km</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedRoute && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              📍 <strong>{selectedRoute.name}</strong> - {selectedRoute.location}
            </p>
            {selectedRoute.description && (
              <p className="text-xs text-purple-600 mt-1">{selectedRoute.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Distance */}
      <div className="space-y-2">
        <Label htmlFor="kilometers" className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
          Distancia (km) *
        </Label>
        <Input
          id="kilometers"
          type="number"
          step="0.1"
          min="0.1"
          max="50"
          placeholder="2.5"
          value={formData.kilometers}
          onChange={(e) => handleInputChange('kilometers', e.target.value)}
          className="text-lg"
          required
          disabled={isLoading || selectedRoute !== null}
        />
        <p className="text-sm text-gray-500">
          {selectedRoute ? 'Distancia ajustada automáticamente por la ruta seleccionada' : 'Ingresa la distancia recorrida en kilómetros'}
        </p>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration" className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-green-600" />
          Duración (minutos)
        </Label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="300"
          placeholder="30"
          value={formData.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500">
          Opcional: ¿Cuánto tiempo duró la caminata?
        </p>
      </div>

      {/* Weather */}
      <div className="space-y-2">
        <Label className="flex items-center">
          <Sun className="h-4 w-4 mr-2 text-yellow-600" />
          Clima
        </Label>
        <Select value={formData.weather} onValueChange={(value) => handleInputChange('weather', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="¿Cómo estaba el clima?" />
          </SelectTrigger>
          <SelectContent>
            {weatherOptions.map((option) => {
              const Icon = option.icon
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Dog Mood */}
      <div className="space-y-2">
        <Label className="flex items-center">
          <Smile className="h-4 w-4 mr-2 text-orange-600" />
          Estado de ánimo de tu perro
        </Label>
        <Select value={formData.dogMood} onValueChange={(value) => handleInputChange('dogMood', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="¿Cómo se sintió tu perro?" />
          </SelectTrigger>
          <SelectContent>
            {moodOptions.map((option) => {
              const Icon = option.icon
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Dog Physical Condition */}
      <div className="space-y-2">
        <Label className="flex items-center">
          <Activity className="h-4 w-4 mr-2 text-green-600" />
          Condición física de tu perro
        </Label>
        <Select value={formData.dogCondition} onValueChange={(value) => handleInputChange('dogCondition', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="¿Cómo estuvo físicamente tu perro?" />
          </SelectTrigger>
          <SelectContent>
            {dogConditionOptions.map((option) => {
              const Icon = option.icon
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Rating (only if route is selected) */}
      {selectedRoute && (
        <div className="space-y-2">
          <Label className="flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-600" />
            Valoración de la ruta
          </Label>
          <Select value={formData.rating} onValueChange={(value) => handleInputChange('rating', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="¿Qué te pareció esta ruta?" />
            </SelectTrigger>
            <SelectContent>
              {ratingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* User Feedback */}
      <div className="space-y-2">
        <Label htmlFor="userFeedback" className="flex items-center">
          <Heart className="h-4 w-4 mr-2 text-pink-600" />
          Tu opinión sobre la experiencia
        </Label>
        <Textarea
          id="userFeedback"
          placeholder="¿Cómo fue la experiencia? ¿Algo destacable que quieras compartir?"
          value={formData.userFeedback}
          onChange={(e) => handleInputChange('userFeedback', e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500">
          Comparte tu experiencia con otros caminantes
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
          Notas de la caminata
        </Label>
        <Textarea
          id="notes"
          placeholder="¿Algo interesante que pasó durante la caminata?"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Registrando caminata...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-5 w-5" />
              Registrar Caminata
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
