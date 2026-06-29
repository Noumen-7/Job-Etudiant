import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params
    if (!/^[\w.-]+\.pdf$/i.test(filename)) {
      return NextResponse.json({ success: false, error: 'Fichier introuvable' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'cv', filename)
    const buffer = await readFile(filePath)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Fichier introuvable' }, { status: 404 })
  }
}
