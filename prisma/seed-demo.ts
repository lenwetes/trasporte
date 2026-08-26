import { PrismaClient, Rol, TipoDocumento, Modalidad, ClaseVehiculo, EstadoAlerta, EstadoOperativo, TipoNovedad, EstadoNovedad, FrecuenciaMantenimiento, TipoObligacion, EstadoObligacion } from '@prisma/client';
import { fakerES_MX as faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

const MODELS = [
  { marca: 'NISSAN', modelos: ['URVAN 2.5', 'FRONTIER NP300'] },
  { marca: 'TOYOTA', modelos: ['HIACE', 'HILUX 4X4'] },
  { marca: 'RENAULT', modelos: ['MASTER XL', 'KANGOO EXPRESS'] },
  { marca: 'MERCEDES-BENZ', modelos: ['SPRINTER 313', 'SPRINTER 515'] },
  { marca: 'FOTON', modelos: ['VIEW C2', 'GRATOUR'] },
  { marca: 'DAIHATSU', modelos: ['DELTA'] },
  { marca: 'FOTON', modelos: ['K-1', 'COBI'] }
];

const COLOMBIAN_SURNAMES = ['GARCIA', 'RODRIGUEZ', 'MARTINEZ', 'LOPEZ', 'GONZALEZ', 'PEREZ', 'SANCHEZ', 'RAMIREZ', 'HERNANDEZ', 'DIAZ', 'TORRES', 'ORTEGA', 'VASQUEZ', 'OSORIO', 'ALVAREZ'];

const COLORS = ['Blanco', 'Plateado', 'Gris', 'Verde (Escolar)', 'Blanco/Azul'];

async function createMockArchivo(name: string) {
  const arc = await prisma.repositorioArchivo.create({
    data: {
      nombreOriginal: name,
      nombreUnico: `${faker.string.uuid()}.pdf`,
      tipoMime: 'application/pdf',
      tamano: faker.number.int({ min: 1024 * 100, max: 1024 * 1024 * 2 }),
      rutaAbsoluta: `/storage/uploads/${faker.string.uuid()}.pdf`,
    }
  });
  return arc.id;
}

async function createDummyPDF(name: string) {
  const uploadsDir = path.join(process.cwd(), 'storage', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const nombreUnico = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${name}`;
  const rutaAbsoluta = path.join(uploadsDir, nombreUnico);

  // Create a minimal "PDF-like" file (just text for testing)
  fs.writeFileSync(rutaAbsoluta, `%PDF-1.4\n%Dummy PDF for ${name}\n%%EOF`);

  const stats = fs.statSync(rutaAbsoluta);

  const file = await prisma.repositorioArchivo.create({
    data: {
      nombreOriginal: name,
      nombreUnico: nombreUnico,
      rutaAbsoluta: rutaAbsoluta,
      tipoMime: 'application/pdf',
      tamano: stats.size
    }
  });

  return file.id;
}

async function main() {
  console.log('🧹 Limpiando base de datos para banco de pruebas...');
  await prisma.novedad.deleteMany();
  await prisma.obligacionFinanciera.deleteMany();
  await prisma.documentoVehiculo.deleteMany();
  await prisma.vinculacion.deleteMany();
  await prisma.hojaVidaVehiculo.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.examenMedico.deleteMany();
  await prisma.detalleLicencia.deleteMany();
  await prisma.hojaVida.deleteMany();
  // No borramos todos los usuarios para no perder el admin si existe, 
  // pero sí los de roles específicos de prueba
  await prisma.usuario.deleteMany({ where: { rol: { in: [Rol.CONDUCTOR, Rol.PROPIETARIO] } } });
  await prisma.planMantenimiento.deleteMany();

  console.log('🚀 Iniciando siembra de datos de prueba completos...');

  // 1. Crear Propietarios (15)
  console.log('👥 Creando 15 Propietarios...');
  const propietarios = [];
  for (let i = 0; i < 15; i++) {
    const firstName = faker.person.firstName().toUpperCase();
    const lastName = faker.helpers.arrayElement(COLOMBIAN_SURNAMES);
    const user = await prisma.usuario.create({
      data: {
        nombres: firstName,
        apellidos: lastName,
        tipoDocumento: TipoDocumento.CC,
        numeroDocumento: faker.string.numeric(10),
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6mU+K...', // dummy hash
        rol: Rol.PROPIETARIO,
        telefono: '3' + faker.string.numeric(9),
        direccion: faker.location.streetAddress(),
        municipio: 'Sincelejo',
        activo: true
      }
    });
    propietarios.push(user);
  }

  // 2. Crear Conductores (30)
  console.log('👨‍✈️ Creando 30 Conductores con datos completos...');
  const conductores = [];
  for (let i = 0; i < 30; i++) {
    const firstName = faker.person.firstName().toUpperCase();
    const lastName = faker.helpers.arrayElement(COLOMBIAN_SURNAMES);
    const docId = await createMockArchivo(`cc-${firstName}.pdf`);
    const licId = await createMockArchivo(`licencia-${firstName}.pdf`);
    const medId = await createMockArchivo(`examen-medico-${firstName}.pdf`);
    const fotoId = await createMockArchivo(`foto-${firstName}.jpg`);

    const user = await prisma.usuario.create({
      data: {
        nombres: firstName,
        apellidos: lastName,
        tipoDocumento: 'CC',
        numeroDocumento: faker.string.numeric(10),
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6mU+K...',
        rol: 'CONDUCTOR',
        idFotoPerfil: fotoId,
        idDocumentoIdentidad: docId,
        municipio: i % 2 === 0 ? 'SINCELEJO' : 'COROZAL',
        hojaVida: {
          create: {
            rh: faker.helpers.arrayElement(['O+', 'O-', 'A+', 'B+']),
            eps: 'SURA',
            arl: 'POSITIVA',
            fondoPensiones: 'PROTECCIÓN',
            contactoEmergenciaNombre: faker.person.fullName().toUpperCase(),
            contactoEmergenciaTelefono: '3' + faker.string.numeric(9),
            perfilProfesional: 'CONDUCTOR CON AMPLIA EXPERIENCIA EN TRANSPORTE ESPECIAL.'
          }
        },
        licencias: {
          create: {
            categoria: 'C2',
            servicio: 'PUBLICO',
            fechaVencimiento: faker.date.future({ years: 3 }),
            archivoId: licId
          }
        },
        examenesMedicos: {
          create: {
            tipo: 'INGRESO',
            fechaRealizacion: faker.date.past(),
            fechaVencimiento: faker.date.future(),
            entidadMedica: 'COLMEDICA',
            concepto: 'APTO',
            archivoId: medId
          }
        }
      }
    });
    conductores.push(user);
  }

  // 3. Crear Planes de Mantenimiento (Tiempo)
  console.log('🔧 Creando Planes de Mantenimiento...');
  const planes = [
    { nombre: 'Preventivo Mensual', meses: 1 },
    { nombre: 'Revisión Bimestral', meses: 2 },
    { nombre: 'Preventivo Trimestral', meses: 3 },
    { nombre: 'Mantenimiento Semestral', meses: 6 },
    { nombre: 'Certificación Anual', meses: 12 }
  ];

  const planIds = [];
  for (const p of planes) {
    const plan = await prisma.planMantenimiento.create({
      data: {
        nombre: p.nombre,
        frecuencia: FrecuenciaMantenimiento.TIEMPO,
        mesesIntervalo: p.meses,
        descripcion: `Plan automático cada ${p.meses} meses.`
      }
    });
    planIds.push(plan.id);
  }

  // 4. Crear Vehículos (30)
  console.log('🚐 Creando 30 Vehículos de transporte especial...');
  for (let i = 0; i < 30; i++) {
    const brandData = faker.helpers.arrayElement(MODELS);
    const modelStr = faker.helpers.arrayElement(brandData.modelos);
    const placa = `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.string.numeric(3)}`;
    const owner = faker.helpers.arrayElement(propietarios);
    const driver = conductores[i]; // Asignar 1 a 1 para simplicidad

    const vehiculo = await prisma.vehiculo.create({
      data: {
        placa,
        marca: brandData.marca,
        modelo: modelStr,
        anho: faker.number.int({ min: 2015, max: 2024 }),
        color: faker.helpers.arrayElement(COLORS),
        capacidadPuestos: faker.number.int({ min: 5, max: 25 }),
        numeroMotor: faker.string.alphanumeric(15).toUpperCase(),
        numeroChasis: faker.string.alphanumeric(17).toUpperCase(),
        numeroInterno: (200 + i).toString(),
        clase: modelStr === 'NKR' || modelStr === 'NPR' ? ClaseVehiculo.BUSETA : ClaseVehiculo.MICROBUS,
        modalidad: Modalidad.CONVENIO_EXTERNO,
        propietarioId: owner.id,
        kilometrajeActual: faker.number.int({ min: 10000, max: 200000 }),
        vinculaciones: {
          create: {
            conductorId: driver.id,
            activo: true
          }
        },
        hojaVida: {
          create: {
            observaciones: 'Vehículo en excelentes condiciones operativas.'
          }
        }
      }
    });

    // 5. Crear Novedades (3 por vehículo)
    const tipos = Object.values(TipoNovedad);
    for (let j = 0; j < 3; j++) {
      await prisma.novedad.create({
        data: {
          tipo: faker.helpers.arrayElement(tipos),
          descripcion: faker.lorem.sentence(),
          fecha: faker.date.recent({ days: 60 }),
          monto: faker.number.float({ min: 10000, max: 500000 }),
          estado: faker.helpers.arrayElement([EstadoNovedad.PENDIENTE, EstadoNovedad.RESUELTO]),
          vehiculoId: vehiculo.id,
          conductorId: driver.id
        }
      });
    }

    // 6. Crear una Obligación de Seguro (Financiera)
    await prisma.obligacionFinanciera.create({
      data: {
        usuarioId: owner.id,
        vehiculoId: vehiculo.id,
        tipo: TipoObligacion.OTRO,
        periodo: new Date(),
        fechaVence: faker.date.future(),
        montoInicial: "450000",
        saldoPendiente: "450000",
        estado: EstadoObligacion.PENDIENTE
      }
    });
  }

  console.log('✅ Siembra de datos completada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
