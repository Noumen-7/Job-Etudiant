import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { deleteAvatarFile, validateAvatarFile } from '@/lib/avatar.server'
import { buildAvatarUrl } from '@/lib/avatar'

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole('ENTREPRISE')
    const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
    if (!entreprise) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    const formData = await req.formData()
    const file = formData.get('avatar') as File | null
    if (!file) return NextResponse.json({ success: false, error: 'Image requise' }, { status: 400 })

    const validationError = validateAvatarFile(file)
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 })

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(uploadDir, { recursive: true })

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const filename = `entreprise-${entreprise.id}-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, filename), buffer)

    const avatarUrl = buildAvatarUrl(filename)
    await deleteAvatarFile(entreprise.avatarUrl)

    const updated = await prisma.entreprise.update({
      where: { userId: user.userId },
      data: { avatarUrl },
    })

    return NextResponse.json({ success: true, data: { avatarUrl: updated.avatarUrl } })
  } catch (err) {
    console.error('Avatar upload error:', err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await requireRole('ENTREPRISE')
    const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
    if (!entreprise) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    await deleteAvatarFile(entreprise.avatarUrl)

    await prisma.entreprise.update({
      where: { userId: user.userId },
      data: { avatarUrl: null },
    })

    return NextResponse.json({ success: true, data: { avatarUrl: null } })
  } catch (err) {
    console.error('Avatar delete error:', err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
