import { PrismaClient, Rol, TipoDocumento } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as argon2 from "argon2";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { Prisma } from "@prisma/client";

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

const STORAGE_DIR = path.join(process.cwd(), "storage");

// Ensure directories for storage
function ensureDirectories() {
    const dirs = [
        "fotos_perfil",
        "documentos/licencias",
        "documentos/vehiculos",
        "documentos/examenes",
        "documentos/siniestros",
        "documentos/mantenimientos",
    ];

    if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR);
    }

    dirs.forEach((dir) => {
        const fullPath = path.join(STORAGE_DIR, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
}

async function cleanDatabase() {
    console.log("🧹 Limpiando base de datos (Reset Completo)...");

    // Lista de tablas a vaciar para un inicio limpio
    const tables = [
        "auditLog",
        "notificacion",
        "asientoContable",
        "obligacionFinanciera",
        "investigacionSiniestro",
        "siniestro",
        "detallePreoperacional",
        "preoperacional",
        "novedad",
        "examenMedico",
        "detalleLicencia",
        "experienciaLaboral",
        "referenciaPersonal",
        "hojaVida",
        "entregaDotacion",
        "certificado",
        "mantenimientoRealizado",
        "ordenServicio",
        "transaccion",
        "vinculacion",
        "documentoVehiculo",
        "historialEstadoVehiculo",
        "hojaVidaVehiculo",
        "vehiculo",
        "planillaFUEC",
        "contratoEmpresa",
        "resolucionFUEC",
        "frecuenciaMantenimiento",
        "planMantenimiento",
        "reglaAlerta",
        "repositorioArchivo",
        "proveedor",
        "proveedor",
    ];

    for (const table of tables) {
        try {
            // @ts-ignore
            await prisma[table].deleteMany();
        } catch (e) {
            // Ignorar errores si la tabla no existe o ya está limpia
        }
    }

    // Reset de configuraciones contables truncadas fue suspendido
    // para proteger las cuentas PUC de la base de datos persistente.
    try {
        await prisma.configuracionGlobal.updateMany({
            data: {
                cuentaCajaId: null,
                cuentaBancosId: null,
                cuentaCobrarId: null,
                cuentaIngresosId: null,
                cuentaGastosId: null,
            },
        });
        // await prisma.cuentaContable.updateMany({ data: { padreId: null } });
        // await prisma.cuentaContable.deleteMany();
    } catch (e) {}

    // Eliminar todos los usuarios excepto el que crearemos
    await prisma.usuario.deleteMany();
}

async function main() {
    console.log("🚀 Iniciando Seed de Producción (Instalación Limpia)...");

    ensureDirectories();

    // 1. Restaurar logos FUEC (CRITICO para persistencia)
    const { setupFuecAssets } = await import("./seed/fuec-assets");
    setupFuecAssets();

    // 2. Limpieza total
    await cleanDatabase();

    // 3. Credenciales iniciales
    const adminPassword = await argon2.hash("admin123");

    // 4. Intento de carga de Datos Maestros de Producción (SI EXISTE)
    const { seedProductionData } = await import("./seed/production");
    const masterDataLoaded = await seedProductionData(prisma);

    if (!masterDataLoaded) {
        // Solo cargar datos estáticos si no hay exportación previa
        console.log("💳 Configurando Base Financiera desde archivos estáticos (PUC Colombia)...");
        const { seedPuc, seedConceptos, seedReglas } =
            await import("./seed/puc-data");
        const { seedFinanceSetup } = await import("./seed/finance-setup");
        
        await seedPuc(prisma);
        await seedConceptos(prisma);
        await seedReglas(prisma);
        await seedFinanceSetup(prisma);
    }

    try {
        const { seedPucCustom } = await import("./seed/puc-custom");
        await seedPucCustom(prisma);
    } catch (e) {
        console.log("Not custom puc file included.");
    }

    // 5. Configuración Base FUEC
    console.log("📄 Configurando parámetros maestros FUEC...");
    const { seedFUEC } = await import("./seed/fuec-data");
    await seedFUEC(prisma);

    // 6. Creación Usuario Administrador Inicial
    console.log("👤 Creando cuenta del Administrador (admin@coopetraes.com / admin123)...");
    await prisma.usuario.create({
        data: {
            email: "admin@coopetraes.com",
            nombres: "Administrador",
            apellidos: "Sistema",
            passwordHash: adminPassword,
            rol: Rol.ADMIN,
            tipoDocumento: TipoDocumento.CC,
            numeroDocumento: "1111111111",
            activo: true,
        },
    });

    // 7. Configuración Global por Defecto
    await prisma.configuracionGlobal.upsert({
        where: { id: "default" },
        update: {},
        create: {
            id: "default",
            nombreEmpresa: "COOPETRAES S.A.",
            direccion: "Calle Principal #45-20, Sincelejo",
            telefono: "6052820000",
            email: "gerencia@coopetraes.com",
            colorPrimario: "#00704f", // Verde institucional
            montoCuotaAdministracion: new Prisma.Decimal(85000),
            diaCorteMensual: 5,
        },
    });

    // 8. Banco de datos para pruebas
    // console.log("🧪 Configurando banco de datos para pruebas...");
    // const { seedDummyData } = await import("./seed/dummy-data");
    // await seedDummyData(prisma);

    console.log("\n✨ INSTALACIÓN LIMPIA COMPLETADA (SIN DATOS DE PRUEBA)");
    console.log("------------------------------------------");
    console.log("Usuario: admin@coopetraes.com");
    console.log("Password: admin123");
    console.log("------------------------------------------\n");
}

main()
    .catch((e) => {
        console.error("❌ Error en el proceso de Seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
