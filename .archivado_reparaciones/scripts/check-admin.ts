import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as argon2 from "argon2";
import "dotenv/config";

const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

const prisma = createPrismaClient();

async function checkAdmin() {
    const admin = await prisma.usuario.findUnique({
        where: { email: "admin@coopetraes.com" },
    });

    if (!admin) {
        console.log("Admin user not found in database.");
        return;
    }

    console.log("Admin user found.");
    console.log("Email:", admin.email);
    console.log("Password Hash:", admin.passwordHash);

    const testPassword = "12345678";
    try {
        const isValid = await argon2.verify(admin.passwordHash, testPassword);
        console.log(
            `Password '12345678' is ${isValid ? "VALID" : "INVALID"} for this hash.`,
        );
    } catch (error) {
        console.error("Error verifying password:", error);
    }
}

checkAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
