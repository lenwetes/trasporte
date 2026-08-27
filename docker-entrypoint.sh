#!/bin/sh
set -e

echo "🚀 Iniciando contenedor Coopetraes..."

# Ejecutar migraciones de base de datos si DATABASE_URL está definido
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Aplicando migraciones de Prisma..."
  npx prisma@6.19.2 migrate deploy || npx prisma@6.19.2 db push --accept-data-loss || echo "⚠️ No se pudieron aplicar migraciones automáticas."

  echo "👤 Asegurando existencia del usuario Administrador..."
  npx tsx scripts/ensure-admin.ts || npx prisma@6.19.2 db seed || echo "⚠️ No se pudo verificar o crear el usuario administrador."
fi

echo "✨ Iniciando servidor Next.js..."
exec "$@"
