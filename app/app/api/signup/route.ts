
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma?.user?.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = await prisma?.user?.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName || ''}`.trim(),
      }
    });

    // Crear progreso inicial del usuario
    await prisma?.userProgress?.create({
      data: {
        userId: user?.id || '',
        totalKilometers: 0,
        eventsCompleted: 0,
        stampsCollected: 0,
        currentLevel: 1,
        experiencePoints: 0,
      }
    });

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name
      }
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
