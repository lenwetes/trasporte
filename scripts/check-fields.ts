import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tableName = process.argv[2] || 'vehiculos'
  const result = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = '${tableName}' OR table_name = '${tableName}s'
  `)
  console.log(JSON.stringify(result, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
