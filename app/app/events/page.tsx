
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Navigation } from '@/components/dashboard/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Route, Clock, Euro } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function EventsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user?.id) {
    redirect('/auth/login')
  }

  const events = await prisma.eventRoute.findMany({
    where: { 
      isActive: true,
      eventDate: {
        gte: new Date() // Solo eventos futuros
      }
    },
    orderBy: { eventDate: 'asc' },
    include: {
      eventParticipants: {
        where: { userId: session.user.id }
      },
      _count: {
        select: { eventParticipants: true }
      }
    }
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'Fácil'
      case 'MEDIUM': return 'Intermedio'
      case 'HARD': return 'Difícil'
      default: return 'Sin especificar'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Eventos Guau
          </h1>
          <p className="text-gray-600 mt-2">
            Únete a caminatas grupales y conoce otros amantes de los perros
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6">
            {events.map((event) => {
              const isRegistered = event.eventParticipants.length > 0
              const isFull = event.maxParticipants ? event._count.eventParticipants >= event.maxParticipants : false
              
              return (
                <Card key={event.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Event Info */}
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {event.name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {event.description}
                            </p>
                          </div>
                          <Badge className={getDifficultyColor(event.difficulty)}>
                            {getDifficultyText(event.difficulty)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(event.eventDate), "d 'de' MMMM, yyyy", { locale: es })}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {format(new Date(event.eventDate), "HH:mm", { locale: es })}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Route className="h-4 w-4 mr-2" />
                            {event.distance} km
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {event._count.eventParticipants}
                            {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} participantes
                          </div>
                          {event.entryPrice && event.entryPrice > 0 && (
                            <div className="flex items-center text-gray-600">
                              <Euro className="h-4 w-4 mr-2" />
                              {event.entryPrice.toFixed(2)}€
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex flex-col justify-center">
                        {isRegistered ? (
                          <div className="text-center">
                            <Badge className="bg-green-100 text-green-800 mb-4">
                              ¡Ya estás registrado!
                            </Badge>
                            <Link href={`/events/${event.id}`}>
                              <Button variant="outline" className="w-full">
                                Ver detalles
                              </Button>
                            </Link>
                          </div>
                        ) : isFull ? (
                          <div className="text-center">
                            <Badge className="bg-red-100 text-red-800 mb-4">
                              Evento completo
                            </Badge>
                            <Link href={`/events/${event.id}`}>
                              <Button variant="outline" className="w-full">
                                Ver detalles
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Link href={`/events/${event.id}`}>
                              <Button className="w-full mb-2">
                                Registrarse
                              </Button>
                            </Link>
                            <p className="text-xs text-gray-500">
                              {event.requiresConfirmation ? 'Requiere confirmación' : 'Registro directo'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay eventos próximos
              </h3>
              <p className="text-gray-600 mb-4">
                No hay eventos Guau programados en este momento. ¡Mantente atento para nuevas aventuras!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
