#!/bin/sh
set -e

echo "🚀 Iniciando contenedor Coopetraes..."

# Ejecutar migraciones de base de datos si DATABASE_URL está definido
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Aplicando migraciones de Prisma..."
  # migrate deploy para entornos con migraciones formales
  # Si falla, usar db push (sin --skip-generate que fue removido en Prisma v6+)
  npx prisma migrate deploy || npx prisma db push --accept-data-loss || echo "⚠️ Advertencia: No se pudieron aplicar migraciones automáticamente."

  if [ "$SEED_ON_START" = "true" ]; then
    echo "🌱 Ejecutando seed de base de datos..."
    npx prisma db seed || echo "⚠️ Seed omitido o sin configuración."
  fi
fi

echo "✨ Iniciando servidor Next.js..."
exec "$@"
