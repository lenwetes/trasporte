import { PrismaClient, NaturalezaCuenta, TipoCuenta } from "@prisma/client";

async function fixFuecAccounts() {
    const prisma = new PrismaClient();
    console.log("🛠️ Corrigiendo configuración contable para FUEC...");

    try {
        // 1. Asegurar Cuentas PUC
        const cuentasABuscar = [
            { codigo: "110505", nombre: "Caja General", nivel: 6, padre: "1105", tipo: TipoCuenta.ACTIVO, nat: NaturalezaCuenta.DEBITO },
            { codigo: "130510", nombre: "Cuentas por Cobrar Planillas FUEC", nivel: 6, padre: "1305", tipo: TipoCuenta.ACTIVO, nat: NaturalezaCuenta.DEBITO },
            { codigo: "415510", nombre: "Ingresos por Servicios de Transporte FUEC", nivel: 6, padre: "4155", tipo: TipoCuenta.INGRESO, nat: NaturalezaCuenta.CREDITO },
        ];

        for (const c of cuentasABuscar) {
            const padre = await prisma.cuentaContable.findUnique({ where: { codigo: c.padre } });
            await prisma.cuentaContable.upsert({
                where: { codigo: c.codigo },
                update: {},
                create: {
                    codigo: c.codigo,
                    nombre: c.nombre,
                    nivel: c.nivel,
                    padreId: padre?.id || null,
                    tipo: c.tipo,
                    naturaleza: c.nat,
                    permiteMovimiento: true
                }
            });
            console.log(`✅ Cuenta ${c.codigo} verificada/creada.`);
        }

        // 2. Asociar a Configuración Global
        const [cCaja, cIng, cCob] = await Promise.all([
            prisma.cuentaContable.findUnique({ where: { codigo: "110505" } }),
            prisma.cuentaContable.findUnique({ where: { codigo: "415510" } }),
            prisma.cuentaContable.findUnique({ where: { codigo: "130510" } }),
        ]);

        await prisma.configuracionGlobal.upsert({
            where: { id: "default" },
            update: {
                cuentaCajaId: cCaja?.id,
                cuentaIngresosId: cIng?.id,
                cuentaCobrarId: cCob?.id,
            },
            create: {
                id: "default",
                nombreEmpresa: "COOPETRAES S.A.",
                cuentaCajaId: cCaja?.id || null,
                cuentaIngresosId: cIng?.id || null,
                cuentaCobrarId: cCob?.id || null,
            }
        });

        console.log("✨ Reparación contable FUEC completada exitosamente.");
    } catch (error) {
        console.error("❌ Error durante la reparación:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fixFuecAccounts();
