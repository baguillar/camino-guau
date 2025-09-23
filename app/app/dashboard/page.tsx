
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardClient } from './dashboard-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  try {
    // Get user with dog information
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dog: true,
        participations: {
          where: { attended: true },
          include: {
            route: true,
          },
          orderBy: { attendedAt: 'desc' }
        },
        userAchievements: {
          include: {
            achievement: true,
          },
          orderBy: { unlockedAt: 'desc' }
        },
      },
    });

    if (!user) {
      redirect('/auth/signin');
    }

    // Calculate stats
    const totalEvents = user.participations.length;
    const totalKilometers = user.participations.reduce((acc, p) => acc + p.route.kilometers, 0);
    const totalAchievements = user.userAchievements.length;

    // Get recent participations (last 5)
    const recentParticipations = user.participations.slice(0, 5);

    // Get recent achievements (last 3)
    const recentAchievements = user.userAchievements.slice(0, 3);

    return (
      <DashboardClient
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
          totalKilometers,
          totalAchievements,
        }}
        recentParticipations={recentParticipations.map(p => ({
          id: p.id,
          route: {
            title: p.route.title,
            kilometers: p.route.kilometers,
            date: p.route.date.toISOString(),
          },
          attendedAt: p.attendedAt?.toISOString() || null,
        }))}
        recentAchievements={recentAchievements.map(ua => ({
          id: ua.id,
          achievement: {
            name: ua.achievement.name,
            description: ua.achievement.description,
            medalIcon: ua.achievement.medalIcon,
          },
          unlockedAt: ua.unlockedAt.toISOString(),
        }))}
      />
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    redirect('/auth/signin');
  }
}
