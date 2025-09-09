import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('Auth test route called')
    
    // Test if authOptions is properly configured
    console.log('AuthOptions configured:', !!authOptions)
    console.log('Providers count:', authOptions.providers?.length || 0)
    console.log('Secret configured:', !!authOptions.secret)
    
    // Try to get session
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    return NextResponse.json({
      success: true,
      message: 'Auth test successful',
      authOptionsConfigured: !!authOptions,
      providersCount: authOptions.providers?.length || 0,
      secretConfigured: !!authOptions.secret,
      session: session,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
