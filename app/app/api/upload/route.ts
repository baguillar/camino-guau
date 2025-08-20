
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/db';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type = data.get('type') as string; // 'user' or 'dog'
    const dogId = data.get('dogId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 });
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'El archivo es demasiado grande (máximo 5MB)' }, { status: 400 });
    }

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo JPG, PNG y WebP' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${type}_${session.user.id}_${timestamp}.${extension}`;
    
    // Crear directorio uploads si no existe
    const uploadsDir = join(process.cwd(), 'uploads');
    
    // Guardar archivo
    const path = join(uploadsDir, filename);
    await writeFile(path, buffer);
    
    const imageUrl = `/api/files/${filename}`;

    // Actualizar base de datos
    if (type === 'user') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: imageUrl }
      });
    } else if (type === 'dog' && dogId) {
      await prisma.dog.update({
        where: { id: dogId, userId: session.user.id },
        data: { image: imageUrl }
      });
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Imagen subida exitosamente' 
    });

  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
