import { prisma } from '@/lib/prisma'

export async function notifyEtudiantsForNewOffre(
  domaine: string,
  titre: string,
  entrepriseNom: string
) {
  const etudiants = await prisma.etudiant.findMany({
    where: {
      domaine: { equals: domaine, mode: 'insensitive' },
      NOT: { domaine: null },
    },
    select: { userId: true },
  })

  if (etudiants.length === 0) return

  await prisma.notification.createMany({
    data: etudiants.map(e => ({
      userId: e.userId,
      titre: 'Nouvelle offre dans votre domaine',
      message: `"${titre}" chez ${entrepriseNom} — domaine ${domaine}. Découvrez-la dans les offres disponibles.`,
    })),
  })
}
