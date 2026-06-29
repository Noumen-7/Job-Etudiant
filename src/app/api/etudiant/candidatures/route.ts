import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { isOffreExpired } from '@/lib/offre'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import {
  buildCvStoragePath,
  copyCvForCandidature,
  getCvUploadDir,
  validateCvFile,
} from '@/lib/cv.server'

export async function GET() {
  try {
    const user = await requireRole('ETUDIANT')
    const etudiant = await prisma.etudiant.findUnique({ where: { userId: user.userId } })
    if (!etudiant) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    const candidatures = await prisma.candidature.findMany({
      where: { etudiantId: etudiant.id },
      include: {
        offre: {
          include: { entreprise: { select: { nom: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: candidatures })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole('ETUDIANT')
    const etudiant = await prisma.etudiant.findUnique({ where: { userId: user.userId } })
    if (!etudiant) return NextResponse.json({ success: false, error: 'Profil non trouvé' }, { status: 404 })

    const formData = await req.formData()
    const offreId = formData.get('offreId') as string
    const message = formData.get('message') as string | null
    const useDefaultCv = formData.get('useDefaultCv') === 'true'
    const cvFile = formData.get('cv') as File | null

    if (!offreId) {
      return NextResponse.json({ success: false, error: 'Offre requise' }, { status: 400 })
    }

    if (!useDefaultCv && !cvFile) {
      return NextResponse.json({ success: false, error: 'Veuillez sélectionner ou importer un CV' }, { status: 400 })
    }

    if (useDefaultCv && !etudiant.cvUrl) {
      return NextResponse.json({ success: false, error: 'Aucun CV par défaut enregistré sur votre profil' }, { status: 400 })
    }

    // Vérifier que l'offre existe
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
      include: { entreprise: { include: { user: true } } }
    })
    if (!offre || !offre.isActive || isOffreExpired(offre)) {
      return NextResponse.json({ success: false, error: 'Offre non disponible ou expirée' }, { status: 404 })
    }

    // Vérifier doublon
    const existing = await prisma.candidature.findUnique({
      where: { etudiantId_offreId: { etudiantId: etudiant.id, offreId } }
    })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Vous avez déjà postulé à cette offre' }, { status: 409 })
    }

    let cvUrl: string

    if (useDefaultCv) {
      try {
        cvUrl = await copyCvForCandidature(etudiant.cvUrl!, etudiant.id)
      } catch {
        return NextResponse.json({ success: false, error: 'Impossible d\'utiliser le CV par défaut' }, { status: 400 })
      }
    } else {
      const validationError = validateCvFile(cvFile!)
      if (validationError) {
        return NextResponse.json({ success: false, error: validationError }, { status: 400 })
      }

      const uploadDir = getCvUploadDir()
      await mkdir(uploadDir, { recursive: true })
      const safeName = cvFile!.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filename = `${etudiant.id}-${Date.now()}-${safeName}`
      const buffer = Buffer.from(await cvFile!.arrayBuffer())
      await writeFile(path.join(uploadDir, filename), buffer)
      cvUrl = buildCvStoragePath(filename)
    }

    const candidature = await prisma.candidature.create({
      data: {
        etudiantId: etudiant.id,
        offreId,
        message: message || null,
        cvUrl,
      }
    })

    // Notification entreprise
    await prisma.notification.create({
      data: {
        userId: offre.entreprise.userId,
        titre: 'Nouvelle candidature reçue',
        message: `${etudiant.prenom} ${etudiant.nom} a postulé à votre offre "${offre.titre}".`,
      }
    })

    return NextResponse.json({ success: true, data: candidature }, { status: 201 })
  } catch (err) {
    console.error('Candidature error:', err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
