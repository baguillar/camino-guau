
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      name, 
      dogName, 
      dogAge, 
      dogBreed, 
      dogCharacterWithPeople, 
      dogCharacterWithDogs, 
      dogIsCastrated 
    } = body;

    if (!email || !password || !name || !dogName) {
      return NextResponse.json(
        { error: 'Email, password, name, and dog name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and dog in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'USER',
        },
      });

      const dog = await tx.dog.create({
        data: {
          userId: user.id,
          name: dogName,
          age: dogAge ? parseInt(dogAge) : null,
          breed: dogBreed,
          characterWithPeople: dogCharacterWithPeople,
          characterWithDogs: dogCharacterWithDogs,
          isCastrated: Boolean(dogIsCastrated),
        },
      });

      return { user, dog };
    });

    return NextResponse.json({
      message: 'User and dog created successfully',
      userId: result.user.id
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
