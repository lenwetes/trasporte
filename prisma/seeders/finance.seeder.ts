import { PrismaClient } from "@prisma/client";

export async function seedFinance(prisma: PrismaClient) {
    console.log("💰 Sembrando Módulo Financiero (PUC Colombia)...");

    // 1. Cuentas Contables (PUC Colombia - Sector Transporte)
    const cuentas = [
        // --- ACTIVOS (1) ---
        { codigo: "110505", nombre: "Caja General", naturaleza: "DEBITO", tipo: "ACTIVO" },
        { codigo: "111005", nombre: "Bancos (Moneda Nacional)", naturaleza: "DEBITO", tipo: "ACTIVO" },
        { codigo: "130505", nombre: "Cuentas por Cobrar (Asociados/Clientes)", naturaleza: "DEBITO", tipo: "ACTIVO" },
        { codigo: "133005", nombre: "Anticipos a Proveedores", naturaleza: "DEBITO", tipo: "ACTIVO" },
        { codigo: "135505", nombre: "Anticipos de Impuestos (Retención)", naturaleza: "DEBITO", tipo: "ACTIVO" },
        { codigo: "143505", nombre: "Inventarios (Repuestos/Insumos)", naturaleza: "DEBITO", tipo: "ACTIVO" },
        { codigo: "154005", nombre: "Flota y Equipo de Transporte (Propios)", naturaleza: "DEBITO", tipo: "ACTIVO" },

        // --- PASIVOS (2) ---
        { codigo: "210505", nombre: "Obligaciones Financieras (Bancos)", naturaleza: "CREDITO", tipo: "PASIVO" },
        { codigo: "220505", nombre: "Proveedores Nacionales", naturaleza: "CREDITO", tipo: "PASIVO" },
        { codigo: "233505", nombre: "Costos y Gastos por Pagar (Servicios)", naturaleza: "CREDITO", tipo: "PASIVO" },
        { codigo: "236505", nombre: "Retención en la Fuente", naturaleza: "CREDITO", tipo: "PASIVO" },
        { codigo: "236805", nombre: "Impuesto de Industria y Comercio Retenido", naturaleza: "CREDITO", tipo: "PASIVO" },
        { codigo: "240805", nombre: "IVA por Pagar", naturaleza: "CREDITO", tipo: "PASIVO" },
        { codigo: "250505", nombre: "Salarios por Pagar", naturaleza: "CREDITO", tipo: "PASIVO" },

        // --- PATRIMONIO (3) ---
        { codigo: "311505", nombre: "Aportes Sociales (Capital Cooperativo)", naturaleza: "CREDITO", tipo: "PATRIMONIO" },
        { codigo: "330505", nombre: "Reservas Obligatorias", naturaleza: "CREDITO", tipo: "PATRIMONIO" },
        { codigo: "360505", nombre: "Utilidad del Ejercicio", naturaleza: "CREDITO", tipo: "PATRIMONIO" },
        { codigo: "370505", nombre: "Resultados de Ejercicios Anteriores", naturaleza: "CREDITO", tipo: "PATRIMONIO" },

        // --- INGRESOS (4) ---
        { codigo: "414505", nombre: "Ingresos por Transporte de Carga", naturaleza: "CREDITO", tipo: "INGRESO" },
        { codigo: "414510", nombre: "Ingresos por Transporte Especial/Turismo", naturaleza: "CREDITO", tipo: "INGRESO" },
        { codigo: "415505", nombre: "Cuotas de Administración (Asociados)", naturaleza: "CREDITO", tipo: "INGRESO" },
        { codigo: "415510", nombre: "Ingresos por Multas y Sanciones", naturaleza: "CREDITO", tipo: "INGRESO" },
        { codigo: "415515", nombre: "Ingresos por Fondo de Reposición", naturaleza: "CREDITO", tipo: "INGRESO" },
        { codigo: "421005", nombre: "Ingresos Financieros (Intereses)", naturaleza: "CREDITO", tipo: "INGRESO" },
        { codigo: "429595", nombre: "Ingresos Diversos / Otros Ingresos", naturaleza: "CREDITO", tipo: "INGRESO" },

        // --- GASTOS (5) ---
        { codigo: "510506", nombre: "Sueldos y Salarios Administrativos", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "510530", nombre: "Cesantías y Prestaciones Sociales", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "511005", nombre: "Honorarios (Asesoría Contable/Legal)", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "512005", nombre: "Arrendamientos (Oficinas)", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "513505", nombre: "Servicios Públicos", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "513595", nombre: "Servicios de Software / SaaS", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "514005", nombre: "Gastos Legales / Notaría", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "519530", nombre: "Papelería y Útiles de Oficina", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "519540", nombre: "Gastos de Viaje / Casino", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "523505", nombre: "Gastos de Publicidad y Mercadeo", naturaleza: "DEBITO", tipo: "GASTO" },
        { codigo: "530505", nombre: "Gastos Bancarios (Comisiones)", naturaleza: "DEBITO", tipo: "GASTO" },

        // --- COSTOS DE OPERACIÓN (6) ---
        { codigo: "613505", nombre: "Combustibles y Lubricantes", naturaleza: "DEBITO", tipo: "COSTO" },
        { codigo: "613510", nombre: "Mantenimiento y Reparaciones Vehículos", naturaleza: "DEBITO", tipo: "COSTO" },
        { codigo: "613515", nombre: "Seguros Vehículos (SOAT/RC)", naturaleza: "DEBITO", tipo: "COSTO" },
        { codigo: "613520", nombre: "Llantas y Neumáticos", naturaleza: "DEBITO", tipo: "COSTO" },
        { codigo: "613530", nombre: "Gastos de Peajes y Parqueaderos", naturaleza: "DEBITO", tipo: "COSTO" },
        { codigo: "613595", nombre: "Otros Costos de Operación Transporte", naturaleza: "DEBITO", tipo: "COSTO" },
    ];

    for (const cuenta of cuentas) {
        await prisma.cuentaContable.upsert({
            where: { codigo: cuenta.codigo },
            update: {
                nombre: cuenta.nombre,
                naturaleza:
                    cuenta.naturaleza as import("@prisma/client").NaturalezaCuenta,
                tipo: cuenta.tipo as import("@prisma/client").TipoCuenta,
            },
            create: {
                codigo: cuenta.codigo,
                nombre: cuenta.nombre,
                naturaleza:
                    cuenta.naturaleza as import("@prisma/client").NaturalezaCuenta,
                tipo: cuenta.tipo as import("@prisma/client").TipoCuenta,
                permiteMovimiento: true,
                activa: true,
            },
        });
    }

    console.log("✅ Cuentas contables creadas.");

    // 2. Conceptos Financieros (Mapeo Negocio -> Contabilidad)
    const conceptos = [
        { nombre: "Cuota Administración", codigoCuenta: "415505", valorSugerido: 100000 },
        { nombre: "Aporte Social Mensual", codigoCuenta: "311505", valorSugerido: 50000 },
        { nombre: "Multas y Sanciones", codigoCuenta: "415510", valorSugerido: 200000 },
        { nombre: "Ingreso por Flete/Transporte", codigoCuenta: "414505", valorSugerido: 0 },
        { nombre: "Otros Ingresos Diversos", codigoCuenta: "429595", valorSugerido: 0 },
        
        { nombre: "Papelería y Útiles", codigoCuenta: "519530", valorSugerido: 0 },
        { nombre: "Mantenimiento Vehicular", codigoCuenta: "613510", valorSugerido: 150000 },
        { nombre: "Pago de Combustible", codigoCuenta: "613505", valorSugerido: 0 },
        { nombre: "Pago de Honorarios Prof.", codigoCuenta: "511005", valorSugerido: 0 },
        { nombre: "Servicios Públicos", codigoCuenta: "513505", valorSugerido: 0 },
        { nombre: "Gastos Bancarios", codigoCuenta: "530505", valorSugerido: 0 },
        { nombre: "Sueldos Administrativos", codigoCuenta: "510506", valorSugerido: 0 },
        { nombre: "Seguros y SOAT", codigoCuenta: "613515", valorSugerido: 0 },
        { nombre: "Peajes y Parqueaderos", codigoCuenta: "613530", valorSugerido: 0 },
    ];

    let idx = 0;
    for (const concepto of conceptos) {
        idx++;
        const cuenta = await prisma.cuentaContable.findUnique({
            where: { codigo: concepto.codigoCuenta },
        });

        if (cuenta) {
            await prisma.conceptoFinanciero.upsert({
                where: { id: `concepto-fin-${idx}` },
                update: {
                    valorPorDefecto: concepto.valorSugerido ?? 0,
                    cuentaId: cuenta.id,
                },
                create: {
                    id: `concepto-fin-${idx}`,
                    nombre: concepto.nombre,
                    cuentaId: cuenta.id,
                    valorPorDefecto: concepto.valorSugerido ?? 0,
                    activo: true,
                    tipo: cuenta.naturaleza === "DEBITO" ? "EGRESO" : "INGRESO",
                },
            });
        }
    }

    console.log("✅ Conceptos financieros creados.");

    // 3. Resoluciones Contables (Numeración Comprobantes)
    const resoluciones = [
        {
            tipo: "INGRESO",
            prefijo: "RC",
            numero: "2026-01",
            consecutivoDesde: 1,
            consecutivoHasta: 10000,
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31"),
        },
        {
            tipo: "EGRESO",
            prefijo: "CE",
            numero: "2026-02",
            consecutivoDesde: 1,
            consecutivoHasta: 10000,
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31"),
        },
        {
            tipo: "NOTA_CONTABLE",
            prefijo: "NC",
            numero: "2026-03",
            consecutivoDesde: 1,
            consecutivoHasta: 10000,
            fechaInicio: new Date("2026-01-01"),
            fechaFin: new Date("2026-12-31"),
        },
    ];

    for (const res of resoluciones) {
        await prisma.resolucionContable.upsert({
            where: { id: `res-${res.tipo.toLowerCase()}` }, // Stable ID for seeding
            update: {
                prefijo: res.prefijo,
                numero: res.numero,
                consecutivoHasta: res.consecutivoHasta,
                activa: true,
            },
            create: {
                id: `res-${res.tipo.toLowerCase()}`,
                tipo: res.tipo as import("@prisma/client").TipoTransaccion,
                prefijo: res.prefijo,
                numero: res.numero,
                consecutivoDesde: res.consecutivoDesde,
                consecutivoHasta: res.consecutivoHasta,
                actual: 0,
                fechaInicio: res.fechaInicio,
                fechaFin: res.fechaFin,
                activa: true,
            },
        });
    }

    console.log("✅ Resoluciones contables creadas.");
}
