import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const offre = await prisma.offre.findUnique({
      where: { id },
      include: { entreprise: { select: { nom: true, secteur: true, description: true, site: true } } },
    })
    if (!offre) return NextResponse.json({ success: false, error: 'Offre non trouvée' }, { status: 404 })
    return NextResponse.json({ success: true, data: offre })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
