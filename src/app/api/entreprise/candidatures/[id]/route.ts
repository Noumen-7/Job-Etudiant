import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await requireRole('ENTREPRISE')
    const { statut } = await req.json()

    const candidature = await prisma.candidature.update({
      where: { id },
      data: { statut },
      include: { etudiant: { include: { user: true } }, offre: true },
    })

    // Notify etudiant
    const statutLabel = statut === 'ACCEPTE' ? 'acceptée' : 'refusée'
    await prisma.notification.create({
      data: {
        userId: candidature.etudiant.userId,
        titre: `Candidature ${statutLabel}`,
        message: `Votre candidature pour "${candidature.offre.titre}" a été ${statutLabel}.`,
      }
    })

    return NextResponse.json({ success: true, data: candidature })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
