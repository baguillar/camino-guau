
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar si es admin
    const user = await prisma?.user?.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { userId, kilometers, eventName } = await req.json();

    if (!userId || !kilometers || !eventName) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    // Actualizar o crear progreso del usuario
    const userProgress = await prisma?.userProgress?.upsert({
      where: { userId },
      update: {
        totalKilometers: {
          increment: parseFloat(kilometers)
        },
        eventsCompleted: {
          increment: 1
        }
      },
      create: {
        userId,
        totalKilometers: parseFloat(kilometers),
        eventsCompleted: 1,
        stampsCollected: 0,
        currentLevel: 1,
        experiencePoints: Math.floor(parseFloat(kilometers) * 10)
      }
    });

    // Crear notificación para el usuario
    await prisma?.notification?.create({
      data: {
        userId,
        title: '¡Kilómetros añadidos!',
        message: `Se han añadido ${kilometers} km de "${eventName}" a tu progreso.`,
        type: 'milestone'
      }
    });

    // Verificar si se desbloquearon nuevos logros
    const achievements = await prisma?.achievement?.findMany({
      where: {
        type: 'kilometers',
        threshold: { lte: userProgress.totalKilometers }
      }
    });

    for (const achievement of achievements) {
      // Verificar si ya tiene este logro
      const existingAchievement = await prisma?.userAchievement?.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id
          }
        }
      });

      if (!existingAchievement) {
        await prisma?.userAchievement?.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        });

        // Notificar nuevo logro
        await prisma?.notification?.create({
          data: {
            userId,
            title: '¡Nuevo logro desbloqueado!',
            message: `Has desbloqueado: ${achievement.name}`,
            type: 'achievement'
          }
        });
      }
    }

    return NextResponse.json({ success: true, userProgress });
  } catch (error) {
    console.error('Error adding kilometers:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
