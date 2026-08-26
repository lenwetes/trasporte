import { prisma } from "../src/lib/prisma";
import { hash } from "argon2";
import { Usuario, Vehiculo } from "@prisma/client";

async function main() {
    console.log("Iniciando generación de datos de prueba...");

    const passwordHash = await hash("123456");

    // --- CREAR CONDUCTORES ---
    const conductoresData = [
        {
            nombres: "Carlos",
            apellidos: "Méndez Ruiz",
            email: "carlos.mendez@example.com",
            doc: "1001",
        },
        {
            nombres: "Ana",
            apellidos: "Pérez Gómez",
            email: "ana.perez@example.com",
            doc: "1002",
        },
        {
            nombres: "Luis",
            apellidos: "Rodríguez Díaz",
            email: "luis.rodriguez@example.com",
            doc: "1003",
        },
        {
            nombres: "María",
            apellidos: "López Torres",
            email: "maria.lopez@example.com",
            doc: "1004",
        },
        {
            nombres: "Jorge",
            apellidos: "Sánchez Gil",
            email: "jorge.sanchez@example.com",
            doc: "1005",
        },
    ];

    const conductores: Usuario[] = [];
    for (const c of conductoresData) {
        const conductor = await prisma.usuario.upsert({
            where: { email: c.email },
            update: {},
            create: {
                nombres: c.nombres,
                apellidos: c.apellidos,
                email: c.email,
                numeroDocumento: c.doc,
                passwordHash,
                rol: "CONDUCTOR",
                telefono: "3001234567",
                direccion: "Calle Falsa 123",
                numeroLicencia: c.doc + "000",
                licencias: {
                    create: [
                        {
                            categoria: "C1",
                            servicio: "PUBLICO",
                            fechaVencimiento: new Date("2028-01-01"),
                        },
                        {
                            categoria: "B1",
                            servicio: "PARTICULAR",
                            fechaVencimiento: new Date("2028-01-01"),
                        },
                    ],
                },
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        });
        conductores.push(conductor);
        console.log(`Conductor creado: ${c.nombres} ${c.apellidos}`);
    }

    // --- CREAR VEHÍCULOS ---
    const vehiculosData = [
        {
            placa: "ABC-123",
            marca: "Chevrolet",
            modelo: "N300",
            propietario: "Carlos Méndez",
        },
        {
            placa: "XYZ-789",
            marca: "Renault",
            modelo: "Master",
            propietario: "Ana Pérez",
        },
        {
            placa: "DEF-456",
            marca: "Nissan",
            modelo: "Urvan",
            propietario: "Inversiones SAS",
        },
        {
            placa: "GHI-012",
            marca: "Mercedes",
            modelo: "Sprinter",
            propietario: "Transportes Rápidos",
        },
        {
            placa: "JKL-345",
            marca: "Toyota",
            modelo: "Hiace",
            propietario: "Luis Rodríguez",
        },
        {
            placa: "ZZZ-999",
            marca: "Hyundai",
            modelo: "H1",
            propietario: "Coopetraes",
        },
    ];

    const vehiculos: Vehiculo[] = [];
    for (const v of vehiculosData) {
        const vehiculo = await prisma.vehiculo.upsert({
            where: { placa: v.placa },
            update: {},
            create: {
                placa: v.placa,
                marca: v.marca,
                modelo: v.modelo,
                anho: 2022,
                propietario: v.propietario,
                modalidad: "FLOTA_PROPIA",
                clase: "MICROBUS",
                capacidadPuestos: 12,
            },
        });
        vehiculos.push(vehiculo);
        console.log(`Vehículo creado: ${v.placa}`);
    }

    // --- CREAR DOCUMENTOS Y ALERTAS (Simuladas) ---
    const docsData = [
        { tipo: "SOAT", dias: 30 },
        { tipo: "TECNOMECANICA", dias: -10 },
        { tipo: "TARJETA_OPERACION", dias: 5 },
    ];

    for (const v of vehiculos) {
        for (const doc of docsData) {
            const fechaVencimiento = new Date();
            fechaVencimiento.setDate(fechaVencimiento.getDate() + doc.dias);

            // Usamos upsert o create con cuidado para no duplicar si ya existen
            // En este caso simple creamos. Si se corre varias veces, se duplicarán documentos.
            // Para pruebas está bien, o podríamos borrar anteriores.
            await prisma.documentoVehiculo.create({
                data: {
                    vehiculoId: v.id,
                    tipo: doc.tipo,
                    fechaVencimiento: fechaVencimiento,
                },
            });
        }
        console.log(`Documentos creados para vehículo: ${v.placa}`);
    }

    // --- VINCULAR CONDUCTORES A VEHÍCULOS ---
    for (let i = 0; i < vehiculos.length; i++) {
        if (conductores[i]) {
            await prisma.vinculacion.create({
                data: {
                    vehiculoId: vehiculos[i].id,
                    conductorId: conductores[i].id,
                    fechaInicio: new Date(),
                },
            });
            console.log(
                `Vinculado ${conductores[i].nombres} a ${vehiculos[i].placa}`,
            );
        }
    }

    console.log("¡Datos de prueba generados exitosamente!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
