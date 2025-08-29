
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import {
  Trophy,
  Edit,
  Plus,
  Users,
  MapPin,
  Route,
  Calendar,
  Save,
  Loader2
} from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  kmRequired: number | null
  walksRequired: number | null
  streakRequired: number | null
  isActive: boolean
  sortOrder: number
  users: Array<{
    user: { name: string | null; email: string }
  }>
}

interface AchievementsManagerProps {
  achievements: Achievement[]
}

export function AchievementsManager({ achievements }: AchievementsManagerProps) {
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const iconOptions = [
    'paw-print', 'map', 'trophy', 'medal', 'calendar', 'crown'
  ]

  const categoryOptions = [
    { value: 'DISTANCE', label: 'Distancia', icon: MapPin },
    { value: 'WALKS', label: 'Caminatas', icon: Route },
    { value: 'STREAK', label: 'Constancia', icon: Calendar },
    { value: 'SPECIAL', label: 'Especial', icon: Trophy }
  ]

  const filteredAchievements = achievements?.filter(achievement => 
    achievement?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []

  const handleSaveAchievement = async (achievementData: Partial<Achievement>) => {
    setIsLoading(true)

    try {
      const method = achievementData.id ? 'PUT' : 'POST'
      const url = '/api/admin/achievements'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementData),
      })

      if (response.ok) {
        toast({
          title: "¡Éxito!",
          description: `Logro ${achievementData.id ? 'actualizado' : 'creado'} correctamente.`,
        })
        setEditingAchievement(null)
        window.location.reload() // Simple reload for now
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "No se pudo guardar el logro.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salió mal al guardar el logro.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const found = categoryOptions.find(cat => cat.value === category)
    return found?.icon || Trophy
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DISTANCE': return 'bg-green-100 text-green-700'
      case 'WALKS': return 'bg-blue-100 text-blue-700'
      case 'STREAK': return 'bg-orange-100 text-orange-700'
      default: return 'bg-purple-100 text-purple-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
              Logros ({filteredAchievements?.length ?? 0})
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingAchievement(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Logro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAchievement ? 'Editar Logro' : 'Nuevo Logro'}
                  </DialogTitle>
                </DialogHeader>
                <AchievementForm
                  achievement={editingAchievement}
                  onSave={handleSaveAchievement}
                  isLoading={isLoading}
                  iconOptions={iconOptions}
                  categoryOptions={categoryOptions}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar logros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements?.map((achievement, index) => {
          const CategoryIcon = getCategoryIcon(achievement.category)
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-0 shadow-lg transition-all duration-300 hover:scale-105 ${
                !achievement.isActive ? 'opacity-60' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12">
                        <Image
                          src={`/achievements/${achievement.icon}.png`}
                          alt={achievement.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {achievement.name}
                        </h3>
                        <Badge className={getCategoryColor(achievement.category)}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {categoryOptions.find(c => c.value === achievement.category)?.label}
                        </Badge>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingAchievement(achievement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Logro</DialogTitle>
                        </DialogHeader>
                        <AchievementForm
                          achievement={editingAchievement}
                          onSave={handleSaveAchievement}
                          isLoading={isLoading}
                          iconOptions={iconOptions}
                          categoryOptions={categoryOptions}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {achievement.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    {achievement.kmRequired && (
                      <div className="flex items-center text-green-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {achievement.kmRequired} km requeridos
                      </div>
                    )}
                    {achievement.walksRequired && (
                      <div className="flex items-center text-blue-600">
                        <Route className="h-4 w-4 mr-1" />
                        {achievement.walksRequired} caminatas requeridas
                      </div>
                    )}
                    {achievement.streakRequired && (
                      <div className="flex items-center text-orange-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {achievement.streakRequired} días de racha
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {achievement.users?.length ?? 0} usuarios
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Activo:</span>
                      <div className={`w-2 h-2 rounded-full ${
                        achievement.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        }) ?? (
          <div className="col-span-full text-center py-12">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay logros disponibles
            </h3>
            <p className="text-gray-500">
              Crea el primer logro para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface AchievementFormProps {
  achievement: Achievement | null
  onSave: (data: Partial<Achievement>) => void
  isLoading: boolean
  iconOptions: string[]
  categoryOptions: Array<{ value: string; label: string; icon: React.ComponentType<any> }>
}

function AchievementForm({ 
  achievement, 
  onSave, 
  isLoading, 
  iconOptions, 
  categoryOptions 
}: AchievementFormProps) {
  const [formData, setFormData] = useState({
    name: achievement?.name || '',
    description: achievement?.description || '',
    icon: achievement?.icon || iconOptions[0],
    category: achievement?.category || 'DISTANCE',
    kmRequired: achievement?.kmRequired?.toString() || '',
    walksRequired: achievement?.walksRequired?.toString() || '',
    streakRequired: achievement?.streakRequired?.toString() || '',
    isActive: achievement?.isActive ?? true,
    sortOrder: achievement?.sortOrder?.toString() || '0',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: Partial<Achievement> = {
      ...achievement,
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      category: formData.category,
      kmRequired: formData.kmRequired ? parseFloat(formData.kmRequired) : null,
      walksRequired: formData.walksRequired ? parseInt(formData.walksRequired) : null,
      streakRequired: formData.streakRequired ? parseInt(formData.streakRequired) : null,
      isActive: formData.isActive,
      sortOrder: parseInt(formData.sortOrder) || 0,
    }

    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del logro</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Primer Paso"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icono</Label>
          <Select 
            value={formData.icon} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(icon => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Completa tu primera caminata"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">Orden</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: e.target.value }))}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kmRequired">KM requeridos</Label>
          <Input
            id="kmRequired"
            type="number"
            step="0.1"
            value={formData.kmRequired}
            onChange={(e) => setFormData(prev => ({ ...prev, kmRequired: e.target.value }))}
            placeholder="5.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="walksRequired">Caminatas requeridas</Label>
          <Input
            id="walksRequired"
            type="number"
            value={formData.walksRequired}
            onChange={(e) => setFormData(prev => ({ ...prev, walksRequired: e.target.value }))}
            placeholder="10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="streakRequired">Días de racha</Label>
          <Input
            id="streakRequired"
            type="number"
            value={formData.streakRequired}
            onChange={(e) => setFormData(prev => ({ ...prev, streakRequired: e.target.value }))}
            placeholder="5"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">Activo</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Logro
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
