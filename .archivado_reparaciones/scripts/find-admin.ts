import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const users = await prisma.usuario.findMany({
        select: { email: true, rol: true, nombres: true },
        where: { rol: "ADMIN" },
    });
    console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
