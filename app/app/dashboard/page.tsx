
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth');
  }

  // Obtener datos del usuario
  const userProgress = await prisma?.userProgress?.findUnique({
    where: { userId: session.user?.id || '' },
    include: {
      user: {
        include: {
          dogs: true,
          userStamps: {
            include: { stamp: true }
          },
          achievements: {
            include: { achievement: true }
          }
        }
      }
    }
  });

  // Obtener eventos próximos
  const upcomingEvents = await prisma?.event?.findMany({
    where: {
      date: { gte: new Date() },
      isActive: true
    },
    orderBy: { date: 'asc' },
    take: 5
  });

  return (
    <DashboardClient 
      userProgress={userProgress} 
      upcomingEvents={upcomingEvents || []}
      session={session}
    />
  );
}
