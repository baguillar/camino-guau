

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DogSex } from '@prisma/client'

export const dynamic = "force-dynamic"

interface Params {
  params: {
    id: string
  }
}

// GET /api/dogs/[id] - Get specific dog
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dog = await prisma.dog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!dog) {
      return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ dog })
  } catch (error) {
    console.error('Error fetching dog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/dogs/[id] - Update dog
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      breed,
      sex,
      age,
      photo,
      obedience,
      socializationWithDogs,
      socializationWithPeople,
      specialCharacteristic
    } = body

    // Check if dog exists and belongs to user
    const existingDog = await prisma.dog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingDog) {
      return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 })
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }

    if (name.length > 50) {
      return NextResponse.json({ error: 'El nombre no puede exceder 50 caracteres' }, { status: 400 })
    }

    if (sex && !['MALE', 'FEMALE', 'UNKNOWN'].includes(sex)) {
      return NextResponse.json({ error: 'Sexo inválido' }, { status: 400 })
    }

    if (age !== null && age !== undefined && (age < 0 || age > 30)) {
      return NextResponse.json({ error: 'La edad debe estar entre 0 y 30 años' }, { status: 400 })
    }

    if (obedience && (obedience < 1 || obedience > 10)) {
      return NextResponse.json({ error: 'La obediencia debe estar entre 1 y 10' }, { status: 400 })
    }

    if (socializationWithDogs && (socializationWithDogs < 1 || socializationWithDogs > 10)) {
      return NextResponse.json({ error: 'La socialización con perros debe estar entre 1 y 10' }, { status: 400 })
    }

    if (socializationWithPeople && (socializationWithPeople < 1 || socializationWithPeople > 10)) {
      return NextResponse.json({ error: 'La socialización con personas debe estar entre 1 y 10' }, { status: 400 })
    }

    if (specialCharacteristic && specialCharacteristic.length > 200) {
      return NextResponse.json({ error: 'La característica especial no puede exceder 200 caracteres' }, { status: 400 })
    }

    const dog = await prisma.dog.update({
      where: {
        id: params.id
      },
      data: {
        name: name.trim(),
        breed: breed ? breed.trim() : null,
        sex: (sex as DogSex) || 'UNKNOWN',
        age: age || null,
        photo: photo || null,
        obedience: obedience || 5,
        socializationWithDogs: socializationWithDogs || 5,
        socializationWithPeople: socializationWithPeople || 5,
        specialCharacteristic: specialCharacteristic ? specialCharacteristic.trim() : null
      }
    })

    return NextResponse.json({ dog })
  } catch (error) {
    console.error('Error updating dog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/dogs/[id] - Delete dog (soft delete)
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if dog exists and belongs to user
    const existingDog = await prisma.dog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!existingDog) {
      return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 })
    }

    // Soft delete - mark as inactive
    await prisma.dog.update({
      where: {
        id: params.id
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ message: 'Perro eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting dog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
