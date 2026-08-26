const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const prisma = new PrismaClient();

async function seedAll() {
  const users = await prisma.usuario.findMany({ where: { activo: true } });
  const vehiculos = await prisma.vehiculo.findMany();
  
  if (users.length === 0) return;
  const veh = vehiculos[0];
  const placa = veh ? veh.placa : "ABC-123";

  console.log(`🚀 Sembrando notificaciones para ${users.length} usuarios...`);

  for (const user of users) {
    const notifications = [
      { titulo: "🔨 TEST: Mantenimiento Pendiente", mensaje: `El vehículo ${placa} requiere cambio de aceite inmediato.`, tipo: "WARNING", leida: false },
      { titulo: "✅ TEST: Documento Validado", mensaje: `La licencia de conducción ha sido verificada satisfactoriamente.`, tipo: "SUCCESS", leida: false },
    ];

    for (const n of notifications) {
      await prisma.notificacion.create({
        data: {
          id: crypto.randomUUID(),
          usuarioId: user.id,
          titulo: n.titulo,
          mensaje: n.mensaje,
          tipo: n.tipo,
          leida: n.leida,
          vinculo: veh ? `/dashboard/vehiculos/${veh.id}` : "/dashboard"
        }
      });
    }
  }
  console.log("✨ Finalizado.");
}

seedAll().finally(() => prisma.$disconnect());
