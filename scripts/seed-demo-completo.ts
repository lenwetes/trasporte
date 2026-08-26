import { prisma } from "../src/lib/prisma";
import { hash } from "argon2";
import {
    Usuario,
    Vehiculo,
    TipoDocumento,
    Rol,
    Modalidad,
    ClaseVehiculo,
    TipoExamen,
    ConceptoMedico,
    EstadoPreoperacional,
    NivelCriticidad,
    TipoNovedad,
    GravedadSiniestro,
    FrecuenciaMantenimiento,
    EstadoOperativo,
    EstadoAlerta,
} from "@prisma/client";

async function main() {
    console.log(
        "🚀 Iniciando generación del BANCO DE PRUEBAS DEMO COMPLETO...",
    );

    const passwordHash = await hash("coopetraes123");

    // Nombres Colombianos Auténticos x 35
    const nombres = [
        "Juan Camilo",
        "Carlos Alberto",
        "Luis Eduardo",
        "Jorge Eliécer",
        "Andrés Felipe",
        "Diego Armando",
        "Mateo Alejandro",
        "Santiago José",
        "Gabriel Jaime",
        "Samuel Enrique",
        "Sebastián Ricardo",
        "Alejandro David",
        "Nicolás Andrés",
        "Daniel Fernando",
        "David Leonardo",
        "José Manuel",
        "Felipe Alberto",
        "Ricardo León",
        "Eduardo Arturo",
        "Manuel Salvador",
        "Gustavo Adolfo",
        "Óscar Tulio",
        "Rodrigo Hernán",
        "Jaime Orlando",
        "Humberto Alfonso",
        "Wilson Javier",
        "Iván Ramiro",
        "Alexander Germán",
        "Christian Raúl",
        "Leonardo Fabio",
        "Mauricio Fabio",
        "Edgar Omar",
        "Nelson Albeiro",
        "Víctor Hugo",
        "Hernando Abel",
    ];

    const apellidos = [
        "Rodríguez",
        "Martínez",
        "Gómez",
        "López",
        "González",
        "Hernández",
        "Pérez",
        "Sánchez",
        "Ramírez",
        "Torres",
        "Velásquez",
        "Castro",
        "Rojas",
        "Moreno",
        "Jiménez",
        "Gutiérrez",
        "Álvarez",
        "Mendoza",
        "Morales",
        "Ortiz",
        "Ruiz",
        "Silva",
        "Vargas",
        "Suárez",
        "Salazar",
        "García",
        "Marín",
        "Espinoza",
        "Parra",
        "Herrera",
        "Medina",
        "Cortés",
        "Aguilar",
        "Navarro",
        "Muñoz",
    ];

    // --- 1. CONDUCTORES (35) ---
    const conductores: Usuario[] = [];
    for (let i = 0; i < 35; i++) {
        const cedula = (1000000000 + i * 543210).toString();
        const email = `conductor${i + 1}@coopetraes.co`;

        const user = await prisma.usuario.upsert({
            where: { email },
            update: {
                activo: true,
                rol: Rol.CONDUCTOR,
            },
            create: {
                nombres: nombres[i],
                apellidos: `${apellidos[i]} ${apellidos[(i + i) % apellidos.length]}`,
                email,
                numeroDocumento: cedula,
                tipoDocumento: TipoDocumento.CC,
                passwordHash,
                rol: Rol.CONDUCTOR,
                telefono: `31${Math.floor(10000000 + Math.random() * 90000000)}`,
                direccion: `Carrera ${i + 5} #20-${i + 15}, Sincelejo`,
                municipio: "Sincelejo",
                numeroLicencia: cedula,
                licencias: {
                    create: [
                        {
                            categoria: i % 2 === 0 ? "C2" : "C3",
                            servicio: "PUBLICO",
                            fechaVencimiento: new Date("2027-12-31"),
                            activo: true,
                        },
                    ],
                },
                hojaVida: {
                    create: {
                        rh:
                            i % 4 === 0
                                ? "O+"
                                : i % 4 === 1
                                  ? "O-"
                                  : i % 4 === 2
                                    ? "A+"
                                    : "B+",
                        eps:
                            i % 3 === 0
                                ? "Salud Total"
                                : i % 3 === 1
                                  ? "Sura"
                                  : "Compensar",
                        arl: "AXA Colpatria",
                        fondoPensiones: "Porvenir",
                        perfilProfesional:
                            "Conductor con amplia experiencia en rutas nacionales y transporte especial.",
                        contactoEmergenciaNombre: "Familiar de " + nombres[i],
                        contactoEmergenciaTelefono: "3200000000",
                    },
                },
            },
        });
        conductores.push(user);

        // Limpiar registros antiguos para asegurar demo fresca
        await prisma.examenMedico.deleteMany({
            where: { conductorId: user.id },
        });
        await prisma.entregaDotacion.deleteMany({
            where: { conductorId: user.id },
        });
        await prisma.certificado.deleteMany({ where: { usuarioId: user.id } });

        // Crear Exámenes Médicos (Uno vigente, uno vencido para histórico)
        await prisma.examenMedico.createMany({
            data: [
                {
                    conductorId: user.id,
                    tipo: TipoExamen.INGRESO,
                    fechaRealizacion: new Date("2024-05-20"),
                    fechaVencimiento: new Date("2025-05-20"),
                    entidadMedica: "Salud Laboral IPS",
                    concepto: ConceptoMedico.APTO,
                },
                {
                    conductorId: user.id,
                    tipo: TipoExamen.PERIODICO,
                    fechaRealizacion: new Date("2025-06-15"),
                    fechaVencimiento: new Date("2027-06-15"), // VIGENTE en 2026
                    entidadMedica: "Salud Laboral IPS",
                    concepto: ConceptoMedico.APTO,
                },
            ],
        });

        // Crear Certificados
        if (i % 3 === 0) {
            await prisma.certificado.createMany({
                data: [
                    {
                        usuarioId: user.id,
                        nombre: "Curso Virtual 50 Horas SG-SST",
                        institucion: "SENA",
                        categoria: "SST",
                        fechaEmision: new Date("2024-01-10"),
                    },
                    {
                        usuarioId: user.id,
                        nombre: "Manejo Defensivo y Seguridad Vial",
                        institucion: "Cevial",
                        categoria: "SEGURIDAD_VIAL",
                        fechaEmision: new Date("2024-02-15"),
                    },
                ],
            });
        }

        // Crear Entregas de Dotación
        await prisma.entregaDotacion.create({
            data: {
                conductorId: user.id,
                fechaEntrega: new Date(),
                items: [
                    {
                        item: "Botas de Seguridad",
                        cantidad: 1,
                        talla: "40",
                        estado: "NUEVO",
                    },
                    {
                        item: "Uniforme Corporativo",
                        cantidad: 2,
                        talla: "M",
                        estado: "NUEVO",
                    },
                    {
                        item: "Chaleco Reflectivo",
                        cantidad: 1,
                        talla: "UNICA",
                        estado: "NUEVO",
                    },
                ],
                observaciones: "Entrega inicial de dotación para demo.",
            },
        });
    }
    console.log(`✅ 35 Conductores creados con perfiles completos.`);

    // --- 2. VEHÍCULOS (35) - Publico y Especial ---
    const vehiculos: Vehiculo[] = [];
    const marcasRef = [
        { m: "Chevrolet", mod: "N300", c: ClaseVehiculo.MICROBUS, cap: 8 },
        { m: "Renault", mod: "Master", c: ClaseVehiculo.BUSETA, cap: 19 },
        { m: "Nissan", mod: "Urvan", c: ClaseVehiculo.MICROBUS, cap: 12 },
        { m: "Toyota", mod: "Hiace", c: ClaseVehiculo.MICROBUS, cap: 12 },
        {
            m: "Mercedes-Benz",
            mod: "Sprinter",
            c: ClaseVehiculo.BUSETA,
            cap: 23,
        },
        { m: "Foton", mod: "View", c: ClaseVehiculo.MICROBUS, cap: 12 }, // ClaseVehiculo.MICROBUS if available, but let's check exact enum
        { m: "Volkswagen", mod: "Crafter", c: ClaseVehiculo.BUSETA, cap: 20 },
        { m: "Hino", mod: "Dutro", c: ClaseVehiculo.BUSETA, cap: 2 },
        { m: "Jac", mod: "Sunray", c: ClaseVehiculo.BUSETA, cap: 18 },
        { m: "Hyundai", mod: "H1", c: ClaseVehiculo.MICROBUS, cap: 12 },
    ];

    // Clases válidas del enum ClaseVehiculo (según lo visto en schema o inferred)
    // BUS, BUSETA, MICROBUS, CAMIONETA, CAMION, OTRO, SEDAN...
    // Let's use common ones

    for (let i = 0; i < 35; i++) {
        const ref = marcasRef[i % marcasRef.length];
        const placa = `SPQ${String(i + 200).padStart(3, "0")}`;

        // Simular estados operativos variados
        let estadoOp: EstadoOperativo = EstadoOperativo.OPERATIVO;
        if (i % 10 === 0) estadoOp = EstadoOperativo.BLOQUEADO_ADMIN;
        if (i % 15 === 0) estadoOp = EstadoOperativo.NO_OPERATIVO;
        if (i % 20 === 0) estadoOp = EstadoOperativo.EVALUANDO;

        const vehiculo = await prisma.vehiculo.upsert({
            where: { placa },
            update: {
                estadoOperativo: estadoOp,
                activo: true,
            },
            create: {
                placa,
                marca: ref.m,
                modelo: ref.mod,
                anho: 2017 + (i % 7),
                color:
                    i % 3 === 0
                        ? "Blanco"
                        : i % 3 === 1
                          ? "Plata"
                          : "Gris Metalizado",
                clase: ref.c,
                modalidad:
                    i % 5 === 0
                        ? Modalidad.CONVENIO_EXTERNO
                        : Modalidad.FLOTA_PROPIA,
                capacidadPuestos: ref.cap,
                propietario:
                    i % 4 === 0 ? "COOPETRAES" : `Propietario ${i + 1}`,
                kilometrajeActual: 10000 + i * 5000,
                estadoOperativo: estadoOp,
                estadoAlertas:
                    i % 8 === 0
                        ? EstadoAlerta.VENCIDO
                        : i % 12 === 0
                          ? EstadoAlerta.POR_VENCER
                          : EstadoAlerta.OK,
                activo: true,
                hojaVida: {
                    create: {
                        observaciones:
                            "Vehículo en perfecto estado para servicio especial.",
                    },
                },
            },
        });
        vehiculos.push(vehiculo);
    }
    console.log(`✅ 35 Vehículos creados con estados mixtos.`);

    // --- 3. VINCULACIONES ---
    for (let i = 0; i < 35; i++) {
        await prisma.vinculacion.deleteMany({
            where: {
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
            },
        });
        await prisma.vinculacion.create({
            data: {
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
                activo: true,
            },
        });
    }

    // --- 4. DOCUMENTACIÓN (SOAT, TECNO, TO) ---
    for (let i = 0; i < 35; i++) {
        const v = vehiculos[i];
        const docs = [
            { t: "SOAT", d: i % 7 === 0 ? -2 : 45 }, // Algunos vencidos
            { t: "TECNOMECANICA", d: i % 9 === 0 ? 3 : 180 },
            { t: "TARJETA_OPERACION", d: i % 11 === 0 ? -15 : 90 },
            { t: "POLIZA_CONTRACTUAL", d: 120 },
            { t: "POLIZA_EXTRACONTRACTUAL", d: 120 },
        ];

        for (const d of docs) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + d.d);
            await prisma.documentoVehiculo.create({
                data: {
                    vehiculoId: v.id,
                    tipo: d.t,
                    fechaVencimiento: fecha,
                    estadoAlerta:
                        d.d < 0
                            ? EstadoAlerta.VENCIDO
                            : d.d < 30
                              ? EstadoAlerta.POR_VENCER
                              : EstadoAlerta.OK,
                },
            });
        }
    }
    console.log(`✅ Documentación generada con alertas de vencimiento.`);

    // --- 5. PREOPERACIONALES (Operativos y Bloqueos) ---
    const itemsPreop = [
        "Frenos",
        "Llantas",
        "Luces",
        "Nivel de Aceite",
        "Espejos",
        "Dirección",
        "Documentos",
    ];
    for (let i = 0; i < 35; i++) {
        // Crear histórico de preoperacionales (3 días por vehículo)
        for (let j = 0; j < 3; j++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - j);

            // Simular un preoperacional fallido el primer día para algunos
            const fallar = i % 12 === 0 && j === 0;

            await prisma.preoperacional.create({
                data: {
                    conductorId: conductores[i].id,
                    vehiculoId: vehiculos[i].id,
                    fecha: fecha,
                    kilometraje:
                        (vehiculos[i].kilometrajeActual || 10000) - j * 100,
                    resultado: fallar
                        ? EstadoPreoperacional.RECHAZADO
                        : EstadoPreoperacional.APROBADO,
                    detalles: {
                        create: itemsPreop.map((item) => ({
                            item,
                            estado: fallar && item === "Frenos" ? false : true,
                            criticidad:
                                item === "Frenos"
                                    ? NivelCriticidad.ALTA
                                    : NivelCriticidad.MEDIA,
                            observacion:
                                fallar && item === "Frenos"
                                    ? "Fuga de líquido de frenos detectada"
                                    : "Ok",
                        })),
                    },
                },
            });
        }
    }
    console.log(`✅ 105 Registros preoperacionales generados.`);

    // --- 6. FINANZAS / OBLIGACIONES ---
    const configuracion = await prisma.configuracionGlobal.findFirst();
    const cuotaV = Number(configuracion?.montoCuotaAdministracion || 80000);

    for (let i = 0; i < 35; i++) {
        // Generar Cuotas de Admin para los últimos 3 meses
        for (let m = 0; m < 3; m++) {
            const fecha = new Date();
            fecha.setMonth(fecha.getMonth() - m);
            fecha.setDate(1);

            const pagado = i % 5 !== 0 || m > 0; // No pagó el último mes el 1 de cada 5 conductores

            await prisma.obligacionFinanciera.create({
                data: {
                    usuarioId: conductores[i].id,
                    vehiculoId: vehiculos[i].id,
                    tipo: "CUOTA_ADMINISTRACION",
                    periodo: fecha,
                    fechaVence: new Date(
                        fecha.getFullYear(),
                        fecha.getMonth(),
                        28,
                    ), // Vence al final
                    montoInicial: cuotaV,
                    saldoPendiente: pagado ? 0 : cuotaV,
                    estado: pagado ? "PAGADO" : "PENDIENTE",
                },
            });
        }
    }
    console.log(`✅ Historial financiero (cuotas) generado.`);

    // --- 7. NOVEDADES Y SINIESTROS ---
    for (let i = 0; i < 15; i++) {
        await prisma.novedad.create({
            data: {
                tipo:
                    i % 3 === 0
                        ? TipoNovedad.MULTA
                        : i % 3 === 1
                          ? TipoNovedad.CONDUCTA
                          : TipoNovedad.FALLA_MECANICA,
                descripcion:
                    i % 3 === 0
                        ? "Infracción C02: Estacionar en sitios prohibidos"
                        : "Queja de usuario por mal trato",
                fecha: new Date(),
                monto: i % 3 === 0 ? 580000 : 0,
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
                estado: "PENDIENTE",
            },
        });
    }

    // Un par de siniestros para ver el módulo
    await prisma.siniestro.create({
        data: {
            fecha: new Date(),
            lugar: "Cruce Calle 23 con Carrera 15, Sincelejo",
            reporteHechos: "Colisión lateral con motocicleta en intersección.",
            gravedad: GravedadSiniestro.CON_HERIDOS,
            conductorId: conductores[0].id,
            vehiculoId: vehiculos[0].id,
            investigacion: {
                create: {
                    analisisCausas: "No respetar la señal de Pare.",
                    planAccion:
                        "Re-inducción en normas de tránsito y seguridad vial.",
                    conclusiones: "Conductor con responsabilidad compartida.",
                    diasPerdidos: 5,
                },
            },
        },
    });

    // --- 8. SG-SST & SEGURIDAD VIAL (Reportes Preventivos) ---
    for (let i = 20; i < 30; i++) {
        await prisma.novedad.create({
            data: {
                tipo:
                    i % 2 === 0
                        ? TipoNovedad.CONDUCTA
                        : TipoNovedad.FALLA_MECANICA,
                descripcion:
                    i % 2 === 0
                        ? "Reporte preventivo: Conductor sin chaleco reflectivo en zona de cargue (SG-SST)"
                        : "Reporte preventivo: Cinturón de seguridad con desgaste excesivo (Seguridad Vial)",
                fecha: new Date(),
                monto: 0,
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
                estado: "PENDIENTE",
            },
        });
    }

    // Registrar un examen médico vencido para generar alerta específica
    await prisma.examenMedico.create({
        data: {
            conductorId: conductores[10].id,
            tipo: TipoExamen.PERIODICO,
            fechaRealizacion: new Date("2024-01-01"),
            fechaVencimiento: new Date("2025-01-01"), // Vencido en 2026
            entidadMedica: "IPS Sanitas SST",
            concepto: ConceptoMedico.APTO,
        },
    });

    console.log(
        `✅ Datos de SG-SST y Seguridad Vial integrados (Certificados, Exámenes, Reportes).`,
    );

    console.log("⭐ ¡DEMO COMPLETO COMPLETADO EXITOSAMENTE! ⭐");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
