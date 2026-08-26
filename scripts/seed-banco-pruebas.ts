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
} from "@prisma/client";

async function main() {
    console.log("🚀 Iniciando generación del Banco de Pruebas Definitivo...");

    const passwordHash = await hash("coopetraes123");

    const nombres = [
        "Juan",
        "Carlos",
        "Luis",
        "Jorge",
        "Andrés",
        "Diego",
        "Mateo",
        "Santiago",
        "Gabriel",
        "Samuel",
        "Sebastián",
        "Alejandro",
        "Nicolás",
        "Daniel",
        "David",
        "José",
        "Felipe",
        "Ricardo",
        "Eduardo",
        "Manuel",
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
    ];

    // --- 1. CONDUCTORES ---
    const conductores: Usuario[] = [];
    for (let i = 0; i < 20; i++) {
        const cedula = (1000000000 + i * 789123).toString();
        const email = `conductor${i + 1}@coopetraes.co`;

        const user = await prisma.usuario.upsert({
            where: { email },
            update: {},
            create: {
                nombres: nombres[i % nombres.length],
                apellidos: `${apellidos[i % apellidos.length]} ${apellidos[(i + 5) % apellidos.length]}`,
                email,
                numeroDocumento: cedula,
                tipoDocumento: TipoDocumento.CC,
                passwordHash,
                rol: Rol.CONDUCTOR,
                telefono: `300${Math.floor(1000000 + Math.random() * 9000000)}`,
                direccion: `Calle ${i + 1} #10-${i + 10}, Sincelejo`,
                municipio: "Sincelejo",
                numeroLicencia: cedula,
                licencias: {
                    create: [
                        {
                            categoria: "C2",
                            servicio: "PUBLICO",
                            fechaVencimiento: new Date("2028-12-31"),
                            activo: true,
                        },
                    ],
                },
                hojaVida: {
                    create: {
                        rh: "O+",
                        eps: "Salud Total",
                        arl: "Sura",
                        fondoPensiones: "Porvenir",
                        perfilProfesional:
                            "Conductor profesional con más de 10 años de experiencia en transporte especial.",
                        contactoEmergenciaNombre: "Familiar Conductor",
                        contactoEmergenciaTelefono: "3101234567",
                    },
                },
                experienciasLaborales: {
                    create: [
                        {
                            empresa: "Transportes del Norte",
                            cargo: "Conductor",
                            fechaInicio: new Date("2020-01-01"),
                            fechaFin: new Date("2023-12-31"),
                        },
                    ],
                },
                referenciasPersonales: {
                    create: [
                        {
                            nombre: "Alberto Gómez",
                            ocupacion: "Ingeniero",
                            telefono: "3200000000",
                        },
                    ],
                },
                certificados: {
                    create: [
                        {
                            nombre: "Curso Manejo Defensivo",
                            institucion: "SENA",
                            fechaEmision: new Date("2023-05-10"),
                            categoria: "SEGURIDAD",
                        },
                    ],
                },
            },
        });
        conductores.push(user);
    }
    console.log(
        `✅ 20 Conductores creados con experiencias, referencias y certificados.`,
    );

    // --- 2. VEHÍCULOS ---
    const vehiculos: Vehiculo[] = [];
    const marcas = [
        "Chevrolet",
        "Renault",
        "Nissan",
        "Toyota",
        "Hyundai",
        "Mercedes-Benz",
        "Volkswagen",
        "Foton",
        "Hino",
        "Jac",
    ];
    const modelos = [
        "N300",
        "Master",
        "Urvan",
        "Hiace",
        "H1",
        "Sprinter",
        "Crafter",
        "View",
        "Dutro",
        "Sunray",
    ];

    for (let i = 0; i < 20; i++) {
        const placa = `SPQ${String(i + 100).padStart(3, "0")}`;
        const vehiculo = await prisma.vehiculo.upsert({
            where: { placa },
            update: {},
            create: {
                placa,
                marca: marcas[i % marcas.length],
                modelo: modelos[i % modelos.length],
                anho: 2018 + (i % 6),
                color: i % 2 === 0 ? "Blanco" : "Plata",
                clase: ClaseVehiculo.MICROBUS,
                modalidad: Modalidad.FLOTA_PROPIA,
                capacidadPuestos: 16,
                propietario: "COOPETRAES",
                kilometrajeActual: 50000 + i * 1500,
                activo: true,
                hojaVida: {
                    create: {
                        observaciones:
                            "Vehículo en óptimas condiciones corporativas.",
                    },
                },
            },
        });
        vehiculos.push(vehiculo);
    }
    console.log(`✅ 20 Vehículos creados con hojas de vida.`);

    // --- 3. VINCULACIONES ---
    for (let i = 0; i < 20; i++) {
        await prisma.vinculacion.create({
            data: {
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
                activo: true,
            },
        });
    }

    // --- 4. DOCUMENTACIÓN ---
    for (const v of vehiculos) {
        const docs = [
            { t: "SOAT", d: 15 },
            { t: "TECNOMECANICA", d: -5 },
            { t: "TARJETA_OPERACION", d: 2 },
        ];
        for (const d of docs) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + d.d);
            await prisma.documentoVehiculo.create({
                data: { vehiculoId: v.id, tipo: d.t, fechaVencimiento: fecha },
            });
        }
    }

    // --- 5. EXÁMENES MÉDICOS ---
    for (const c of conductores) {
        await prisma.examenMedico.create({
            data: {
                conductorId: c.id,
                tipo: TipoExamen.INGRESO,
                fechaRealizacion: new Date("2024-01-15"),
                fechaVencimiento: new Date("2025-01-15"),
                entidadMedica: "Salud Ocupacional de la Costa",
                concepto: ConceptoMedico.APTO,
            },
        });
    }

    // --- 6. PREOPERACIONALES ---
    const itemsPreop = [
        "Frenos",
        "Llantas",
        "Luces",
        "Nivel de Aceite",
        "Espejos",
    ];
    for (let i = 0; i < 20; i++) {
        await prisma.preoperacional.create({
            data: {
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
                kilometraje: 60000 + i * 100,
                resultado:
                    i % 5 === 0
                        ? EstadoPreoperacional.RECHAZADO
                        : EstadoPreoperacional.APROBADO,
                detalles: {
                    create: itemsPreop.map((item) => ({
                        item,
                        estado: i % 5 === 0 && item === "Luces" ? false : true,
                        criticidad: NivelCriticidad.ALTA,
                    })),
                },
            },
        });
    }

    // --- 7. MANTENIMIENTOS ---
    const plan = await prisma.planMantenimiento.upsert({
        where: { id: "plan-preventivo" },
        update: {},
        create: {
            id: "plan-preventivo",
            nombre: "Mantenimiento Preventivo 10K",
            frecuencia: FrecuenciaMantenimiento.KILOMETROS,
            kmIntervalo: 10000,
        },
    });

    for (let i = 0; i < 10; i++) {
        await prisma.mantenimientoRealizado.create({
            data: {
                vehiculoId: vehiculos[i].id,
                planId: plan.id,
                kilometraje: 40000,
                costo: 250000,
                observaciones: "Cambio de aceite y filtros.",
            },
        });
    }
    console.log(`✅ 10 Registros de mantenimiento preventivo creados.`);

    // --- 8. ENTREGAS DE DOTACIÓN ---
    for (let i = 0; i < 20; i++) {
        await prisma.entregaDotacion.create({
            data: {
                conductorId: conductores[i].id,
                items: [
                    { item: "Camisa", cantidad: 2, estado: "NUEVO" },
                    { item: "Botas", cantidad: 1, estado: "NUEVO" },
                ],
                observaciones: "Entrega anual reglamentaria.",
            },
        });
    }
    console.log(`✅ 20 Entregas de dotación generadas.`);

    // --- 9. NOVEDADES Y SINIESTROS ---
    for (let i = 0; i < 10; i++) {
        await prisma.novedad.create({
            data: {
                tipo: TipoNovedad.MULTA,
                descripcion: "Exceso de velocidad",
                fecha: new Date(),
                monto: 580000,
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
            },
        });
    }
    for (let i = 18; i < 20; i++) {
        await prisma.siniestro.create({
            data: {
                fecha: new Date(),
                lugar: "Sincelejo",
                reporteHechos: "Choque leve",
                gravedad: GravedadSiniestro.SOLO_DANOS,
                conductorId: conductores[i].id,
                vehiculoId: vehiculos[i].id,
                investigacion: {
                    create: {
                        analisisCausas: "Distracción",
                        planAccion: "Capacitación",
                        conclusiones: "Responsable",
                        diasPerdidos: 0,
                    },
                },
            },
        });
    }

    console.log("⭐ ¡Banco de Pruebas Definitivo completado!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
