

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = "force-dynamic"

const dogSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  breed: z.string().optional(),
  sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).default('UNKNOWN'),
  age: z.number().int().min(0).max(30).optional(),
  photo: z.string().url().optional(),
  obedience: z.number().int().min(1).max(10).default(5),
  socializationWithDogs: z.number().int().min(1).max(10).default(5),
  socializationWithPeople: z.number().int().min(1).max(10).default(5),
  specialCharacteristic: z.string().max(200).optional()
})

// GET - Get user's dogs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const dogs = await prisma.dog.findMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ dogs })
  } catch (error) {
    console.error('Error getting dogs:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Create new dog
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = dogSchema.parse(body)

    const dog = await prisma.dog.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    })

    return NextResponse.json({ dog }, { status: 201 })
  } catch (error) {
    console.error('Error creating dog:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
