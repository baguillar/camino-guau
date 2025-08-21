
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  Search,
  QrCode,
  Star,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface EventParticipant {
  id: string
  confirmationCode: string
  registeredAt: string
  attendanceConfirmed: boolean
  confirmedAt: string | null
  rating: number | null
  feedback: string | null
  user: {
    id: string
    name: string | null
    email: string
  }
}

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
  eventParticipants: EventParticipant[]
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState<EventRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<string>('')

  // Redirect if not admin
  if (status === 'loading') return <div>Cargando...</div>
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events')
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

  const confirmAttendance = async (participantId: string) => {
    try {
      const response = await fetch('/api/admin/events/confirm-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId }),
      })

      if (response.ok) {
        toast.success('Asistencia confirmada exitosamente')
        fetchEvents()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al confirmar asistencia')
      }
    } catch (error) {
      console.error('Error confirming attendance:', error)
      toast.error('Error al confirmar asistencia')
    }
  }

  const confirmByCode = async () => {
    if (!confirmationCode.trim()) {
      toast.error('Ingresa un código de confirmación')
      return
    }

    try {
      const response = await fetch('/api/admin/events/confirm-by-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmationCode: confirmationCode.trim().toUpperCase() }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Asistencia confirmada para ${data.userName}`)
        setConfirmationCode('')
        fetchEvents()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al confirmar asistencia')
      }
    } catch (error) {
      console.error('Error confirming by code:', error)
      toast.error('Error al confirmar asistencia')
    }
  }

  const getEventStatus = (event: EventRoute) => {
    const eventDate = new Date(event.eventDate)
    const now = new Date()
    
    if (eventDate > now) {
      return { status: 'upcoming', text: 'Próximo', color: 'bg-blue-100 text-blue-800' }
    } else {
      return { status: 'past', text: 'Finalizado', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const getParticipantStats = (participants: EventParticipant[]) => {
    const total = participants.length
    const confirmed = participants.filter(p => p.attendanceConfirmed).length
    const pending = total - confirmed
    
    return { total, confirmed, pending }
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
              Gestión de <span className="text-blue-600">Eventos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Confirma la asistencia de los participantes y gestiona los eventos
            </p>
          </div>

          {/* Quick Confirmation by Code */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-6 h-6 text-blue-600" />
                Confirmación Rápida por Código
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 max-w-md">
                <Input
                  placeholder="Código de confirmación (ej: ABC123)"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && confirmByCode()}
                  className="flex-1"
                />
                <Button 
                  onClick={confirmByCode}
                  disabled={!confirmationCode.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Los participantes pueden mostrarte su código para confirmar rápidamente su asistencia
              </p>
            </CardContent>
          </Card>

          {/* Events List */}
          <div className="space-y-6">
            {events.map((event, index) => {
              const eventStatus = getEventStatus(event)
              const stats = getParticipantStats(event.eventParticipants)
              const eventDate = new Date(event.eventDate)
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                            {event.name}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4" />
                              <span>{format(eventDate, 'PPP', { locale: es })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{format(eventDate, 'HH:mm')}h</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={eventStatus.color}>
                          {eventStatus.text}
                        </Badge>
                      </div>

                      {/* Event Stats */}
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">
                            {stats.total} participantes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">
                            {stats.confirmed} confirmados
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-gray-700">
                            {stats.pending} pendientes
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {event.eventParticipants.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p>No hay participantes registrados en este evento</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {event.eventParticipants.map((participant) => (
                            <div
                              key={participant.id}
                              className="flex items-center justify-between p-4 bg-white rounded-lg border"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {participant.user.name || 'Sin nombre'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {participant.user.email}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                    {participant.confirmationCode}
                                  </span>
                                  <span>
                                    Registrado: {format(new Date(participant.registeredAt), 'PPp', { locale: es })}
                                  </span>
                                </div>

                                {participant.attendanceConfirmed && participant.confirmedAt && (
                                  <div className="mt-2 text-sm text-green-600">
                                    ✓ Confirmado el {format(new Date(participant.confirmedAt), 'PPp', { locale: es })}
                                  </div>
                                )}

                                {participant.rating && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < participant.rating! 
                                              ? 'text-yellow-400 fill-current' 
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    {participant.feedback && (
                                      <div className="flex items-center gap-1 text-gray-600">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-sm">Con comentario</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="ml-4">
                                {participant.attendanceConfirmed ? (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">Confirmado</span>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => confirmAttendance(participant.id)}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirmar Asistencia
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {events.length === 0 && (
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm">
              <CardContent>
                <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay eventos para gestionar
                </h3>
                <p className="text-gray-600">
                  Los eventos aparecerán aquí una vez que se creen desde la gestión de rutas.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
