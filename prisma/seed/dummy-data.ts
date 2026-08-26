import {
    PrismaClient,
    Rol,
    TipoDocumento,
    Modalidad,
    ClaseVehiculo,
    EstadoOperativo,
    EstadoAlerta,
    GravedadSiniestro,
    EstadoSiniestro,
    TipoNovedad,
    EstadoNovedad,
    FrecuenciaMantenimiento,
    EstadoOrdenServicio,
    TipoExamen,
    ConceptoMedico,
    EstadoPreoperacional,
    NivelCriticidad,
    NaturalezaCuenta,
    TipoCuenta,
    TipoTransaccion,
    TipoObligacion,
    EstadoObligacion,
    EstadoFUEC,
} from "@prisma/client";
import * as argon2 from "argon2";
import { Prisma } from "@prisma/client";

export async function seedDummyData(prisma: PrismaClient) {
    console.log("🧪 Sembrando banco de datos para pruebas...");

    const passwordHash = await argon2.hash("12345678");

    // 1. PROVEEDORES
    console.log("  🏢 Creando proveedores...");
    const proveedor1 = await prisma.proveedor.upsert({
        where: { numeroDocumento: "900123456-1" },
        update: {},
        create: {
            nombres: "AutoMundo S.A.S",
            numeroDocumento: "900123456-1",
            tipoDocumento: TipoDocumento.NIT,
            direccion: "Troncal de Occidente Km 2",
            celular: "3001234567",
            email: "ventas@automundo.com",
            activo: true,
        },
    });

    const proveedor2 = await prisma.proveedor.upsert({
        where: { numeroDocumento: "800987654-2" },
        update: {},
        create: {
            nombres: "TecnoDiesel Sucre",
            numeroDocumento: "800987654-2",
            tipoDocumento: TipoDocumento.NIT,
            direccion: "Calle 25 # 12-40",
            celular: "6052821122",
            email: "servicio@tecnodiesel.com",
            activo: true,
        },
    });

    // 2. USUARIOS (Roles diversos)
    console.log("  👥 Creando usuarios de prueba...");
    const owner1 = await prisma.usuario.upsert({
        where: { email: "propietario1@test.com" },
        update: {},
        create: {
            email: "propietario1@test.com",
            nombres: "Juan",
            apellidos: "Perez Prop",
            passwordHash,
            rol: Rol.PROPIETARIO,
            tipoDocumento: TipoDocumento.CC,
            numeroDocumento: "70111222",
            activo: true,
        },
    });

    const conductor1 = await prisma.usuario.upsert({
        where: { email: "conductor1@test.com" },
        update: {},
        create: {
            email: "conductor1@test.com",
            nombres: "Carlos",
            apellidos: "Mendoza Ch",
            passwordHash,
            rol: Rol.CONDUCTOR,
            tipoDocumento: TipoDocumento.CC,
            numeroDocumento: "1102333444",
            activo: true,
            numeroLicencia: "1102333444",
        },
    });

    const conductor2 = await prisma.usuario.upsert({
        where: { email: "conductor2@test.com" },
        update: {},
        create: {
            email: "conductor2@test.com",
            nombres: "Maria",
            apellidos: "Rodriguez",
            passwordHash,
            rol: Rol.CONDUCTOR,
            tipoDocumento: TipoDocumento.CC,
            numeroDocumento: "1103555666",
            activo: true,
            numeroLicencia: "1103555666",
        },
    });

    const secretaria1 = await prisma.usuario.upsert({
        where: { email: "secretaria1@test.com" },
        update: {},
        create: {
            email: "secretaria1@test.com",
            nombres: "Ana",
            apellidos: "Lopez Admin",
            passwordHash,
            rol: Rol.SECRETARIA,
            tipoDocumento: TipoDocumento.CC,
            numeroDocumento: "1104777888",
            activo: true,
        },
    });

    // 3. HOJA DE VIDA CONDUCTORES
    console.log("  📑 Configurando hojas de vida...");
    await prisma.hojaVida.upsert({
        where: { usuarioId: conductor1.id },
        update: {},
        create: {
            usuarioId: conductor1.id,
            rh: "O+",
            eps: "Sura",
            arl: "Positiva",
            fondoPensiones: "Porvenir",
            contactoEmergenciaNombre: "Lucia Mendoza",
            contactoEmergenciaTelefono: "3118889900",
            perfilProfesional:
                "Conductor con 10 años de experiencia en transporte intermunicipal.",
        },
    });

    // 4. VEHICULOS
    console.log("  🚗 Creando vehículos...");
    const vehiculo1 = await prisma.vehiculo.upsert({
        where: { placa: "ABC123" },
        update: {},
        create: {
            placa: "ABC123",
            marca: "Toyota",
            modelo: "Hiace",
            anho: 2022,
            color: "Blanco",
            clase: ClaseVehiculo.MICROBUS,
            modalidad: Modalidad.FLOTA_PROPIA, // Cambiado de ESCOLAR
            capacidadPuestos: 16,
            kilometrajeActual: 45000,
            estadoOperativo: EstadoOperativo.OPERATIVO,
            propietarioId: owner1.id,
        },
    });

    const vehiculo2 = await prisma.vehiculo.upsert({
        where: { placa: "XYZ789" },
        update: {},
        create: {
            placa: "XYZ789",
            marca: "Nissan",
            modelo: "Urvan",
            anho: 2023,
            color: "Gris",
            clase: ClaseVehiculo.MICROBUS,
            modalidad: Modalidad.FLOTA_PROPIA, // Cambiado de TURISMO
            capacidadPuestos: 14,
            kilometrajeActual: 12000,
            estadoOperativo: EstadoOperativo.OPERATIVO,
            propietarioId: owner1.id,
        },
    });

    // 5. VINCULACIONES
    console.log("  🔗 Vinculando conductores...");
    await prisma.vinculacion.create({
        data: {
            conductorId: conductor1.id,
            vehiculoId: vehiculo1.id,
            fechaInicio: new Date("2025-01-01"),
            activo: true,
        },
    });

    await prisma.vinculacion.create({
        data: {
            conductorId: conductor2.id,
            vehiculoId: vehiculo2.id,
            fechaInicio: new Date("2025-02-15"),
            activo: true,
        },
    });

    // 6. DOCUMENTACION VEHICULO
    console.log("  📄 Agregando documentos de vehículos...");
    await prisma.documentoVehiculo.createMany({
        data: [
            {
                vehiculoId: vehiculo1.id,
                tipo: "SOAT",
                fechaVencimiento: new Date("2027-05-20"),
                estadoAlerta: EstadoAlerta.OK,
            },
            {
                vehiculoId: vehiculo1.id,
                tipo: "TECNOMECANICA",
                fechaVencimiento: new Date("2026-08-15"),
                estadoAlerta: EstadoAlerta.OK,
            },
            {
                vehiculoId: vehiculo2.id,
                tipo: "SOAT",
                fechaVencimiento: new Date("2026-03-01"),
                estadoAlerta: EstadoAlerta.POR_VENCER, // Cambiado de ADVERTENCIA
            },
        ],
    });

    // 7. MANTENIMIENTOS
    console.log("  🔧 Configurando planes de mantenimiento...");
    const planMantenimiento = await prisma.planMantenimiento.create({
        data: {
            nombre: "Preventivo Cada 5000 KM",
            descripcion: "Cambio de aceite, filtros y revisión de frenos",
            frecuencia: FrecuenciaMantenimiento.KILOMETROS,
            kmIntervalo: 5000,
        },
    });

    await prisma.ordenServicio.create({
        data: {
            codigo: "OS-0001",
            vehiculoId: vehiculo1.id,
            planId: planMantenimiento.id,
            estado: EstadoOrdenServicio.COMPLETADA,
            kilometrajeReportado: 40000,
            costoReportado: 350000,
            fechaCreacion: new Date("2026-01-10"),
            fechaVencimiento: new Date("2026-01-15"),
        },
    });

    // 8. PREOPERACIONALES
    console.log("  📋 Registrando preoperacionales...");
    await prisma.preoperacional.create({
        data: {
            vehiculoId: vehiculo1.id,
            conductorId: conductor1.id,
            kilometraje: 45000,
            resultado: EstadoPreoperacional.APROBADO,
            observaciones: "Vehículo en perfectas condiciones.",
            fecha: new Date(),
            detalles: {
                createMany: {
                    data: [
                        {
                            item: "Frenos",
                            estado: true,
                            criticidad: NivelCriticidad.ALTA,
                        },
                        {
                            item: "Luces",
                            estado: true,
                            criticidad: NivelCriticidad.MEDIA,
                        },
                        {
                            item: "Llantas",
                            estado: true,
                            criticidad: NivelCriticidad.ALTA,
                        },
                    ],
                },
            },
        },
    });

    // 9. NOVEDADES Y SINIESTROS
    console.log("  ⚠️ Registrando novedades y siniestros...");
    await prisma.novedad.create({
        data: {
            tipo: TipoNovedad.OTRO, // Cambiado de REPARACION_MENOR
            descripcion: "Cambio de bombillo delantero derecho",
            fecha: new Date(),
            estado: EstadoNovedad.RESUELTO, // Cambiado de COMPLETADA
            vehiculoId: vehiculo1.id,
            monto: 15000,
        },
    });

    await prisma.siniestro.create({
        data: {
            fecha: new Date("2026-02-10"),
            lugar: "Carrera 4 con Calle 20, Sincelejo",
            reporteHechos: "Choque simple por alcance contra moto.",
            gravedad: GravedadSiniestro.SOLO_DANOS,
            estado: EstadoSiniestro.EN_PROCESO,
            conductorId: conductor1.id,
            vehiculoId: vehiculo1.id,
        },
    });

    // 10. FINANZAS (Obligaciones y Transacciones)
    console.log("  💰 Generando movimientos financieros...");

    // Buscar cuentas contables necesarias
    const cuentaCaja = await prisma.cuentaContable.findFirst({
        where: { codigo: "110505" },
    });
    const cuentaIngresos = await prisma.cuentaContable.findFirst({
        where: { codigo: "415505" },
    });
    const cuentaGastos = await prisma.cuentaContable.findFirst({
        where: { codigo: "514540" },
    });

    if (cuentaCaja && cuentaIngresos && cuentaGastos) {
        // Obligación (Cuota de Administración)
        await prisma.obligacionFinanciera.create({
            data: {
                usuarioId: owner1.id,
                vehiculoId: vehiculo1.id,
                tipo: TipoObligacion.CUOTA_ADMINISTRACION,
                periodo: new Date("2026-03-01"),
                fechaVence: new Date("2026-03-05"),
                montoInicial: new Prisma.Decimal(85000),
                saldoPendiente: new Prisma.Decimal(85000),
                estado: EstadoObligacion.PENDIENTE,
            },
        });

        // Transacción de Ingreso (Pago de cuota anterior)
        await prisma.transaccion.create({
            data: {
                descripcion: "Pago Cuota Administración Febrero - ABC123",
                tipo: TipoTransaccion.INGRESO,
                creadoPorId: secretaria1.id,
                terceroId: owner1.id,
                numeroComprobante: "RC-2026-001",
                asientos: {
                    create: [
                        {
                            cuentaId: cuentaCaja.id,
                            debito: new Prisma.Decimal(85000),
                            credito: new Prisma.Decimal(0),
                        },
                        {
                            cuentaId: cuentaIngresos.id,
                            debito: new Prisma.Decimal(0),
                            credito: new Prisma.Decimal(85000),
                        },
                    ],
                },
            },
        });

        // Transacción de Egreso (Gasto papelería)
        await prisma.transaccion.create({
            data: {
                descripcion: "Compra papelería oficina central",
                tipo: TipoTransaccion.EGRESO,
                creadoPorId: secretaria1.id,
                numeroComprobante: "CE-2026-001",
                asientos: {
                    create: [
                        {
                            cuentaId: cuentaGastos.id,
                            debito: new Prisma.Decimal(45000),
                            credito: new Prisma.Decimal(0),
                        },
                        {
                            cuentaId: cuentaCaja.id,
                            debito: new Prisma.Decimal(0),
                            credito: new Prisma.Decimal(45000),
                        },
                    ],
                },
            },
        });
    }

    // 11. FUEC
    console.log("  📑 Generando planillas FUEC de prueba...");
    const contrato = await prisma.contratoEmpresa.findFirst();
    const resolucion = await prisma.resolucionFUEC.findFirst();

    if (contrato && resolucion) {
        await prisma.planillaFUEC.create({
            data: {
                consecutivo:
                    "223004118" +
                    String(resolucion.actual + 1).padStart(4, "0") +
                    "0001" +
                    String(contrato.consecutivoNumerico).padStart(4, "0"),
                numeroFUEC: resolucion.actual + 1,
                numeroExtracto: 1,
                contratoId: contrato.id,
                vehiculoId: vehiculo1.id,
                resolucionId: resolucion.id,
                conductor1Id: conductor1.id,
                ruta: [
                    { origen: "Sincelejo", destino: "Tolú" },
                    { origen: "Tolú", destino: "Sincelejo" },
                ],
                objetoViaje: "Transporte especial de personal",
                fechaInicio: new Date(),
                fechaFin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días después
                tokenQR:
                    "TEST-QR-" +
                    Math.random().toString(36).substring(7).toUpperCase(),
                estado: EstadoFUEC.ACTIVO,
                pagoValor: new Prisma.Decimal(12000),
            },
        });

        await prisma.resolucionFUEC.update({
            where: { id: resolucion.id },
            data: { actual: resolucion.actual + 1 },
        });
    }

    console.log("✅ Banco de datos para pruebas completado.");
}
