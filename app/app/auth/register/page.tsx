
import { RegisterForm } from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/logo.png"
              alt="Camino Guau Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Camino Guau</h1>
          <p className="text-gray-600 mt-2">Comienza tu aventura</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Únete a la comunidad de Eventos GUAU
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
