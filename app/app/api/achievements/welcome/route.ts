
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

    // Crear logro de bienvenida si no existe
    const welcomeAchievement = await prisma.achievement.upsert({
      where: { id: 'achievement_welcome' },
      update: {},
      create: {
        id: 'achievement_welcome',
        name: '¡Bienvenido al Camino Guau!',
        description: 'Has configurado tu perfil y estás listo para la aventura',
        icon: 'https://cdn.abacus.ai/images/62987810-4aed-47bb-9db8-d06fc167b839.png',
        type: 'special',
        threshold: 0,
        order: 0
      }
    });

    // Verificar si el usuario ya tiene este logro
    const existingUserAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: session.user.id,
          achievementId: 'achievement_welcome'
        }
      }
    });

    if (!existingUserAchievement) {
      // Otorgar el logro al usuario
      await prisma.userAchievement.create({
        data: {
          userId: session.user.id,
          achievementId: 'achievement_welcome'
        }
      });

      // Actualizar experiencia
      await prisma.userProgress.upsert({
        where: { userId: session.user.id },
        update: {
          experiencePoints: { increment: 50 }
        },
        create: {
          userId: session.user.id,
          totalKilometers: 0,
          eventsCompleted: 0,
          stampsCollected: 0,
          currentLevel: 1,
          experiencePoints: 50,
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Logro de bienvenida otorgado',
        achievement: welcomeAchievement
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Logro ya otorgado previamente'
    });

  } catch (error) {
    console.error('Error otorgando logro de bienvenida:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
