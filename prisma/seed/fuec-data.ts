import { PrismaClient, Prisma } from "@prisma/client";

export async function seedFUEC(prisma: PrismaClient) {
    console.log("📄 Configurando datos maestros del módulo FUEC...");

    // 1. Crear Contratos de Empresa
    const contratos = [
        {
            numeroContrato: "CONTRATO-2026-001",
            cliente: "COLEGIO SAN FRANCISCO DE ASÍS",
            objeto: "Transporte escolar jornada mañana y tarde",
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31"),
            activo: true,
            valorTotal: new Prisma.Decimal(50000000),
        },
        {
            numeroContrato: "CONTRATO-2026-002",
            cliente: "ALCALDÍA DE SINCELEJO",
            objeto: "Transporte de personal administrativo",
            fechaInicio: new Date("2026-02-01"),
            fechaFin: new Date("2026-08-30"),
            activo: true,
            valorTotal: new Prisma.Decimal(120000000),
        },
        {
            numeroContrato: "TURISMO-2026-001",
            cliente: "AGENCIA DE VIAJES SUCRE",
            objeto: "Servicios de turismo regional y nacional",
            fechaInicio: new Date("2026-01-15"),
            fechaFin: new Date("2026-12-15"),
            activo: true,
            valorTotal: new Prisma.Decimal(80000000),
        },
    ];

    for (const c of contratos) {
        const existing = await prisma.contratoEmpresa.findFirst({
            where: { numeroContrato: c.numeroContrato },
        });

        if (!existing) {
            await prisma.contratoEmpresa.create({
                data: c,
            });
        }
    }
    console.log(`  ✓ ${contratos.length} contratos creados`);

    // 2. Crear Resoluciones FUEC
    const resoluciones = [
        {
            numeroResolucion: "RES-MT-2026-001",
            rangoDesde: 1000,
            rangoHasta: 5000,
            actual: 1000,
            habilitada: true,
            fechaExpedicion: new Date("2026-01-01"),
            fechaVencimiento: new Date("2028-01-01"),
        },
    ];

    for (const r of resoluciones) {
        await prisma.resolucionFUEC.upsert({
            where: { numeroResolucion: r.numeroResolucion },
            update: r,
            create: r,
        });
    }
    console.log(`  ✓ ${resoluciones.length} resoluciones creadas`);

    // 3. Crear Concepto Financiero para FUEC (si no existe)
    // Buscamos la cuenta de ingresos por planillas (415505 - Servicio de transporte)
    const cuentaIngreso = await prisma.cuentaContable.findFirst({
        where: { codigo: "415505" },
    });

    if (cuentaIngreso) {
        await prisma.conceptoFinanciero.upsert({
            where: { id: "concepto-planilla-fuec" }, // Usamos un ID fijo para facilitar referencia
            update: {
                nombre: "Emisión de Planilla FUEC",
                tipo: "INGRESO",
                cuentaId: cuentaIngreso.id,
                valorPorDefecto: new Prisma.Decimal(10000),
                activo: true,
            },
            create: {
                id: "concepto-planilla-fuec",
                nombre: "Emisión de Planilla FUEC",
                tipo: "INGRESO",
                cuentaId: cuentaIngreso.id,
                valorPorDefecto: new Prisma.Decimal(10000),
                activo: true,
            },
        });
        console.log("  ✓ Concepto financiero para FUEC configurado");
    } else {
        console.warn(
            "  × No se encontró la cuenta 415505 para el concepto FUEC",
        );
    }
}
