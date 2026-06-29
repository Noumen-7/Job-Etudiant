import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()

    if (user.role === 'ENTREPRISE') {
      const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
      if (!entreprise) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

      const [totalOffres, offresActives, totalCandidatures, enAttente, acceptees, refusees] = await Promise.all([
        prisma.offre.count({ where: { entrepriseId: entreprise.id } }),
        prisma.offre.count({ where: { entrepriseId: entreprise.id, isActive: true } }),
        prisma.candidature.count({ where: { offre: { entrepriseId: entreprise.id } } }),
        prisma.candidature.count({ where: { offre: { entrepriseId: entreprise.id }, statut: 'EN_ATTENTE' } }),
        prisma.candidature.count({ where: { offre: { entrepriseId: entreprise.id }, statut: 'ACCEPTE' } }),
        prisma.candidature.count({ where: { offre: { entrepriseId: entreprise.id }, statut: 'REFUSE' } }),
      ])

      return NextResponse.json({ success: true, data: { totalOffres, offresActives, totalCandidatures, enAttente, acceptees, refusees } })
    }

    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 403 })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
