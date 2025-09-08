
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Navigation } from '@/components/dashboard/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, MapPin, Route, Calendar, Dog, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user?.id) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      achievements: {
        include: {
          achievement: true
        }
      },
      dogs: {
        where: { isActive: true }
      },
      walks: {
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  })

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido de vuelta, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Aquí tienes un resumen de tu actividad con tu perro
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-10 w-10 text-blue-200" />
                <div className="ml-4">
                  <p className="text-blue-100">Logros</p>
                  <p className="text-2xl font-bold">{user.achievements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-10 w-10 text-green-200" />
                <div className="ml-4">
                  <p className="text-green-100">Kilómetros</p>
                  <p className="text-2xl font-bold">{user.totalKilometers.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Route className="h-10 w-10 text-orange-200" />
                <div className="ml-4">
                  <p className="text-orange-100">Caminatas</p>
                  <p className="text-2xl font-bold">{user.totalWalks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-10 w-10 text-purple-200" />
                <div className="ml-4">
                  <p className="text-purple-100">Racha actual</p>
                  <p className="text-2xl font-bold">{user.currentStreak} días</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dogs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dog className="h-6 w-6 mr-2 text-blue-600" />
                Mis Perros
              </CardTitle>
              <CardDescription>
                Administra los perfiles de tus compañeros peludos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.dogs.length > 0 ? (
                <div className="space-y-3">
                  {user.dogs.map((dog) => (
                    <div key={dog.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Dog className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium">{dog.name}</p>
                        <p className="text-sm text-gray-600">
                          {dog.breed || 'Raza no especificada'} • {dog.age ? `${dog.age} años` : 'Edad no especificada'}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/profile">
                    <Button variant="outline" className="w-full">
                      Ver todos los perros
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Dog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tienes perros registrados</p>
                  <Link href="/profile">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar mi primer perro
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
                Logros Recientes
              </CardTitle>
              <CardDescription>
                Tus últimos logros desbloqueados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.achievements.length > 0 ? (
                <div className="space-y-3">
                  {user.achievements.slice(0, 3).map((userAchievement) => (
                    <div key={userAchievement.id} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium">{userAchievement.achievement.name}</p>
                        <p className="text-sm text-gray-600">
                          {userAchievement.achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/achievements">
                    <Button variant="outline" className="w-full">
                      Ver todos los logros
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aún no tienes logros</p>
                  <p className="text-sm text-gray-500">
                    ¡Comienza a caminar con tu perro para desbloquear logros!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
