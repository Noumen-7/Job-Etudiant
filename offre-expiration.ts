import { prisma } from '@/lib/prisma'
import { DEFAULT_OFFER_DURATION_DAYS } from '@/lib/offre'

/**
 * Parcourt les offres d'emploi pour désactiver celles expirées, envoie des notifications aux entreprises
 * ainsi qu'aux candidats, et prévient les étudiants des offres de leur domaine expirant bientôt.
 */
export async function checkAndExpireOffres() {
  try {
    const now = new Date()
    const legacyCutoff = new Date(now.getTime() - DEFAULT_OFFER_DURATION_DAYS * 86400000)

    // 1. Trouver les offres expirées encore marquées actives
    const expiredOffres = await prisma.offre.findMany({
      where: {
        isActive: true,
        OR: [
          { dateFin: { lt: now } },
          { dateFin: null, createdAt: { lt: legacyCutoff } },
        ],
      },
      include: {
        entreprise: { select: { nom: true, userId: true } },
        candidatures: {
          include: {
            etudiant: { select: { userId: true } }
          }
        }
      }
    })

    // 2. Désactiver chaque offre expirée et générer les notifications adaptées
    for (const offre of expiredOffres) {
      await prisma.$transaction([
        prisma.offre.update({
          where: { id: offre.id },
          data: { isActive: false }
        }),
        // Notification pour l'entreprise
        prisma.notification.create({
          data: {
            userId: offre.entreprise.userId,
            titre: 'Offre expirée',
            message: `Votre offre "${offre.titre}" a expiré et n'est plus visible ou disponible pour de nouvelles candidatures.`,
          }
        }),
        // Notification pour les étudiants ayant postulé
        ...(offre.candidatures.length > 0 ? [
          prisma.notification.createMany({
            data: offre.candidatures.map((cand: any) => ({
              userId: cand.etudiant.userId,
              titre: 'Offre expirée',
              message: `L'offre "${offre.titre}" de ${offre.entreprise.nom} à laquelle vous avez postulé a expiré.`,
            }))
          })
        ] : [])
      ])
    }

    // 3. Envoyer des alertes pour les offres expirant bientôt (sous 3 jours) aux étudiants du domaine
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const expiringSoonOffres = await prisma.offre.findMany({
      where: {
        isActive: true,
        OR: [
          { dateFin: { gte: now, lte: threeDaysFromNow } },
          {
            dateFin: null,
            createdAt: {
              gte: new Date(now.getTime() - DEFAULT_OFFER_DURATION_DAYS * 86450000),
              lte: new Date(now.getTime() - (DEFAULT_OFFER_DURATION_DAYS - 3) * 86450000)
            }
          }
        ]
      },
      include: {
        entreprise: { select: { nom: true } }
      }
    })

    for (const offre of expiringSoonOffres) {
      const expirationDate = offre.dateFin
        ? new Date(offre.dateFin)
        : new Date(offre.createdAt.getTime() + DEFAULT_OFFER_DURATION_DAYS * 86400000)
      const formattedDate = expirationDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

      // Trouver les étudiants du même domaine n'ayant pas encore postulé
      const etudiants = await prisma.etudiant.findMany({
        where: {
          domaine: { equals: offre.domaine, mode: 'insensitive' },
          NOT: { domaine: null },
          candidatures: {
            none: { offreId: offre.id }
          }
        },
        select: { userId: true }
      })

      // Envoyer une notification si elle n'a pas déjà été envoyée
      for (const etudiant of etudiants) {
        const alreadyNotified = await prisma.notification.findFirst({
          where: {
            userId: etudiant.userId,
            titre: 'Offre expirant bientôt',
            message: { contains: `(Réf: ${offre.id})` }
          }
        })

        if (!alreadyNotified) {
          await prisma.notification.create({
            data: {
              userId: etudiant.userId,
              titre: 'Offre expirant bientôt',
              message: `L'offre "${offre.titre}" chez ${offre.entreprise.nom} expire bientôt (le ${formattedDate}). Postulez vite ! (Réf: ${offre.id})`,
            }
          })
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'expiration des offres:', error)
  }
}
