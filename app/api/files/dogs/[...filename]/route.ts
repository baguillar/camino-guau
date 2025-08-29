

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = "force-dynamic"

// Simple mime type detection
const getMimeType = (filename: string): string => {
  const ext = filename.toLowerCase().split('.').pop()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string[] } }
) {
  try {
    const filename = params.filename?.[0] ?? ''
    
    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || !filename) {
      return NextResponse.json(
        { error: 'Archivo no válido' },
        { status: 400 }
      )
    }

    const filePath = join(process.cwd(), 'uploads', 'dogs', filename)

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      )
    }

    const fileBuffer = await readFile(filePath)
    const mimeType = getMimeType(filename)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000', // 1 year cache
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
