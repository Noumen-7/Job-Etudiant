import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { notifyEtudiantsForNewOffre } from '@/lib/offre.server'

async function getEntrepriseOffre(userId: string, id: string) {
  const entreprise = await prisma.entreprise.findUnique({ where: { userId } })
  if (!entreprise) throw new Error('Profil non trouvé')
  const offre = await prisma.offre.findFirst({ where: { id, entrepriseId: entreprise.id } })
  if (!offre) throw new Error('Offre non trouvée')
  return offre
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await requireRole('ENTREPRISE')
    await getEntrepriseOffre(user.userId, id)

    const body = await req.json()

    let dateFin: Date | undefined
    if (body.dateFin) {
      dateFin = new Date(body.dateFin)
      if (Number.isNaN(dateFin.getTime())) {
        return NextResponse.json({ success: false, error: 'Date de fin invalide' }, { status: 400 })
      }
    }

    const existing = await getEntrepriseOffre(user.userId, id)
    const domaineChanged = body.domaine && body.domaine !== existing.domaine

    const offre = await prisma.offre.update({
      where: { id },
      data: {
        titre: body.titre,
        description: body.description,
        domaine: body.domaine,
        type: body.type,
        lieu: body.lieu,
        remuneration: body.remuneration,
        isActive: body.isActive,
        ...(dateFin && { dateFin }),
      },
      include: { entreprise: true },
    })

    if (domaineChanged && offre.isActive) {
      const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
      if (entreprise) {
        await notifyEtudiantsForNewOffre(offre.domaine, offre.titre, entreprise.nom)
      }
    }

    return NextResponse.json({ success: true, data: offre })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await requireRole('ENTREPRISE')
    await getEntrepriseOffre(user.userId, id)
    await prisma.offre.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
