# ==========================================
# Stage 1: Dependencias
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# Stage 2: Construcción (Builder)
# ==========================================
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables para la fase de compilación
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV DATABASE_URL "postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
ENV NEXTAUTH_SECRET "dummy_build_secret_key_1234567890123456"
ENV NEXTAUTH_URL "http://localhost:3000"

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar Next.js en modo Standalone
RUN npm run build

# ==========================================
# Stage 3: Producción (Runner para Coolify)
# ==========================================
FROM node:20-alpine AS runner
RUN apk add --no-cache curl openssl libc6-compat
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Crear usuario y grupo de ejecución segura
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos estáticos y cliente standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar configuración de Prisma y migraciones para el entrypoint
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Script de entrada para migraciones automáticas en Coolify
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Crear directorios para subida de archivos y almacenamiento local con permisos
RUN mkdir -p /app/uploads /app/storage /app/public/uploads && \
    chown -R nextjs:nodejs /app/uploads /app/storage /app/public/uploads

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
