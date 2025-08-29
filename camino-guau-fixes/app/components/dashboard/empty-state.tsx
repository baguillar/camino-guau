
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Plus, Trophy, Users } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  type: 'walks' | 'achievements' | 'events' | 'general'
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: EmptyStateProps) {
  const getDefaultContent = () => {
    switch (type) {
      case 'walks':
        return {
          icon: <MapPin className="h-12 w-12 text-muted-foreground" />,
          title: title || '¡Comienza tu primera aventura!',
          description: description || 'Aún no has registrado ningún paseo. ¡Es hora de salir con tu compañero peludo!',
          actionLabel: actionLabel || 'Registrar paseo',
          actionHref: actionHref || '/walks/new'
        }
      case 'achievements':
        return {
          icon: <Trophy className="h-12 w-12 text-muted-foreground" />,
          title: title || 'Logros por desbloquear',
          description: description || 'Completa paseos y participa en eventos para desbloquear increíbles logros.',
          actionLabel: actionLabel || 'Ver todos los logros',
          actionHref: actionHref || '/achievements'
        }
      case 'events':
        return {
          icon: <Users className="h-12 w-12 text-muted-foreground" />,
          title: title || 'No hay eventos próximos',
          description: description || 'Mantente atento a nuevos EventosGuau donde podrás conocer otros amantes de los perros.',
          actionLabel: actionLabel || 'Explorar eventos',
          actionHref: actionHref || '/events'
        }
      default:
        return {
          icon: <Plus className="h-12 w-12 text-muted-foreground" />,
          title: title || 'Nada que mostrar',
          description: description || 'No hay contenido disponible en este momento.',
          actionLabel: actionLabel || 'Comenzar',
          actionHref: actionHref || '/dashboard'
        }
    }
  }

  const content = getDefaultContent()

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4 text-center">
          {content.icon}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{content.title}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {content.description}
            </p>
          </div>
          {content.actionHref && (
            <Button asChild className="mt-4">
              <Link href={content.actionHref}>
                {content.actionLabel}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
