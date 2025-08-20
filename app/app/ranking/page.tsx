
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { RankingClient } from '@/components/ranking/ranking-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth');
  }

  // Obtener ranking de usuarios
  const usersRanking = await prisma?.userProgress?.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          name: true,
          image: true,
          dogs: {
            select: {
              name: true,
              image: true
            },
            take: 1
          }
        }
      }
    },
    orderBy: {
      totalKilometers: 'desc'
    },
    take: 100
  });

  // Obtener posición del usuario actual
  const currentUserProgress = await prisma?.userProgress?.findUnique({
    where: { userId: session.user?.id || '' }
  });

  const userPosition = currentUserProgress ? 
    await prisma?.userProgress?.count({
      where: {
        totalKilometers: {
          gt: currentUserProgress.totalKilometers
        }
      }
    }) : 0;

  return (
    <RankingClient 
      usersRanking={usersRanking || []}
      currentUserId={session.user?.id || ''}
      userPosition={(userPosition || 0) + 1}
      session={session}
    />
  );
}
