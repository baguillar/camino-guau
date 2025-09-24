
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los administradores pueden marcar asistencias' }, { status: 403 });
    }

    const { participationId, attended } = await request.json();

    if (!participationId || typeof attended !== 'boolean') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Check if participation exists
    const participation = await prisma.participation.findUnique({
      where: { id: participationId },
      include: {
        route: true,
        user: true,
      },
    });

    if (!participation) {
      return NextResponse.json({ error: 'Participación no encontrada' }, { status: 404 });
    }

    // Update attendance
    const updatedParticipation = await prisma.participation.update({
      where: { id: participationId },
      data: {
        attended,
        attendedAt: attended ? new Date() : null,
      },
    });

    // If marking as attended, check for new achievements
    if (attended && !participation.attended) {
      await checkAndUnlockAchievements(participation.userId);
    }

    return NextResponse.json({
      message: attended ? 'Asistencia confirmada' : 'Asistencia removida',
      participation: updatedParticipation,
    });
  } catch (error) {
    console.error('Attendance error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Function to check and unlock achievements
async function checkAndUnlockAchievements(userId: string) {
  try {
    // Get user's attended participations with route data
    const userParticipations = await prisma.participation.findMany({
      where: {
        userId,
        attended: true,
      },
      include: {
        route: true,
      },
      orderBy: {
        attendedAt: 'asc',
      },
    });

    const totalEvents = userParticipations.length;
    const totalKilometers = userParticipations.reduce((acc: number, p: { route?: { kilometers: number } | null }) => {
      return acc + (p.route?.kilometers || 0);
    }, 0);

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany();

    // Get user's current achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });

    const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievementId));

    // Check each achievement
    for (const achievement of allAchievements) {
      if (unlockedAchievementIds.has(achievement.id)) {
        continue; // Already unlocked
      }

      let shouldUnlock = false;
      const condition = JSON.parse(achievement.condition);

      switch (achievement.type) {
        case 'EVENTS_TOTAL':
          shouldUnlock = totalEvents >= condition.events;
          break;
        
        case 'KILOMETERS_TOTAL':
          shouldUnlock = totalKilometers >= condition.kilometers;
          break;
        
        case 'EVENTS_CONSECUTIVE':
          // TODO: Implement consecutive logic
          shouldUnlock = false;
          break;
        
        case 'MONTHLY_COMPLETE':
          // TODO: Implement monthly complete logic
          shouldUnlock = false;
          break;
      }

      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            unlockedAt: new Date(),
            notified: false,
          },
        });
      }
    }
  } catch (error) {
    console.error('Achievement check error:', error);
  }
}
