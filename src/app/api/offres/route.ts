import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_OFFER_DURATION_DAYS } from '@/lib/offre'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const domaine = searchParams.get('domaine') || ''
    const now = new Date()
    const legacyCutoff = new Date(now.getTime() - DEFAULT_OFFER_DURATION_DAYS * 86400000)

    const offres = await prisma.offre.findMany({
      where: {
        isActive: true,
        OR: [
          { dateFin: { gte: now } },
          { dateFin: null, createdAt: { gte: legacyCutoff } },
        ],
        ...(domaine && { domaine: { equals: domaine, mode: 'insensitive' } }),
        ...(search && {
          AND: [{
            OR: [
              { titre: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }],
        }),
      },
      include: { entreprise: { select: { nom: true, secteur: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    })


    /****VOICI LE CONTENU DU ROUTE.TS POUR ACTIVER LA NOTIFICATION EN TEMPS REEL***
    import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_OFFER_DURATION_DAYS } from '@/lib/offre'

declare global {
  var io: any;
}

// ==========================================
// 1. VOTRE CODE EXISTANT (Gestion de l'affichage / Recherche)
// ==========================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const domaine = searchParams.get('domaine') || ''
    const now = new Date()
    const legacyCutoff = new Date(now.getTime() - DEFAULT_OFFER_DURATION_DAYS * 86400000)

    const offres = await prisma.offre.findMany({
      where: {
        isActive: true,
        OR: [
          { dateFin: { gte: now } },
          { dateFin: null, createdAt: { gte: legacyCutoff } },
        ],
        ...(domaine && { domaine: { equals: domaine, mode: 'insensitive' } }),
        ...(search && {
          AND: [{
            OR: [
              { titre: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }],
        }),
      },
      include: { 
        entreprise: { select: { nom: true, secteur: true, avatarUrl: true } },
        competences: true
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: offres })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}



    return NextResponse.json({ success: true, data: offres })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
**/
