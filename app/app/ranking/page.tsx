
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RankingClient } from './ranking-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  try {
    // Get users with their stats
    const users = await prisma.user.findMany({
      include: {
        dog: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        participations: {
          where: { attended: true },
          include: {
            route: {
              select: {
                kilometers: true,
              },
            },
          },
        },
        userAchievements: {
          select: {
            id: true,
          },
        },
      },
    });

    // Calculate stats and create ranking
    const usersWithStats = users.map((user: any) => {
      const totalKilometers = user.participations.reduce((acc: number, p: any) => acc + p.route.kilometers, 0);
      const totalEvents = user.participations.length;
      const totalAchievements = user.userAchievements.length;

      return {
        id: user.id,
        name: user.name,
        profileImage: user.profileImage,
        dog: user.dog ? {
          name: user.dog.name,
          profileImage: user.dog.profileImage,
        } : null,
        stats: {
          totalKilometers: Math.round(totalKilometers * 100) / 100, // Round to 2 decimals
          totalEvents,
          totalAchievements,
        },
      };
    })
    .filter((user: any) => user.stats.totalKilometers > 0) // Only show users with activity
    .sort((a: any, b: any) => b.stats.totalKilometers - a.stats.totalKilometers); // Sort by kilometers desc

    // Add ranking positions
    const ranking = usersWithStats.map((user: any, index: number) => ({
      ...user,
      position: index + 1,
      isCurrentUser: user.id === session.user.id,
    }));

    return (
      <RankingClient 
        ranking={ranking} 
        currentUserId={session.user.id}
      />
    );
  } catch (error) {
    console.error('Ranking error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Error al cargar el ranking</h1>
          <p className="text-gray-600">Inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    );
  }
}
