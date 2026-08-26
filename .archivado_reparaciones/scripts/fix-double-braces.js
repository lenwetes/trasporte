#!/usr/bin/env node
/**
 * Script para corregir el patrón de doble llave }}: 
 * return { success: false, error: "..." }}; => return { success: false, error: "..." };
 * También corrige: where: { codigo: "..." }}, => where: { codigo: "..." },
 */
const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/actions/finance/cash-movements.ts',
  'src/actions/finance/charges.actions.ts',
  'src/actions/finance/concepts/concept-mutations.actions.ts',
  'src/actions/finance/config.actions.ts',
  'src/actions/finance/expenses.actions.ts',
  'src/actions/finance/loans.actions.ts',
  'src/actions/finance/payments.actions.ts',
  'src/actions/finance/payments.ts',
  'src/actions/finance/providers.ts',
  'src/actions/finance/settings.ts',
  'src/actions/finance/stats.actions.ts',
  'src/actions/finance/transactions.actions.ts',
  'src/actions/finance/transactions.ts',
  'src/actions/fleet/operability.actions.ts',
  'src/actions/fuec.ts',
  'src/actions/library/library-search.actions.ts',
  'src/actions/licencias.ts',
  'src/actions/maintenance/alerts.ts',
  'src/actions/maintenance/orders.approve.ts',
  'src/actions/maintenance/orders.complete.ts',
  'src/actions/maintenance/orders.create.ts',
  'src/actions/maintenance/orders.get.ts',
  'src/actions/maintenance/plans.ts',
  'src/actions/maintenance/predictions.ts',
  'src/actions/maintenance/records.ts',
  'src/actions/novedades.ts',
  'src/actions/safety/get.ts',
  'src/actions/safety/mutations.ts',
  'src/actions/simit.ts',
  'src/actions/siniestros.ts',
  'src/actions/usuarios/user-mutations.ts',
  'src/actions/usuarios/user-queries.ts',
  'src/actions/vehiculos/get.ts',
  'src/actions/vehiculos/mutations.ts',
  'src/actions/vinculaciones.ts',
  'src/app/api/conductores/route.ts',
  'src/app/api/cron/alerts/route.ts',
  'src/app/api/global-search/route.ts',
  'src/app/api/upload/route.ts',
  'src/app/api/usuarios/search/route.ts',
  'src/app/api/vehiculos/route.ts',
  'src/app/api/vehiculos/search/route.ts',
];

let totalFixed = 0;

for (const relPath of targetFiles) {
  const fullPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  No encontrado: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Patrón 1: }}; al final de línea => };
  // Solo cuando el }} no es una estructura legítima (objetos anidados en Prisma)
  // Detectar: "string"  }}; o value }}; al final de línea
  content = content.replace(/\}\};\s*(\r?\n)/g, '};\n');
  
  // Patrón 2: }}, cuando sigue un comentario o newline (within Prisma where clauses)
  // where: { codigo: "110505" }}, // comment => where: { codigo: "110505" }, // comment
  content = content.replace(/\}\},(\s*\/\/[^\r\n]*)/g, '},$1');
  content = content.replace(/\}\},(\s*\r?\n\s*\}\);)/g, '},$1');

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    const count = (original.match(/\}\};/g) || []).length + (original.match(/\}\},/g) || []).length;
    console.log(`✅ Corregido: ${relPath} (~${count} patrones)`);
    totalFixed++;
  } else {
    console.log(`➖ Sin cambios: ${relPath}`);
  }
}

console.log(`\n🎯 Total archivos modificados: ${totalFixed}`);
