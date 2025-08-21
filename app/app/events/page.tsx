
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  Euro,
  Star,
  CheckCircle,
  XCircle,
  Route
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface EventRoute {
  id: string
  name: string
  description: string | null
  location: string
  distance: number
  difficulty: string
  eventDate: string
  maxParticipants: number | null
  entryPrice: number | null
  requiresConfirmation: boolean
  isActive: boolean
  _count: {
    eventParticipants: number
  }
  userParticipation?: {
    id: string
    attendanceConfirmed: boolean
    confirmationCode: string
    registeredAt: string
  } | null
}

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<EventRoute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Error al cargar los eventos')
    } finally {
      setLoading(false)
    }
  }

  const registerForEvent = async (eventId: string) => {
    if (!session?.user) {
      toast.error('Debes estar logueado para registrarte')
      return
    }

    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventRouteId: eventId }),
      })

      if (response.ok) {
        toast.success('¡Te has registrado exitosamente!')
        fetchEvents() // Refresh to show updated status
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al registrarse')
      }
    } catch (error) {
      console.error('Error registering for event:', error)
      toast.error('Error al registrarse')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Medio'
      case 'hard': return 'Difícil'
      default: return difficulty
    }
  }

  const getEventStatus = (event: EventRoute) => {
    const eventDate = new Date(event.eventDate)
    const now = new Date()
    const participation = event.userParticipation

    if (eventDate < now) {
      if (participation?.attendanceConfirmed) {
        return { status: 'completed', text: 'Completado', color: 'bg-green-100 text-green-800' }
      } else if (participation && !participation.attendanceConfirmed) {
        return { status: 'missed', text: 'No Confirmado', color: 'bg-red-100 text-red-800' }
      } else {
        return { status: 'past', text: 'Finalizado', color: 'bg-gray-100 text-gray-800' }
      }
    }

    if (participation) {
      return { status: 'registered', text: 'Registrado', color: 'bg-blue-100 text-blue-800' }
    }

    if (event.maxParticipants && event._count.eventParticipants >= event.maxParticipants) {
      return { status: 'full', text: 'Completo', color: 'bg-red-100 text-red-800' }
    }

    return { status: 'available', text: 'Disponible', color: 'bg-green-100 text-green-800' }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Eventos <span className="text-blue-600">Guau</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Únete a nuestros eventos exclusivos y vive aventuras increíbles con tu compañero canino
            </p>
          </div>

          {events.length === 0 ? (
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm">
              <CardContent>
                <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay eventos disponibles
                </h3>
                <p className="text-gray-600">
                  ¡Mantente atento! Pronto habrá nuevos eventos emocionantes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => {
                const eventStatus = getEventStatus(event)
                const eventDate = new Date(event.eventDate)
                const isUpcoming = eventDate > new Date()
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-3">
                          <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                            {event.name}
                          </CardTitle>
                          <Badge className={eventStatus.color}>
                            {eventStatus.text}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <CalendarDays className="w-4 h-4" />
                          <span>{format(eventDate, 'PPP', { locale: es })}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{format(eventDate, 'HH:mm')}h</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {event.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{event.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Route className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{event.distance} km</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(event.difficulty)}>
                              {getDifficultyText(event.difficulty)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">
                                {event._count.eventParticipants}
                                {event.maxParticipants ? ` / ${event.maxParticipants}` : ''}
                              </span>
                            </div>
                            
                            {event.entryPrice && (
                              <div className="flex items-center gap-1 font-semibold text-blue-600">
                                <Euro className="w-4 h-4" />
                                <span>{event.entryPrice}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Event Status Actions */}
                        {isUpcoming && (
                          <div className="mt-4">
                            {!event.userParticipation ? (
                              eventStatus.status === 'full' ? (
                                <Button disabled className="w-full">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Evento Completo
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => registerForEvent(event.id)}
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                  Registrarse al Evento
                                </Button>
                              )
                            ) : (
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-medium">¡Registrado!</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Código: <code className="bg-gray-100 px-2 py-1 rounded">
                                    {event.userParticipation.confirmationCode}
                                  </code>
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Past event status */}
                        {!isUpcoming && event.userParticipation && (
                          <div className="mt-4 p-3 rounded-lg bg-gray-50">
                            {event.userParticipation.attendanceConfirmed ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Asistencia Confirmada</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-amber-600">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm">Asistencia pendiente de confirmación</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
