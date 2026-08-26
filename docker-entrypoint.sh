#!/bin/sh
set -e

echo "🚀 Iniciando contenedor Coopetraes..."

# Ejecutar migraciones de base de datos si DATABASE_URL está definido
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Verificando y aplicando migraciones de Prisma..."
  # Intentar migrate deploy; si falla o no hay migraciones formales, hacer db push seguro
  npx prisma migrate deploy || npx prisma db push --skip-generate || echo "⚠️ Advertencia: No se pudieron aplicar migraciones automáticamente."

  if [ "$SEED_ON_START" = "true" ]; then
    echo "🌱 Ejecutando seed de base de datos..."
    npx prisma db seed || echo "⚠️ Advertencia: Error en prisma db seed."
  fi
fi

echo "✨ Iniciando servidor Next.js..."
exec "$@"
