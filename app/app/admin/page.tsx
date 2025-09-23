
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminClient } from './admin-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Check if user is admin
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  try {
    // Get upcoming routes
    const routes = await prisma.route.findMany({
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        participations: {
          include: {
            user: {
              include: {
                dog: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            participations: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Get stats
    const totalUsers = await prisma.user.count();
    const totalRoutes = await prisma.route.count();
    const totalParticipations = await prisma.participation.count();

    // Transform routes data
    const routesData = routes.map((route: any) => ({
      id: route.id,
      title: route.title,
      description: route.description,
      kilometers: route.kilometers,
      date: route.date.toISOString(),
      maxParticipants: route.maxParticipants,
      createdBy: route.creator.name,
      participantsCount: route._count.participations,
      createdAt: route.createdAt.toISOString(),
      participants: route.participations.map((p: any) => ({
        id: p.id,
        userId: p.userId,
        userName: p.user.name,
        userEmail: p.user.email,
        dogName: p.user.dog?.name || null,
        registeredAt: p.registeredAt.toISOString(),
        attended: p.attended,
        attendedAt: p.attendedAt?.toISOString() || null,
      })),
    }));

    return (
      <AdminClient
        routes={routesData}
        stats={{
          totalUsers,
          totalRoutes,
          totalParticipations,
          totalKilometers: 0,
        }}
        currentUserId={session.user.id}
      />
    );
  } catch (error) {
    console.error('Admin error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Error al cargar el panel de administración</h1>
          <p className="text-gray-600">Inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    );
  }
}
