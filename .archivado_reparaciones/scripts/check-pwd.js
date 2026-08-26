const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const argon2 = require("argon2");

async function check() {
    const prisma = new PrismaClient();
    try {
        const admin = await prisma.usuario.findUnique({
            where: { email: "admin@coopetraes.com" },
        });

        if (!admin) {
            console.log("LOG: NOT_FOUND");
            return;
        }

        const testPassword = "12345678";
        const isValid = await argon2.verify(admin.passwordHash, testPassword);
        console.log("LOG: VALID_PWD", isValid);
    } catch (e) {
        console.log("LOG: ERROR", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
