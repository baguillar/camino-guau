
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { user: userData, dog: dogData } = await req.json();

    // Actualizar información del usuario
    const updatedUser = await prisma?.user?.update({
      where: { id: session.user?.id || '' },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName || ''}`.trim(),
        image: userData.image,
      }
    });

    // Crear o actualizar información del perro
    const existingDog = await prisma?.dog?.findFirst({
      where: { userId: session.user?.id || '' }
    });

    if (existingDog) {
      await prisma?.dog?.update({
        where: { id: existingDog.id },
        data: {
          name: dogData.name,
          breed: dogData.breed,
          image: dogData.image,
        }
      });
    } else {
      await prisma?.dog?.create({
        data: {
          name: dogData.name,
          breed: dogData.breed,
          image: dogData.image,
          userId: session.user?.id || '',
        }
      });
    }

    return NextResponse.json({
      message: 'Perfiles actualizados exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error al actualizar perfiles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
