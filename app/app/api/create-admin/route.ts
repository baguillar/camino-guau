import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    // NOTA: Este endpoint debe ser eliminado en producción por seguridad
    const { email, password, name, adminSecret } = await req.json()

    // Clave secreta para crear admin (cambiar en producción)
    const ADMIN_CREATION_SECRET = process.env.ADMIN_CREATION_SECRET || 'camino-admin-secret-2024'
    
    if (adminSecret !== ADMIN_CREATION_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Convertir usuario existente a admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      })

      return NextResponse.json({ 
        message: 'Usuario existente convertido a administrador',
        user: { 
          id: updatedUser.id, 
          email: updatedUser.email, 
          name: updatedUser.name,
          role: updatedUser.role
        } 
      }, { status: 200 })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear nuevo usuario admin
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        totalKilometers: 0,
        totalWalks: 0,
      },
    })

    return NextResponse.json({ 
      message: 'Administrador creado exitosamente',
      user: { 
        id: adminUser.id, 
        email: adminUser.email, 
        name: adminUser.name,
        role: adminUser.role
      } 
    }, { status: 201 })

  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}