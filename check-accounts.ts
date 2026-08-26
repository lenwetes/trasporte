
const { PrismaClient } = require('@prisma/client');

async function check() {
  const prisma = new PrismaClient();
  const accounts = await prisma.cuentaContable.findMany({
    where: { codigo: { in: ['110505', '110510'] } }
  });

  console.log("CUENTAS ENCONTRADAS:", accounts.length);
  for (const acc of accounts) {
    const balance = await prisma.asientoContable.aggregate({
      where: { cuentaId: acc.id },
      _sum: { debito: true, credito: true }
    });
    const total = Number(balance._sum.debito || 0) - Number(balance._sum.credito || 0);
    console.log(`Cuenta: ${acc.codigo} (${acc.nombre}) - Saldo: ${total}`);
  }
  process.exit(0);
}

check();
