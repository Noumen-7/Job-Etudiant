import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import {
  buildCvStoragePath,
  deleteCvFile,
  getCvUploadDir,
  validateCvFile,
} from '@/lib/cv.server'

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole('ETUDIANT')
    const etudiant = await prisma.etudiant.findUnique({ where: { userId: user.userId } })
    if (!etudiant) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    const formData = await req.formData()
    const file = formData.get('cv') as File | null
    if (!file) return NextResponse.json({ success: false, error: 'Fichier CV requis' }, { status: 400 })

    const validationError = validateCvFile(file)
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 })

    const uploadDir = getCvUploadDir()
    await mkdir(uploadDir, { recursive: true })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `default-etudiant-${etudiant.id}-${Date.now()}-${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, filename), buffer)

    const cvUrl = buildCvStoragePath(filename)
    await deleteCvFile(etudiant.cvUrl)

    const updated = await prisma.etudiant.update({
      where: { userId: user.userId },
      data: { cvUrl },
    })

    return NextResponse.json({ success: true, data: { cvUrl: updated.cvUrl } })
  } catch (err) {
    console.error('CV upload error:', err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await requireRole('ETUDIANT')
    const etudiant = await prisma.etudiant.findUnique({ where: { userId: user.userId } })
    if (!etudiant) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    await deleteCvFile(etudiant.cvUrl)

    await prisma.etudiant.update({
      where: { userId: user.userId },
      data: { cvUrl: null },
    })

    return NextResponse.json({ success: true, data: { cvUrl: null } })
  } catch (err) {
    console.error('CV delete error:', err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
