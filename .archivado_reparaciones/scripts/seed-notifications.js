const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando generación de datos de prueba para notificaciones...");

  // 1. Obtener un usuario administrador para asociar las notificaciones
  const admin = await prisma.usuario.findFirst({
    where: { rol: "ADMIN", activo: true }
  });

  if (!admin) {
    console.error("❌ No se encontró un usuario administrador. Por favor, asegúrate de estar logueado como admin.");
    return;
  }

  console.log(`👤 Usando administrador: ${admin.nombres} ${admin.apellidos} (${admin.id})`);

  // 2. Crear un vehículo de prueba
  const placaTest = "TST" + Math.floor(100 + Math.random() * 900);
  const vehiculo = await prisma.vehiculo.upsert({
    where: { placa: placaTest },
    update: {},
    create: {
      id: crypto.randomUUID(),
      placa: placaTest,
      marca: "Chevrolet",
      modelo: "NPR",
      anho: 2024,
      clase: "OTRO",
      modalidad: "FLOTA_PROPIA",
      activo: true,
      propietario: "COOPETRAES TEST",
      estadoOperativo: "OPERATIVO_CON_ALERTAS"
    }
  });

  console.log(`🚛 Vehículo creado/usado: ${vehiculo.placa}`);

  // 3. Crear datos de notificaciones (Auditables)
  const notificationsData = [
    {
      titulo: "⚠️ VENCIMIENTO INMINENTE: SOAT",
      mensaje: `El SOAT del vehículo ${vehiculo.placa} vencerá en 3 días. Por favor, gestione la renovación para evitar bloqueos operativos.`,
      tipo: "WARNING",
      vinculo: `/dashboard/vehiculos/${vehiculo.id}`,
      leida: false
    },
    {
      titulo: "🛑 BLOQUEO PREOPERATIVO",
      mensaje: `La unidad ${vehiculo.placa} ha sido bloqueada debido a una falla crítica en el sistema de frenos reportada por el conductor.`,
      tipo: "ERROR",
      vinculo: `/dashboard/novedades`,
      leida: false
    },
    {
      titulo: "✅ MANTENIMIENTO COMPLETADO",
      mensaje: `Se ha registrado exitosamente el cambio de aceite y filtros para el vehículo ${vehiculo.placa}. Próximo servicio en 10,000 KM.`,
      tipo: "SUCCESS",
      vinculo: `/dashboard/mantenimiento`,
      leida: true
    },
    {
      titulo: "📅 RECORDATORIO DE AUDITORÍA",
      mensaje: "Mañana a las 08:00 AM se realizará la inspección técnica semestral de la flota en el patio principal.",
      tipo: "INFO",
      vinculo: "/dashboard/planificador",
      leida: false
    },
    {
      titulo: "🔧 ALERTA DE KILOMETRAJE",
      mensaje: `El vehículo ${vehiculo.placa} ha alcanzado los 50,000 KM. Se requiere programar mantenimiento preventivo tipo B.`,
      tipo: "WARNING",
      vinculo: `/dashboard/mantenimiento`,
      leida: false
    }
  ];

  console.log("🔔 Insertando notificaciones...");

  for (const n of notificationsData) {
    await prisma.notificacion.create({
      data: {
        id: crypto.randomUUID(),
        usuarioId: admin.id,
        titulo: n.titulo,
        mensaje: n.mensaje,
        tipo: n.tipo,
        leida: n.leida,
        vinculo: n.vinculo
      }
    });
  }

  // 4. Crear Stickers en el Calendario para probar el historial visual
  console.log("🗓️ Creando stickers en el planificador...");
  
  const stickersData = [
    {
      titulo: "Revisión de SOAT - " + vehiculo.placa,
      descripcion: "Validar vigencia del seguro obligatorio en el RUNT.",
      tipo: "DOCUMENTO",
      prioridad: "ALTA",
      fecha: new Date()
    },
    {
      titulo: "Cambio de Pastillas - " + vehiculo.placa,
      descripcion: "Mantenimiento correctivo de frenos delanteros.",
      tipo: "MANTENIMIENTO",
      prioridad: "MEDIA",
      fecha: new Date(Date.now() + 86400000) // Mañana
    }
  ];

  for (const s of stickersData) {
    await prisma.eventoCalendario.create({
      data: {
        id: crypto.randomUUID(),
        usuarioId: admin.id,
        titulo: s.titulo,
        descripcion: s.descripcion,
        tipo: s.tipo,
        prioridad: s.prioridad,
        fecha: s.fecha,
        metadata: { color: s.prioridad === 'ALTA' ? '#ef4444' : '#f59e0b' }
      }
    });
  }

  console.log("✨ ¡Datos de prueba generados con éxito!");
  console.log("👉 Revisa la campana (bell) y el nuevo historial de notificaciones.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
