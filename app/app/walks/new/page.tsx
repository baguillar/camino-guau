
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { NewWalkForm } from '@/components/walks/new-walk-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export default async function NewWalkPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nueva Caminata 🐕
          </h1>
          <p className="text-gray-600">
            Registra los detalles de tu aventura con tu compañero peludo
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Detalles de la Caminata</CardTitle>
            <CardDescription>
              Completa la información para registrar tu actividad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewWalkForm userId={session.user.id} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
