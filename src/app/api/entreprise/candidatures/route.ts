import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireRole('ENTREPRISE')
    const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
    if (!entreprise) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    const candidatures = await prisma.candidature.findMany({
      where: { offre: { entrepriseId: entreprise.id } },
      include: {
        etudiant: { select: { nom: true, prenom: true, domaine: true, telephone: true, linkedin: true, portfolio: true, avatarUrl: true } },
        offre: { select: { titre: true, type: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: candidatures })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
