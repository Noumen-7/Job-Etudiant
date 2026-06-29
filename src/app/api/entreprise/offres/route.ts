import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { notifyEtudiantsForNewOffre } from '@/lib/offre.server'

export async function GET() {
  try {
    const user = await requireRole('ENTREPRISE')
    const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
    if (!entreprise) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    const offres = await prisma.offre.findMany({
      where: { entrepriseId: entreprise.id },
      include: { _count: { select: { candidatures: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: offres })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole('ENTREPRISE')
    const entreprise = await prisma.entreprise.findUnique({ where: { userId: user.userId } })
    if (!entreprise) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    const body = await req.json()
    const { titre, description, domaine, type, lieu, remuneration, dateFin } = body

    if (!titre || !description || !domaine || !type || !dateFin) {
      return NextResponse.json({ success: false, error: 'Titre, description, domaine, type et date de fin requis' }, { status: 400 })
    }

    const parsedDateFin = new Date(dateFin)
    if (Number.isNaN(parsedDateFin.getTime())) {
      return NextResponse.json({ success: false, error: 'Date de fin invalide' }, { status: 400 })
    }

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    if (parsedDateFin < startOfToday) {
      return NextResponse.json({ success: false, error: 'La date de fin doit être aujourd\'hui ou ultérieure' }, { status: 400 })
    }

    const offre = await prisma.offre.create({
      data: {
        entrepriseId: entreprise.id,
        titre,
        description,
        domaine,
        type,
        lieu,
        remuneration,
        dateFin: parsedDateFin,
      },
    })

    await notifyEtudiantsForNewOffre(domaine, titre, entreprise.nom)

    return NextResponse.json({ success: true, data: offre }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
