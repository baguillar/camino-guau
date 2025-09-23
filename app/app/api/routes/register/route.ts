
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { routeId } = await request.json();

    if (!routeId) {
      return NextResponse.json({ error: 'ID de ruta requerido' }, { status: 400 });
    }

    // Check if route exists and is in the future
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: {
        _count: {
          select: {
            participations: true,
          },
        },
      },
    });

    if (!route) {
      return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 });
    }

    if (route.date < new Date()) {
      return NextResponse.json({ error: 'No se puede apuntar a una ruta pasada' }, { status: 400 });
    }

    // Check if route is full
    if (route.maxParticipants && route._count.participations >= route.maxParticipants) {
      return NextResponse.json({ error: 'La ruta está completa' }, { status: 400 });
    }

    // Check if user is already registered
    const existingParticipation = await prisma.participation.findUnique({
      where: {
        userId_routeId: {
          userId: session.user.id,
          routeId: routeId,
        },
      },
    });

    if (existingParticipation) {
      return NextResponse.json({ error: 'Ya estás apuntado a esta ruta' }, { status: 400 });
    }

    // Create participation
    await prisma.participation.create({
      data: {
        userId: session.user.id,
        routeId: routeId,
        registeredAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Te has apuntado exitosamente a la ruta' });
  } catch (error) {
    console.error('Route registration error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { routeId } = await request.json();

    if (!routeId) {
      return NextResponse.json({ error: 'ID de ruta requerido' }, { status: 400 });
    }

    // Check if route exists and is in the future
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 });
    }

    if (route.date < new Date()) {
      return NextResponse.json({ error: 'No se puede desapuntar de una ruta pasada' }, { status: 400 });
    }

    // Check if user is registered
    const participation = await prisma.participation.findUnique({
      where: {
        userId_routeId: {
          userId: session.user.id,
          routeId: routeId,
        },
      },
    });

    if (!participation) {
      return NextResponse.json({ error: 'No estás apuntado a esta ruta' }, { status: 400 });
    }

    // Delete participation
    await prisma.participation.delete({
      where: {
        userId_routeId: {
          userId: session.user.id,
          routeId: routeId,
        },
      },
    });

    return NextResponse.json({ message: 'Te has desapuntado exitosamente de la ruta' });
  } catch (error) {
    console.error('Route unregistration error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
