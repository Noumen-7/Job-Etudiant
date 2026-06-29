import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireRole('ENTREPRISE')
    const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
    return NextResponse.json({ success: true, data: entreprise })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireRole('ENTREPRISE')
    const body = await req.json()
    const { nom, secteur, description, site, telephone, adresse } = body
    if (!nom) return NextResponse.json({ success: false, error: 'Nom requis' }, { status: 400 })
    const entreprise = await prisma.entreprise.update({
      where: { userId: user.userId },
      data: { nom, secteur, description, site, telephone, adresse },
    })
    return NextResponse.json({ success: true, data: entreprise })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
