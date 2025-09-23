
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RoutesClient } from './routes-client';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function RoutesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  try {
    // Get upcoming routes with participation data
    const routes = await prisma.route.findMany({
      where: {
        date: {
          gte: new Date(), // Only upcoming routes
        },
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        participations: {
          select: {
            userId: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            participations: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Transform data for client
    const routesData = routes.map(route => {
      const averageRating = route.reviews?.length > 0 
        ? route.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / route.reviews.length 
        : 0;
      
      const isUserRegistered = route.participations?.some((p: any) => p.userId === session.user.id) || false;
      const participantsCount = route.participations?.length || 0;

      return {
        id: route.id,
        title: route.title,
        description: route.description,
        kilometers: route.kilometers,
        date: route.date.toISOString(),
        maxParticipants: route.maxParticipants,
        createdBy: route.creator?.name || null,
        isUserRegistered,
        participantsCount,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewsCount: route.reviews?.length || 0,
        createdAt: route.createdAt.toISOString(),
      };
    });

    return (
      <RoutesClient 
        routes={routesData} 
        currentUserId={session.user.id}
      />
    );
  } catch (error) {
    console.error('Routes error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Error al cargar las rutas</h1>
          <p className="text-gray-600">Inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    );
  }
}
