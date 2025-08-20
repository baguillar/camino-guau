

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const stamps = await prisma.stamp.findMany({
      include: {
        category: true,
        event: true,
      },
      orderBy: [
        { category: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(stamps);
  } catch (error) {
    console.error('Error fetching stamps:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
