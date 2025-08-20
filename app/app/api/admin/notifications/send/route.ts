
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

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

    const { title, message, type, targetUsers } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Título y mensaje son requeridos' }, { status: 400 });
    }

    // Obtener usuarios objetivo
    let users: any[] = [];
    
    if (targetUsers === 'all') {
      users = await prisma?.user?.findMany({
        select: { id: true, pushToken: true }
      }) || [];
    } else if (targetUsers === 'active') {
      users = await prisma?.user?.findMany({
        where: {
          userProgress: {
            totalKilometers: { gt: 0 }
          }
        },
        select: { id: true, pushToken: true }
      }) || [];
    } else if (targetUsers === 'admins') {
      users = await prisma?.user?.findMany({
        where: { isAdmin: true },
        select: { id: true, pushToken: true }
      }) || [];
    }

    // Crear notificaciones individuales
    const notifications = users.map(user => ({
      userId: user.id,
      title,
      message,
      type,
      data: {}
    }));

    if (notifications.length > 0) {
      await prisma?.notification?.createMany({
        data: notifications
      });
    }

    // Aquí iría la lógica para enviar las notificaciones push reales
    // usando el servicio de notificaciones push (Firebase, OneSignal, etc.)

    const result = {
      id: Date.now().toString(),
      title,
      message,
      type,
      recipients: users.length,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
