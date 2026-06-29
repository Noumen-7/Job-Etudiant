import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  const result = await prisma.$executeRaw`
    UPDATE "Offre"
    SET "dateFin" = "createdAt" + INTERVAL '90 days'
    WHERE "dateFin" IS NULL
  `
  console.log(`Offres mises à jour : ${result}`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
