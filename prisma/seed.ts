import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  console.log('🌱 Seeding database...')

  const etudiantUser = await prisma.user.upsert({
    where: { email: 'etudiant@test.mg' },
    update: {},
    create: {
      email: 'etudiant@test.mg',
      password: await bcrypt.hash('password123', 10),
      role: 'ETUDIANT',
      etudiant: {
        create: {
          nom: 'Rakoto',
          prenom: 'Aina',
          telephone: '+261 34 00 000 00',
          domaine: 'Informatique',
          description: 'Étudiant en M1 Informatique passionné par le développement web.',
          linkedin: 'https://linkedin.com/in/aina-rakoto',
          portfolio: 'https://github.com/aina-rakoto',
        }
      }
    }
  })
  console.log('✅ Étudiant:', etudiantUser.email)

  const entrepriseUser = await prisma.user.upsert({
    where: { email: 'entreprise@test.mg' },
    update: {},
    create: {
      email: 'entreprise@test.mg',
      password: await bcrypt.hash('password123', 10),
      role: 'ENTREPRISE',
      entreprise: {
        create: {
          nom: 'Tech Madagascar',
          secteur: 'Informatique',
          description: 'Entreprise spécialisée dans le développement de solutions digitales.',
          site: 'https://techmadagascar.mg',
          telephone: '+261 20 22 000 00',
          adresse: 'Antananarivo, Analamanga',
        }
      }
    }
  })
  console.log('✅ Entreprise:', entrepriseUser.email)

  const entreprise = await prisma.entreprise.findUnique({ where: { userId: entrepriseUser.id } })
  if (!entreprise) throw new Error('Entreprise non trouvée')

  const offres = [
    { titre: 'Développeur Web Junior', description: 'Nous recherchons un développeur web junior.\n\nMissions :\n- Développement frontend en React\n- Intégration APIs REST\n\nProfil :\n- HTML, CSS, JavaScript\n- Notions de React', domaine: 'Informatique', type: 'Stage', lieu: 'Antananarivo', remuneration: '200 000 MGA/mois' },
    { titre: 'Assistant Marketing Digital', description: 'Rejoignez notre équipe marketing.\n\nMissions :\n- Gestion réseaux sociaux\n- Création de contenus\n\nProfil :\n- Formation marketing\n- Maîtrise outils digitaux', domaine: 'Marketing', type: 'Stage', lieu: 'Antananarivo', remuneration: '150 000 MGA/mois' },
    { titre: 'Analyste Financier Junior', description: 'Poste CDD pour analyste motivé.\n\nMissions :\n- Analyse états financiers\n- Préparation rapports\n\nProfil :\n- Formation finance\n- Maîtrise Excel', domaine: 'Finance', type: 'CDD', lieu: 'Antananarivo', remuneration: '350 000 MGA/mois' },
    { titre: 'Designer UI/UX Freelance', description: 'Mission freelance pour app mobile.\n\nMissions :\n- Wireframing Figma\n- Maquettes UI\n\nProfil :\n- Portfolio requis\n- Maîtrise Figma', domaine: 'Design', type: 'Freelance', lieu: 'Remote', remuneration: 'À négocier' },
  ]

  for (const offre of offres) {
    await prisma.offre.create({ data: { ...offre, entrepriseId: entreprise.id } })
  }
  console.log('✅ Offres créées:', offres.length)

  console.log('\n🎉 Seed terminé !')
  console.log('   etudiant@test.mg  / password123')
  console.log('   entreprise@test.mg / password123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })
