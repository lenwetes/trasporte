import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.usuario.findMany({
        where: {
            rol: "ADMIN",
        },
    });

    console.log(
        "Admin Users Found:",
        users.map((u) => ({ email: u.email, nombres: u.nombres })),
    );
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
