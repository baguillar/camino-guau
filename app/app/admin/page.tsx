
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { AdminClient } from '@/components/admin/admin-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth');
  }

  // Verificar si es admin
  const user = await prisma?.user?.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  });

  if (!user?.isAdmin) {
    redirect('/dashboard');
  }

  // Obtener datos para el dashboard admin
  const stats = await Promise.all([
    prisma?.user?.count(),
    prisma?.event?.count(),
    prisma?.userProgress?.aggregate({
      _sum: { totalKilometers: true }
    }),
    prisma?.attendance?.count({ where: { attended: true } })
  ]);

  const recentEvents = await prisma?.event?.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      attendances: {
        where: { attended: true },
        include: { user: true }
      },
      _count: {
        select: { attendances: true }
      }
    }
  });

  const recentUsers = await prisma?.user?.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      userProgress: true,
      dogs: true
    }
  });

  return (
    <AdminClient 
      stats={{
        totalUsers: stats[0] || 0,
        totalEvents: stats[1] || 0,
        totalKilometers: stats[2]?._sum?.totalKilometers || 0,
        totalAttendances: stats[3] || 0
      }}
      recentEvents={recentEvents || []}
      recentUsers={recentUsers || []}
      session={session}
    />
  );
}
