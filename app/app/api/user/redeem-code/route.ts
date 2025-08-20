
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

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Código es requerido' }, { status: 400 });
    }

    // Buscar el código
    const entryCode = await prisma?.entryCode?.findUnique({
      where: { code: code.toUpperCase() },
      include: { event: true }
    });

    if (!entryCode) {
      return NextResponse.json({ error: 'Código no válido' }, { status: 400 });
    }

    if (entryCode.isUsed) {
      return NextResponse.json({ error: 'Código ya utilizado' }, { status: 400 });
    }

    if (entryCode.expiresAt && new Date() > entryCode.expiresAt) {
      return NextResponse.json({ error: 'Código expirado' }, { status: 400 });
    }

    // Verificar si el usuario ya usó este código
    const existingUsage = await prisma?.entryCodeUsage?.findUnique({
      where: { entryCodeId: entryCode.id }
    });

    if (existingUsage) {
      return NextResponse.json({ error: 'Código ya utilizado' }, { status: 400 });
    }

    // Marcar código como usado y crear registro de uso
    await prisma?.entryCode?.update({
      where: { id: entryCode.id },
      data: { isUsed: true }
    });

    await prisma?.entryCodeUsage?.create({
      data: {
        entryCodeId: entryCode.id,
        userId: session.user.id
      }
    });

    // Actualizar progreso del usuario
    const userProgress = await prisma?.userProgress?.upsert({
      where: { userId: session.user.id },
      update: {
        totalKilometers: {
          increment: entryCode.kilometers
        },
        eventsCompleted: {
          increment: 1
        }
      },
      create: {
        userId: session.user.id,
        totalKilometers: entryCode.kilometers,
        eventsCompleted: 1,
        stampsCollected: 0,
        currentLevel: 1,
        experiencePoints: Math.floor(entryCode.kilometers * 10)
      }
    });

    // Crear notificación
    await prisma?.notification?.create({
      data: {
        userId: session.user.id,
        title: '¡Código canjeado!',
        message: `Has canjeado ${entryCode.kilometers} km del evento "${entryCode.event.name}".`,
        type: 'milestone'
      }
    });

    // Verificar logros
    const achievements = await prisma?.achievement?.findMany({
      where: {
        type: 'kilometers',
        threshold: { lte: userProgress.totalKilometers }
      }
    });

    for (const achievement of achievements) {
      const existingAchievement = await prisma?.userAchievement?.findUnique({
        where: {
          userId_achievementId: {
            userId: session.user.id,
            achievementId: achievement.id
          }
        }
      });

      if (!existingAchievement) {
        await prisma?.userAchievement?.create({
          data: {
            userId: session.user.id,
            achievementId: achievement.id
          }
        });

        await prisma?.notification?.create({
          data: {
            userId: session.user.id,
            title: '¡Nuevo logro desbloqueado!',
            message: `Has desbloqueado: ${achievement.name}`,
            type: 'achievement'
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      kilometers: entryCode.kilometers,
      eventName: entryCode.event.name,
      totalKilometers: userProgress.totalKilometers
    });
  } catch (error) {
    console.error('Error redeeming code:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
