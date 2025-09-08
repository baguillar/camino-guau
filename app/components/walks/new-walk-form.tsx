
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CalendarIcon, MapPin, Clock, Route, Star } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface NewWalkFormProps {}

export function NewWalkForm(props: NewWalkFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    kilometers: '',
    duration: '',
    notes: '',
    weather: '',
    dogMood: '',
    dogCondition: '',
    rating: ''
  })
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
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
          date: date.toISOString(),
          notes: formData.notes || null,
          weather: formData.weather || null,
          dogMood: formData.dogMood || null,
          dogCondition: formData.dogCondition || null,
          rating: formData.rating ? parseInt(formData.rating) : null
        }),
      })

      if (response.ok) {
        toast({
          title: "¡Caminata registrada!",
          description: "Tu aventura ha sido guardada exitosamente.",
        })
        router.push('/walks')
      } else {
        throw new Error('Error al registrar la caminata')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la caminata. Intenta de nuevo.",
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="space-y-2">
          <Label>Fecha de la caminata</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setDate(date || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Kilometers */}
        <div className="space-y-2">
          <Label htmlFor="kilometers">Kilómetros *</Label>
          <div className="relative">
            <Route className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="kilometers"
              type="number"
              step="0.1"
              min="0"
              placeholder="2.5"
              value={formData.kilometers}
              onChange={(e) => handleInputChange('kilometers', e.target.value)}
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duración (minutos)</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="45"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <Label>Clima</Label>
          <Select value={formData.weather} onValueChange={(value) => handleInputChange('weather', value)}>
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo estaba el clima?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunny">☀️ Soleado</SelectItem>
              <SelectItem value="cloudy">☁️ Nublado</SelectItem>
              <SelectItem value="rainy">🌧️ Lluvioso</SelectItem>
              <SelectItem value="windy">💨 Ventoso</SelectItem>
              <SelectItem value="cold">🥶 Frío</SelectItem>
              <SelectItem value="hot">🔥 Caluroso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dog Mood */}
        <div className="space-y-2">
          <Label>Estado de ánimo del perro</Label>
          <Select value={formData.dogMood} onValueChange={(value) => handleInputChange('dogMood', value)}>
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo estaba tu perro?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excited">🤩 Emocionado</SelectItem>
              <SelectItem value="happy">😊 Feliz</SelectItem>
              <SelectItem value="calm">😌 Tranquilo</SelectItem>
              <SelectItem value="tired">😴 Cansado</SelectItem>
              <SelectItem value="playful">🎾 Juguetón</SelectItem>
              <SelectItem value="relaxed">😎 Relajado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dog Condition */}
        <div className="space-y-2">
          <Label>Condición física del perro</Label>
          <Select value={formData.dogCondition} onValueChange={(value) => handleInputChange('dogCondition', value)}>
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo se sintió físicamente?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">💪 Excelente</SelectItem>
              <SelectItem value="good">👍 Bien</SelectItem>
              <SelectItem value="normal">😐 Normal</SelectItem>
              <SelectItem value="tired">😴 Cansado</SelectItem>
              <SelectItem value="exhausted">🥱 Agotado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label>Calificación de la caminata</Label>
          <Select value={formData.rating} onValueChange={(value) => handleInputChange('rating', value)}>
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo fue la experiencia?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ Muy buena</SelectItem>
              <SelectItem value="3">⭐⭐⭐ Buena</SelectItem>
              <SelectItem value="2">⭐⭐ Regular</SelectItem>
              <SelectItem value="1">⭐ Necesita mejorar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales</Label>
        <Textarea
          id="notes"
          placeholder="¿Algo especial que quieras recordar de esta caminata?"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Registrar Caminata'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
