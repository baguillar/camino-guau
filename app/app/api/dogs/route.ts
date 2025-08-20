
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { name, breed, image } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'El nombre del perro es requerido' }, { status: 400 });
    }

    // Verificar si el usuario ya tiene un perro
    const existingDog = await prisma.dog.findFirst({
      where: { userId: session.user.id }
    });

    if (existingDog) {
      // Actualizar perro existente
      const updatedDog = await prisma.dog.update({
        where: { id: existingDog.id },
        data: {
          name: name.trim(),
          breed: breed?.trim() || null,
          image: image || null,
        },
      });

      return NextResponse.json({
        success: true,
        dog: updatedDog
      });
    } else {
      // Crear nuevo perro
      const dog = await prisma.dog.create({
        data: {
          name: name.trim(),
          breed: breed?.trim() || null,
          image: image || null,
          userId: session.user.id,
        },
      });

      // Crear progreso inicial para el usuario si no existe
      await prisma.userProgress.upsert({
        where: { userId: session.user.id },
        update: {},
        create: {
          userId: session.user.id,
          totalKilometers: 0,
          eventsCompleted: 0,
          stampsCollected: 0,
          currentLevel: 1,
          experiencePoints: 0,
        }
      });

      return NextResponse.json({
        success: true,
        dog: dog
      });
    }

  } catch (error) {
    console.error('Error creando/actualizando perro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const dogs = await prisma.dog.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      dogs: dogs
    });

  } catch (error) {
    console.error('Error obteniendo perros:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
