import {
    PrismaClient,
    NaturalezaCuenta,
    TipoCuenta,
    TipoTransaccion,
} from "@prisma/client";

export async function seedPuc(prisma: PrismaClient) {
    console.log("🌱 Sembrando PUC Colombiano (Transporte)...");

    const cuentas = [
        // 1. ACTIVOS
        {
            codigo: "1",
            nombre: "ACTIVO",
            nivel: 1,
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "11",
            nombre: "DISPONIBLE",
            nivel: 2,
            padre: "1",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "1105",
            nombre: "CAJA",
            nivel: 4,
            padre: "11",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "110505",
            nombre: "Caja General",
            nivel: 6,
            padre: "1105",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "1110",
            nombre: "BANCOS",
            nivel: 4,
            padre: "11",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "111005",
            nombre: "Bancos Nacionales",
            nivel: 6,
            padre: "1110",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },

        {
            codigo: "13",
            nombre: "DEUDORES",
            nivel: 2,
            padre: "1",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "1305",
            nombre: "CLIENTES",
            nivel: 4,
            padre: "13",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "130505",
            nombre: "Cuentas por Cobrar Clientes",
            nivel: 6,
            padre: "1305",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "130510",
            nombre: "Cuentas por Cobrar Planillas FUEC",
            nivel: 6,
            padre: "1305",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "1365",
            nombre: "CUENTAS POR COBRAR A TRABAJADORES",
            nivel: 4,
            padre: "13",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "136530",
            nombre: "Préstamos y Anticipos",
            nivel: 6,
            padre: "1365",
            tipo: TipoCuenta.ACTIVO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },

        // 2. PASIVOS
        {
            codigo: "2",
            nombre: "PASIVO",
            nivel: 1,
            tipo: TipoCuenta.PASIVO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "23",
            nombre: "CUENTAS POR PAGAR",
            nivel: 2,
            padre: "2",
            tipo: TipoCuenta.PASIVO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "2335",
            nombre: "COSTOS Y GASTOS POR PAGAR",
            nivel: 4,
            padre: "23",
            tipo: TipoCuenta.PASIVO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "233595",
            nombre: "Otros Costos y Gastos",
            nivel: 6,
            padre: "2335",
            tipo: TipoCuenta.PASIVO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },

        // 3. PATRIMONIO
        { codigo: "3", nombre: "PATRIMONIO", nivel: 1, tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        { codigo: "31", nombre: "CAPITAL SOCIAL", nivel: 2, padre: "3", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        { codigo: "3115", nombre: "APORTES SOCIALES", nivel: 4, padre: "31", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        { codigo: "311505", nombre: "Aportes Ordinarios (Cooperativos)", nivel: 6, padre: "3115", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        
        { codigo: "33", nombre: "RESERVAS", nivel: 2, padre: "3", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        { codigo: "3305", nombre: "RESERVAS OBLIGATORIAS", nivel: 4, padre: "33", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        { codigo: "330505", nombre: "Reserva Legal", nivel: 6, padre: "3305", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        
        { codigo: "36", nombre: "RESULTADOS DEL EJERCICIO", nivel: 2, padre: "3", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        { codigo: "3605", nombre: "UTILIDAD DEL EJERCICIO", nivel: 4, padre: "36", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },
        { codigo: "360505", nombre: "Utilidad NETA", nivel: 6, padre: "3605", tipo: TipoCuenta.PATRIMONIO, naturaleza: NaturalezaCuenta.CREDITO },

        // 4. INGRESOS
        {
            codigo: "4",
            nombre: "INGRESOS",
            nivel: 1,
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "41",
            nombre: "OPERACIONALES",
            nivel: 2,
            padre: "4",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "4155",
            nombre: "ACTIVIDADES DE TRANSPORTE",
            nivel: 4,
            padre: "41",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "415505",
            nombre: "Ingresos Actividades Transporte",
            nivel: 6,
            padre: "4155",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "415510",
            nombre: "Ingresos por Servicios de Transporte FUEC",
            nivel: 6,
            padre: "4155",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "42",
            nombre: "NO OPERACIONALES",
            nivel: 2,
            padre: "4",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "4210",
            nombre: "FINANCIEROS",
            nivel: 4,
            padre: "42",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "421005",
            nombre: "Intereses",
            nivel: 6,
            padre: "4210",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "4295",
            nombre: "DIVERSOS",
            nivel: 4,
            padre: "42",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },
        {
            codigo: "429505",
            nombre: "Multas y Sanciones",
            nivel: 6,
            padre: "4295",
            tipo: TipoCuenta.INGRESO,
            naturaleza: NaturalezaCuenta.CREDITO,
        },

        // 5. GASTOS
        {
            codigo: "5",
            nombre: "GASTOS",
            nivel: 1,
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "51",
            nombre: "OPERACIONALES DE ADMINISTRACION",
            nivel: 2,
            padre: "5",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "5105",
            nombre: "GASTOS DE PERSONAL",
            nivel: 4,
            padre: "51",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "510506",
            nombre: "Sueldos",
            nivel: 6,
            padre: "5105",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "5135",
            nombre: "SERVICIOS",
            nivel: 4,
            padre: "51",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "513525",
            nombre: "Acueducto y Alcantarillado",
            nivel: 6,
            padre: "5135",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "513530",
            nombre: "Energia Electrica",
            nivel: 6,
            padre: "5135",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "513535",
            nombre: "Telefono",
            nivel: 6,
            padre: "5135",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "513540",
            nombre: "Correo, Portes y Telegramas",
            nivel: 6,
            padre: "5135",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "5145",
            nombre: "MANTENIMIENTO Y REPARACIONES",
            nivel: 4,
            padre: "51",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "514510",
            nombre: "Construcciones y Edificaciones",
            nivel: 6,
            padre: "5145",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "514540",
            nombre: "Flota y Equipo de Transporte",
            nivel: 6,
            padre: "5145",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "5195",
            nombre: "DIVERSOS",
            nivel: 4,
            padre: "51",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "519530",
            nombre: "Utiles, Papeleria y Fotocopias",
            nivel: 6,
            padre: "5195",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "519535",
            nombre: "Combustibles y Lubricantes",
            nivel: 6,
            padre: "5195",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "53",
            nombre: "NO OPERACIONALES",
            nivel: 2,
            padre: "5",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "5305",
            nombre: "FINANCIEROS",
            nivel: 4,
            padre: "53",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
        {
            codigo: "530515",
            nombre: "Comisiones",
            nivel: 6,
            padre: "5305",
            tipo: TipoCuenta.GASTO,
            naturaleza: NaturalezaCuenta.DEBITO,
        },
    ];

    // Insertar en orden de nivel para respetar FKs
    for (const c of cuentas) {
        // Buscar padre si aplica
        let padreId = null;
        if (c.padre) {
            const padre = await prisma.cuentaContable.findUnique({
                where: { codigo: c.padre },
            });
            padreId = padre?.id;
        }

        await prisma.cuentaContable.upsert({
            where: { codigo: c.codigo },
            update: {
                nombre: c.nombre,
                padreId: padreId ? String(padreId) : null,
            },
            create: {
                codigo: c.codigo,
                nombre: c.nombre,
                naturaleza: c.naturaleza,
                tipo: c.tipo,
                nivel: c.nivel,
                padreId: padreId,
                permiteMovimiento: c.nivel >= 6, // Solo subcuentas permiten movimientos directos
            },
        });
    }

    console.log("✅ PUC Sincronizado.");
}

export async function seedConceptos(prisma: PrismaClient) {
    console.log("🌱 Sembrando Conceptos Financieros...");

    // Mapeo sugerido de conceptos
    const conceptos = [
        // ===== EGRESOS DE CAJA MENOR =====
        // Papelería y Suministros
        {
            nombre: "Papelería y Útiles",
            cuenta: "519530",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Fotocopias e Impresiones",
            cuenta: "519530",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },
        {
            nombre: "Tóner y Cartuchos",
            cuenta: "519530",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },

        // Servicios Públicos
        {
            nombre: "Servicio de Energía",
            cuenta: "513530",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Servicio de Agua",
            cuenta: "513525",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Servicio de Teléfono",
            cuenta: "513535",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Internet y Comunicaciones",
            cuenta: "513535",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },

        // Mantenimiento
        {
            nombre: "Mantenimiento Vehicular",
            cuenta: "514540",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Mantenimiento de Oficina",
            cuenta: "514510",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Reparaciones Menores",
            cuenta: "514510",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },

        // Combustibles y Operación
        {
            nombre: "Combustible",
            cuenta: "519535",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Lubricantes",
            cuenta: "519535",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },

        // Personal
        {
            nombre: "Sueldos Personal",
            cuenta: "510506",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },
        {
            nombre: "Préstamo a Empleado",
            cuenta: "136530",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: true,
        },

        // Gastos Diversos de Caja Menor
        {
            nombre: "Transporte y Viáticos",
            cuenta: "5195",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },
        {
            nombre: "Refrigerios y Cafetería",
            cuenta: "5195",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },
        {
            nombre: "Aseo y Cafetería",
            cuenta: "5195",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },
        {
            nombre: "Elementos de Aseo",
            cuenta: "5195",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },
        {
            nombre: "Gastos Menores de Oficina",
            cuenta: "5195",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },
        {
            nombre: "Correo y Mensajería",
            cuenta: "513540",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },

        // Gastos Financieros
        {
            nombre: "Comisiones Bancarias",
            cuenta: "530515",
            tipo: TipoTransaccion.EGRESO,
            requiereTercero: false,
        },

        // ===== INGRESOS =====
        {
            nombre: "Recaudo Cuota Administración",
            cuenta: "415505",
            tipo: TipoTransaccion.INGRESO,
            valor: 80000,
        },
        {
            nombre: "Multa por Retraso",
            cuenta: "429505",
            tipo: TipoTransaccion.INGRESO,
            valor: 25000,
        },
        {
            nombre: "Otros Ingresos",
            cuenta: "429505",
            tipo: TipoTransaccion.INGRESO,
            requiereTercero: false,
        },
    ];

    for (const cp of conceptos) {
        const cuenta = await prisma.cuentaContable.findUnique({
            where: { codigo: cp.cuenta },
        });

        if (cuenta) {
            // Verificar si existe por nombre para no duplicar
            const existe = await prisma.conceptoFinanciero.findFirst({
                where: { nombre: cp.nombre },
            });

            if (!existe) {
                await prisma.conceptoFinanciero.create({
                    data: {
                        nombre: cp.nombre,
                        tipo: cp.tipo,
                        cuentaId: cuenta.id,
                        requiereTercero: cp.requiereTercero || false,
                        valorPorDefecto: cp.valor ? cp.valor : null,
                    },
                });
            }
        }
    }
    console.log("✅ Conceptos Sincronizados.");
}

export async function seedReglas(prisma: PrismaClient) {
    console.log("🌱 Sembrando Reglas Contables...");

    // Reglas de integración
    const reglas = [
        {
            evento: "ORDEN_SERVICIO_CERRADA",
            descripcion: "Cierre de Orden de Mantenimiento",
            cuentaDebito: "514540", // Gasto Mantenimiento
            cuentaCredito: "110505", // Caja General (Sale el dinero)
        },
    ];

    for (const r of reglas) {
        const db = await prisma.cuentaContable.findUnique({
            where: { codigo: r.cuentaDebito },
        });
        const cr = await prisma.cuentaContable.findUnique({
            where: { codigo: r.cuentaCredito },
        });

        if (db && cr) {
            await prisma.reglaContable.upsert({
                where: { evento: r.evento },
                update: {
                    cuentaDebitoId: db.id,
                    cuentaCreditoId: cr.id,
                },
                create: {
                    evento: r.evento,
                    descripcion: r.descripcion,
                    cuentaDebitoId: db.id,
                    cuentaCreditoId: cr.id,
                },
            });
        }
    }
    console.log("✅ Reglas Sincronizadas.");
}
