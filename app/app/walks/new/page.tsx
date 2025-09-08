
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/dashboard/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewWalkForm } from '@/components/walks/new-walk-form'

export default async function NewWalkPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Registrar Nueva Caminata</CardTitle>
            <CardDescription>
              Documenta tu aventura con tu perro y desbloquea logros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewWalkForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
