import { PrismaClient, Rol, Modalidad, TipoDocumento } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { faker } from "@faker-js/faker";
import { hash } from "argon2";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🔥 Iniciando Carga Masiva (Heavy Seeding)...");
    const startTime = Date.now();

    const passwordHash = await hash("conductor123");

    // 1. Crear Conductores (500)
    console.log("👥 Generando 500 conductores...");
    const userPromises = [];
    for (let i = 0; i < 500; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        userPromises.push(
            prisma.usuario.create({
                data: {
                    nombres: firstName,
                    apellidos: lastName,
                    email: faker.internet.email({
                        firstName,
                        lastName,
                        provider: "coopetraes.test",
                    }),
                    passwordHash,
                    rol: Rol.CONDUCTOR,
                    tipoDocumento: TipoDocumento.CC,
                    numeroDocumento: faker.string.numeric(10),
                    municipio: "Sincelejo",
                    telefono: faker.phone.number(),
                    activo: true,
                },
            }),
        );
        if (userPromises.length >= 50) {
            await Promise.all(userPromises);
            userPromises.length = 0;
            process.stdout.write(".");
        }
    }
    await Promise.all(userPromises);
    console.log("\n✅ Conductores creados.");

    // 2. Crear Vehículos (200)
    console.log("🚗 Generando 200 vehículos...");
    const vehiculos = [];
    const modalities = Object.values(Modalidad);
    for (let i = 0; i < 200; i++) {
        const plate =
            faker.string.alpha({ length: 3, casing: "upper" }) +
            faker.string.numeric(3);
        const vehiculo = await prisma.vehiculo.create({
            data: {
                placa: plate,
                marca: faker.vehicle.manufacturer(),
                modelo: faker.vehicle.model(),
                anho: faker.number.int({ min: 2010, max: 2024 }),
                modalidad:
                    modalities[
                        faker.number.int({ min: 0, max: modalities.length - 1 })
                    ],
                propietario: faker.company.name(),
                activo: true,
            },
        });
        vehiculos.push(vehiculo);
        if (i % 20 === 0) process.stdout.write(".");
    }
    console.log("\n✅ Vehículos creados.");

    // 3. Crear Vinculaciones
    console.log("🔗 Vinculando conductores y vehículos...");
    const allConductors = await prisma.usuario.findMany({
        where: { rol: Rol.CONDUCTOR, email: { contains: "coopetraes.test" } },
        select: { id: true },
    });

    for (let i = 0; i < vehiculos.length; i++) {
        const vehiculo = vehiculos[i];
        const numConductors = faker.number.int({ min: 1, max: 2 });
        for (let j = 0; j < numConductors; j++) {
            const conductor = faker.helpers.arrayElement(allConductors);
            await prisma.vinculacion
                .create({
                    data: {
                        conductorId: conductor.id,
                        vehiculoId: vehiculo.id,
                        activo: true,
                    },
                })
                .catch(() => {});
        }
        if (i % 20 === 0) process.stdout.write(".");
    }
    console.log("\n✅ Vinculaciones completadas.");

    // 4. Crear Documentos
    console.log("📄 Generando documentos para vehículos...");
    const docTypes = [
        "SOAT",
        "TECNOMECANICA",
        "TARJETA_OPERACION",
        "POLIZA_CONTRACTUAL",
        "POLIZA_EXTRACONTRACTUAL",
    ];
    for (const vehiculo of vehiculos) {
        for (const tipo of docTypes) {
            await prisma.documentoVehiculo.create({
                data: {
                    vehiculoId: vehiculo.id,
                    tipo,
                    fechaVencimiento: faker.date.between({
                        from: faker.date.recent({ days: 30 }),
                        to: faker.date.soon({ days: 365 }),
                    }),
                },
            });
        }
    }
    console.log("✅ Documentos generados.");

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n🎉 Carga masiva completada en ${duration.toFixed(2)}s`);
}

main()
    .catch((e) => {
        console.error("❌ Error en seeding pesado:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
