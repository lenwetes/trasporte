#!/bin/sh
set -e

echo "🚀 Iniciando contenedor Coopetraes..."

# Ejecutar migraciones de base de datos si DATABASE_URL está definido
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Aplicando migraciones de Prisma v6..."
  # Usar versión exacta de Prisma para evitar incompatibilidades con v7
  npx prisma@6.19.2 migrate deploy || npx prisma@6.19.2 db push --accept-data-loss || echo "⚠️ No se pudieron aplicar migraciones."

  if [ "$SEED_ON_START" = "true" ]; then
    echo "🌱 Ejecutando seed..."
    npx prisma@6.19.2 db seed || echo "⚠️ Seed omitido."
  fi
fi

echo "✨ Iniciando servidor Next.js..."
exec "$@"
