
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfileClient } from './profile-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  try {
    // Get user with all related data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dog: true,
        participations: {
          where: { attended: true },
          include: {
            route: {
              select: {
                title: true,
                kilometers: true,
                date: true,
              },
            },
          },
          orderBy: { attendedAt: 'desc' },
        },
        userAchievements: {
          include: {
            achievement: true,
          },
          orderBy: { unlockedAt: 'desc' },
        },
      },
    });

    if (!user) {
      redirect('/auth/signin');
    }

    // Get all available achievements to show progress
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { name: 'asc' },
    });

    // Calculate stats
    const totalEvents = user.participations.length;
    const totalKilometers = user.participations.reduce((acc: number, p: any) => acc + p.route.kilometers, 0);
    const unlockedAchievements = user.userAchievements.map((ua: any) => ua.achievementId);

    // Transform achievements to show locked/unlocked status
    const achievementsWithStatus = allAchievements.map((achievement: any) => {
      const userAchievement = user.userAchievements.find((ua: any) => ua.achievementId === achievement.id);
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        type: achievement.type,
        medalIcon: achievement.medalIcon,
        isUnlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt?.toISOString() || null,
      };
    });

    return (
      <ProfileClient
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          role: user.role,
        }}
        dog={user.dog ? {
          id: user.dog.id,
          name: user.dog.name,
          age: user.dog.age,
          breed: user.dog.breed,
          characterWithPeople: user.dog.characterWithPeople,
          characterWithDogs: user.dog.characterWithDogs,
          isCastrated: user.dog.isCastrated,
          profileImage: user.dog.profileImage,
        } : null}
        stats={{
          totalEvents,
          totalKilometers: Math.round(totalKilometers * 100) / 100,
          totalAchievements: unlockedAchievements.length,
        }}
        achievements={achievementsWithStatus}
        recentParticipations={user.participations.slice(0, 10).map((p: any) => ({
          id: p.id,
          route: {
            title: p.route.title,
            kilometers: p.route.kilometers,
            date: p.route.date.toISOString(),
          },
          attendedAt: p.attendedAt?.toISOString() || null,
        }))}
      />
    );
  } catch (error) {
    console.error('Profile error:', error);
    redirect('/auth/signin');
  }
}
