
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar si es admin
    const user = await prisma?.user?.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { eventId, kilometers, expiresAt } = await req.json();

    if (!eventId || !kilometers) {
      return NextResponse.json({ error: 'EventId y kilómetros son requeridos' }, { status: 400 });
    }

    // Verificar que el evento existe
    const event = await prisma?.event?.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const code = await prisma?.entryCode?.create({
      data: {
        code: `GUAU-${nanoid(8).toUpperCase()}`,
        eventId,
        kilometers: parseFloat(kilometers),
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return NextResponse.json(code);
  } catch (error) {
    console.error('Error generating entry code:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
