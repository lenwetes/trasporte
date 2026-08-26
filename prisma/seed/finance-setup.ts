import { PrismaClient } from "@prisma/client";

export async function seedFinanceSetup(prisma: PrismaClient) {
    console.log("💳 Configurando enlaces financieros maestros...");

    // 1. Obtener los IDs de las cuentas críticas por código
    const [cuentaCaja, cuentaIngresos, cuentaCobrar, cuentaGastos, cuentaBancos] = await Promise.all([
        prisma.cuentaContable.findUnique({ where: { codigo: "110505" } }), // Caja General
        prisma.cuentaContable.findUnique({ where: { codigo: "415510" } }), // Ingresos FUEC
        prisma.cuentaContable.findUnique({ where: { codigo: "130510" } }), // CXC FUEC
        prisma.cuentaContable.findUnique({ where: { codigo: "514540" } }), // Gastos Manto
        prisma.cuentaContable.findUnique({ where: { codigo: "111005" } }), // Bancos
    ]);

    // 2. Asociar estos IDs a la configuración global por defecto
    await prisma.configuracionGlobal.upsert({
        where: { id: "default" },
        update: {
            cuentaCajaId: cuentaCaja?.id || null,
            cuentaIngresosId: cuentaIngresos?.id || null,
            cuentaCobrarId: cuentaCobrar?.id || null,
            cuentaGastosId: cuentaGastos?.id || null,
            cuentaBancosId: cuentaBancos?.id || null,
        },
        create: {
            id: "default",
            nombreEmpresa: "COOPETRAES S.A.",
            cuentaCajaId: cuentaCaja?.id || null,
            cuentaIngresosId: cuentaIngresos?.id || null,
            cuentaCobrarId: cuentaCobrar?.id || null,
            cuentaGastosId: cuentaGastos?.id || null,
            cuentaBancosId: cuentaBancos?.id || null,
        }
    });

    console.log("✅ Enlaces financieros configurados correctamente.");
}
