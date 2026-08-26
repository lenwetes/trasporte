const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.usuario.findMany({
    where: { rol: "ADMIN" },
    select: { id: true, email: true, nombres: true }
  });
  
  console.log("👥 Usuarios ADMIN encontrados:", users.length);
  for (const u of users) {
    const notifs = await prisma.notificacion.count({ where: { usuarioId: u.id } });
    console.log(`- ${u.nombres} (${u.email}): ${notifs} notificaciones`);
    if (notifs > 0) {
        const sample = await prisma.notificacion.findFirst({ where: { usuarioId: u.id }, orderBy: { creadoEn: 'desc' } });
        console.log(`  Última: ${sample.titulo} - Leída: ${sample.leida}`);
    }
  }
}

check().finally(() => prisma.$disconnect());
