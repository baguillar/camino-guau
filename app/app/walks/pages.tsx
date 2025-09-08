
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Navigation } from '@/components/dashboard/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Route, Calendar, Clock, MapPin, Plus, Star } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function WalksPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user?.id) {
    redirect('/auth/login')
  }

  const walks = await prisma.walk.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    include: {
      eventRoute: {
        select: {
          name: true,
          location: true
        }
      }
    }
  })

  const stats = {
    totalWalks: walks.length,
    totalKm: walks.reduce((sum, walk) => sum + walk.kilometers, 0),
    avgDuration: walks.filter(w => w.duration).length > 0 
      ? walks.filter(w => w.duration).reduce((sum, walk) => sum + (walk.duration || 0), 0) / walks.filter(w => w.duration).length
      : 0
  }

  const getMoodIcon = (mood: string | null) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'excited': return '🤩'
      case 'calm': return '😌'
      case 'tired': return '😴'
      default: return '🐕'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mis Caminatas
            </h1>
            <p className="text-gray-600 mt-2">
              Registro de todas tus aventuras con tu perro
            </p>
          </div>
          <Link href="/walks/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Caminata
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Route className="h-10 w-10 mx-auto mb-2 text-blue-200" />
              <p className="text-2xl font-bold">{stats.totalWalks}</p>
              <p className="text-blue-100">Caminatas totales</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <MapPin className="h-10 w-10 mx-auto mb-2 text-green-200" />
              <p className="text-2xl font-bold">{stats.totalKm.toFixed(1)}</p>
              <p className="text-green-100">Kilómetros totales</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 mx-auto mb-2 text-purple-200" />
              <p className="text-2xl font-bold">{Math.round(stats.avgDuration)}</p>
              <p className="text-purple-100">Minutos promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Walks List */}
        {walks.length > 0 ? (
          <div className="space-y-6">
            {walks.map((walk) => (
              <Card key={walk.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Walk Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {walk.eventRoute ? walk.eventRoute.name : 'Caminata libre'}
                        </h3>
                        {walk.rating && (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < walk.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(walk.date), "d MMM yyyy", { locale: es })}
                        </div>
                        <div className="flex items-center">
                          <Route className="h-4 w-4 mr-2" />
                          {walk.kilometers} km
                        </div>
                        {walk.duration && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {walk.duration} min
                          </div>
                        )}
                        {walk.eventRoute?.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {walk.eventRoute.location}
                          </div>
                        )}
                      </div>

                      {walk.notes && (
                        <p className="text-gray-700 mt-3 text-sm">
                          "{walk.notes}"
                        </p>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                      {walk.weather && (
                        <Badge variant="outline" className="text-xs">
                          Clima: {walk.weather}
                        </Badge>
                      )}
                      {walk.dogCondition && (
                        <Badge variant="outline" className="text-xs">
                          Condición: {walk.dogCondition}
                        </Badge>
                      )}
                      {walk.dogMood && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">Estado del perro:</span>
                          <span>{getMoodIcon(walk.dogMood)}</span>
                        </div>
                      )}
                    </div>

                    {/* Event Badge */}
                    <div className="flex items-center justify-center">
                      {walk.eventRoute ? (
                        <Badge className="bg-blue-100 text-blue-800">
                          Evento Guau
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Caminata libre
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No has registrado ninguna caminata
              </h3>
              <p className="text-gray-600 mb-6">
                ¡Empieza a registrar tus aventuras con tu perro y desbloquea logros!
              </p>
              <Link href="/walks/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar primera caminata
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
