
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignUpForm } from '@/components/auth/signup-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
              Únete a <span className="text-brand-gold">Camino Guau</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Crea tu cuenta y la de tu perro para comenzar las aventuras
            </p>
          </div>

          <SignUpForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/signin" className="text-brand-gold hover:text-brand-gold/80 font-semibold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
