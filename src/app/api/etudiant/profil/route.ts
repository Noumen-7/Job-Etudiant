import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireRole('ETUDIANT')
    const etudiant = await prisma.etudiant.findUnique({ where: { userId: user.userId } })
    return NextResponse.json({ success: true, data: etudiant })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireRole('ETUDIANT')
    const body = await req.json()
    const { nom, prenom, telephone, description, portfolio, linkedin, domaine } = body

    const etudiant = await prisma.etudiant.update({
      where: { userId: user.userId },
      data: { nom, prenom, telephone, description, portfolio, linkedin, domaine },
    })

    return NextResponse.json({ success: true, data: etudiant })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
