
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/auth/signin-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-brand-dark hover:text-brand-gold mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-light/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center">
                <span className="text-2xl">🐕</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">
              Bienvenido de vuelta a <span className="text-brand-gold">Camino Guau</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Inicia sesión para continuar tus aventuras
            </p>
          </div>

          <SignInForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/signup" className="text-brand-gold hover:text-brand-gold/80 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
