'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const errorMessages: Record<string, string> = {
  Configuration: 'Hay un problema con la configuración del servidor.',
  AccessDenied: 'No tienes permisos para acceder a esta aplicación.',
  Verification: 'El token de verificación ha expirado o ya ha sido usado.',
  Default: 'Ha ocurrido un error durante la autenticación.',
  SessionRequired: 'Debes iniciar sesión para acceder a esta página.',
  Callback: 'Error en el proceso de autenticación.',
  OAuthSignin: 'Error al intentar iniciar sesión con el proveedor.',
  OAuthCallback: 'Error en la respuesta del proveedor de autenticación.',
  OAuthCreateAccount: 'No se pudo crear la cuenta con el proveedor.',
  EmailCreateAccount: 'No se pudo crear la cuenta con email.',
  Signin: 'Error al intentar iniciar sesión.',
  OAuthAccountNotLinked: 'Esta cuenta ya está vinculada con otro método de autenticación.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const errorMessage = error && errorMessages[error] 
    ? errorMessages[error] 
    : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold text-gray-900">
              Error de Autenticación
            </CardTitle>
            <CardDescription className="mt-2">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Si el problema persiste, contacta con el administrador.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    Intentar de nuevo
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-xs text-gray-500">
                  Código de error: {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
