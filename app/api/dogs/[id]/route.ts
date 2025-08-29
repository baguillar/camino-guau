

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = "force-dynamic"

const dogUpdateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres').optional(),
  breed: z.string().optional(),
  sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional(),
  age: z.number().int().min(0).max(30).optional(),
  photo: z.string().url().optional(),
  obedience: z.number().int().min(1).max(10).optional(),
  socializationWithDogs: z.number().int().min(1).max(10).optional(),
  socializationWithPeople: z.number().int().min(1).max(10).optional(),
  specialCharacteristic: z.string().max(200).optional()
})

// GET - Get specific dog
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const dog = await prisma.dog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!dog) {
      return NextResponse.json(
        { error: 'Perro no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ dog })
  } catch (error) {
    console.error('Error getting dog:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Update dog
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify dog ownership
    const existingDog = await prisma.dog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingDog) {
      return NextResponse.json(
        { error: 'Perro no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = dogUpdateSchema.parse(body)

    const dog = await prisma.dog.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json({ dog })
  } catch (error) {
    console.error('Error updating dog:', error)
    
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

// DELETE - Soft delete dog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify dog ownership
    const existingDog = await prisma.dog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingDog) {
      return NextResponse.json(
        { error: 'Perro no encontrado' },
        { status: 404 }
      )
    }

    // Soft delete
    await prisma.dog.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'Perro eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting dog:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
