
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Navigation } from '@/components/dashboard/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dog, Plus, Edit, User, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user?.id) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      dogs: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
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
            Mi Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu información personal y los perfiles de tus perros
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-6 w-6 mr-2 text-blue-600" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium">{user.name || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Miembro desde</p>
                    <p className="font-medium">
                      {new Date(user.joinedDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total kilómetros</p>
                    <p className="text-2xl font-bold text-green-600">{user.totalKilometers.toFixed(1)} km</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total caminatas</p>
                    <p className="text-2xl font-bold text-blue-600">{user.totalWalks}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Mejor racha</p>
                    <p className="text-2xl font-bold text-purple-600">{user.bestStreak} días</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dogs Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div>
                  <CardTitle className="flex items-center">
                    <Dog className="h-6 w-6 mr-2 text-blue-600" />
                    Mis Perros
                  </CardTitle>
                  <CardDescription>
                    Administra los perfiles de tus compañeros peludos
                  </CardDescription>
                </div>
                <Link href="/profile/dogs/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Perro
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {user.dogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.dogs.map((dog) => (
                      <Card key={dog.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Dog className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{dog.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {dog.breed || 'Raza no especificada'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {dog.age ? `${dog.age} años` : 'Edad no especificada'} • {
                                    dog.sex === 'MALE' ? 'Macho' : 
                                    dog.sex === 'FEMALE' ? 'Hembra' : 
                                    'Sexo no especificado'
                                  }
                                </p>
                              </div>
                            </div>
                            <Link href={`/profile/dogs/${dog.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                          
                          {dog.specialCharacteristic && (
                            <p className="text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded">
                              {dog.specialCharacteristic}
                            </p>
                          )}
                          
                          {(dog.obedience || dog.socializationWithDogs || dog.socializationWithPeople) && (
                            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                              <div className="text-xs">
                                <p className="text-gray-500">Obediencia</p>
                                <p className="font-medium">{dog.obedience || 'N/A'}/10</p>
                              </div>
                              <div className="text-xs">
                                <p className="text-gray-500">Social (perros)</p>
                                <p className="font-medium">{dog.socializationWithDogs || 'N/A'}/10</p>
                              </div>
                              <div className="text-xs">
                                <p className="text-gray-500">Social (personas)</p>
                                <p className="font-medium">{dog.socializationWithPeople || 'N/A'}/10</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Dog className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes perros registrados
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Agrega el perfil de tu perro para empezar a registrar paseos y desbloquear logros
                    </p>
                    <Link href="/profile/dogs/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar mi primer perro
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
