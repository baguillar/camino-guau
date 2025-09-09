
import { NextRequest, NextResponse } from 'next/server'

interface SignupRequest {
  email: string
  password: string
  name: string
  phone?: string
}

interface SignupResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    const body: SignupRequest = await request.json()
    
    // Validación básica
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email, contraseña y nombre son requeridos'
        },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Formato de email inválido'
        },
        { status: 400 }
      )
    }

    // Validar longitud de contraseña
    if (body.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        },
        { status: 400 }
      )
    }

    // Aquí iría la lógica real de registro
    // Por ahora, simulamos el proceso
    
    // Simular verificación de email existente
    // En una implementación real, consultarías la base de datos
    const existingEmails = ['test@example.com', 'admin@camino-guau.com']
    if (existingEmails.includes(body.email.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: 'Este email ya está registrado'
        },
        { status: 409 }
      )
    }

    // Simular creación de usuario
    const newUser = {
      id: `user_${Date.now()}`,
      email: body.email.toLowerCase(),
      name: body.name,
      phone: body.phone || null,
      createdAt: new Date().toISOString()
    }

    // En una implementación real:
    // 1. Hashear la contraseña con bcrypt
    // 2. Guardar el usuario en la base de datos
    // 3. Enviar email de verificación
    // 4. Crear sesión/token JWT

    console.log('Nuevo usuario registrado:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en registro:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

// Método GET para verificar que la ruta funciona
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      message: 'API de registro activa',
      methods: ['POST'],
      endpoint: '/api/signup'
    },
    { status: 200 }
  )
}
