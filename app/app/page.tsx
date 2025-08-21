import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LandingPage } from '@/components/landing-page'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  // Show landing page for non-authenticated users
  return <LandingPage />
}