import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando migración de pólizas...");

    try {
        // 1. Actualizar todas las POLIZA_CONTRACTUAL a POLIZA_RESPONSABILIDAD_CIVIL
        const updateResult = await prisma.documentoVehiculo.updateMany({
            where: {
                tipo: "POLIZA_CONTRACTUAL",
            },
            data: {
                tipo: "POLIZA_RESPONSABILIDAD_CIVIL",
            },
        });
        
        console.log(`Actualizadas ${updateResult.count} pólizas contractuales a Responsabilidad Civil.`);

        // 2. Eliminar POLIZA_EXTRACONTRACTUAL huérfanas
        const deleteResult = await prisma.documentoVehiculo.deleteMany({
            where: {
                tipo: "POLIZA_EXTRACONTRACTUAL",
            },
        });

        console.log(`Eliminadas ${deleteResult.count} pólizas extracontractuales obsoletas.`);
        
        // 3. Actualizar reglas de alerta
        const ruleUpdate = await prisma.reglaAlerta.updateMany({
            where: {
                tipoDocumento: "POLIZA_CONTRACTUAL",
            },
            data: {
                tipoDocumento: "POLIZA_RESPONSABILIDAD_CIVIL",
            },
        });
        
        await prisma.reglaAlerta.deleteMany({
            where: { tipoDocumento: "POLIZA_EXTRACONTRACTUAL" }
        });

        console.log(`Actualizadas reglas de alerta: ${ruleUpdate.count}`);
        
        console.log("Migración completada exitosamente.");
    } catch (error) {
        console.error("Error durante la migración:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
