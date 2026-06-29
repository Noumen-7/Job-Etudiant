import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params
    if (!/^[\w.-]+\.(jpg|jpeg|png|webp)$/i.test(filename)) {
      return NextResponse.json({ success: false, error: 'Fichier introuvable' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'avatars', filename)
    const buffer = await readFile(filePath)
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': MIME[ext] || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Fichier introuvable' }, { status: 404 })
  }
}
