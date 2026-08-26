#!/bin/bash

# Script de Instalación Automatizado - Coopetraes App
# Este script valida el entorno, configura variables y prepara la base de datos

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

# Banner inicial
clear
echo -e "${GREEN}"
cat << "EOF"
   ____                       _                        
  / ___|___   ___  _ __   ___| |_ _ __ __ _  ___  ___ 
 | |   / _ \ / _ \| '_ \ / _ \ __| '__/ _` |/ _ \/ __|
 | |__| (_) | (_) | |_) |  __/ |_| | | (_| |  __/\__ \
  \____\___/ \___/| .__/ \___|\__|_|  \__,_|\___||___/
                  |_|                                  
EOF
echo -e "${NC}"
echo -e "${BLUE}    Sistema de Gestión de Cooperativa de Transporte${NC}"
echo -e "${BLUE}              Script de Instalación v1.0${NC}"
echo ""

# ============================================
# 1. VALIDACIÓN DEL ENTORNO
# ============================================

print_header "1. Validación del Entorno"

# Verificar Node.js
print_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    print_info "Por favor instala Node.js 18.x o superior desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Se requiere Node.js 18.x o superior (versión actual: $(node -v))"
    exit 1
fi
print_success "Node.js $(node -v) detectado"

# Verificar npm
print_info "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_success "npm $(npm -v) detectado"

# Verificar espacio en disco (mínimo 1GB)
print_info "Verificando espacio en disco..."
AVAILABLE_SPACE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
if [ "$AVAILABLE_SPACE" -lt 1 ]; then
    print_warning "Espacio en disco bajo: ${AVAILABLE_SPACE}GB disponible"
    print_warning "Se recomienda al menos 1GB de espacio libre"
else
    print_success "Espacio en disco: ${AVAILABLE_SPACE}GB disponible"
fi

# Verificar permisos de escritura
print_info "Verificando permisos de escritura..."
if [ ! -w "." ]; then
    print_error "No tienes permisos de escritura en este directorio"
    exit 1
fi
print_success "Permisos de escritura confirmados"

# Verificar si existe package.json
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. ¿Estás en el directorio correcto?"
    exit 1
fi
print_success "Proyecto Next.js detectado"

# ============================================
# 2. INSTALACIÓN DE DEPENDENCIAS
# ============================================

print_header "2. Instalación de Dependencias"

print_info "Instalando dependencias de Node.js..."
if npm install; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error al instalar dependencias"
    exit 1
fi

# ============================================
# 3. CONFIGURACIÓN DE VARIABLES DE ENTORNO
# ============================================

print_header "3. Configuración de Variables de Entorno"

if [ -f ".env" ]; then
    print_warning "Ya existe un archivo .env"
    read -p "¿Deseas sobrescribirlo? (s/N): " OVERWRITE
    if [[ ! $OVERWRITE =~ ^[Ss]$ ]]; then
        print_info "Manteniendo archivo .env existente"
        SKIP_ENV=true
    fi
fi

if [ "$SKIP_ENV" != true ]; then
    print_info "Configurando variables de entorno..."
    echo ""
    
    # DATABASE_URL
    print_info "Configuración de Base de Datos PostgreSQL"
    read -p "Host de la base de datos [localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "Puerto de la base de datos [5432]: " DB_PORT
    DB_PORT=${DB_PORT:-5432}
    
    read -p "Nombre de la base de datos [coopetraes]: " DB_NAME
    DB_NAME=${DB_NAME:-coopetraes}
    
    read -p "Usuario de la base de datos [postgres]: " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    read -sp "Contraseña de la base de datos: " DB_PASSWORD
    echo ""
    
    DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
    
    # NEXTAUTH_SECRET
    print_info "Generando NEXTAUTH_SECRET..."
    NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    
    # NEXTAUTH_URL
    read -p "URL de la aplicación [http://localhost:3000]: " NEXTAUTH_URL
    NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
    
    # Crear archivo .env
    cat > .env << EOF
# Base de Datos
DATABASE_URL="${DATABASE_URL}"

# NextAuth
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="${NEXTAUTH_URL}"

# Configuración de la Aplicación
NODE_ENV=development
EOF
    
    print_success "Archivo .env creado correctamente"
fi

# ============================================
# 4. CONFIGURACIÓN DE PRISMA
# ============================================

print_header "4. Configuración de Base de Datos (Prisma)"

# Verificar conexión a la base de datos
print_info "Verificando conexión a la base de datos..."
if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
    print_success "Conexión a la base de datos exitosa"
else
    print_error "No se pudo conectar a la base de datos"
    print_info "Por favor verifica:"
    print_info "  - Que PostgreSQL esté ejecutándose"
    print_info "  - Que las credenciales en .env sean correctas"
    print_info "  - Que la base de datos '${DB_NAME}' exista"
    exit 1
fi

# Generar cliente de Prisma
print_info "Generando cliente de Prisma..."
if npx prisma generate; then
    print_success "Cliente de Prisma generado"
else
    print_error "Error al generar cliente de Prisma"
    exit 1
fi

# Ejecutar migraciones
print_info "Ejecutando migraciones de base de datos..."
if npx prisma migrate deploy; then
    print_success "Migraciones aplicadas correctamente"
else
    print_warning "Error al aplicar migraciones"
    print_info "Intentando con 'prisma db push'..."
    if npx prisma db push; then
        print_success "Esquema de base de datos sincronizado"
    else
        print_error "Error al sincronizar base de datos"
        exit 1
    fi
fi

# Ejecutar seed (si existe)
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
    print_info "¿Deseas ejecutar el seed de la base de datos?"
    print_warning "Esto creará datos de prueba (usuario admin, etc.)"
    read -p "Ejecutar seed? (S/n): " RUN_SEED
    if [[ ! $RUN_SEED =~ ^[Nn]$ ]]; then
        if npx prisma db seed; then
            print_success "Seed ejecutado correctamente"
            print_info "Usuario administrador creado:"
            print_info "  Email: admin@coopetraes.com"
            print_info "  Contraseña: admin123"
        else
            print_warning "Error al ejecutar seed (puede ser normal si ya existen datos)"
        fi
    fi
fi

# ============================================
# 5. CREACIÓN DE DIRECTORIOS NECESARIOS
# ============================================

print_header "5. Configuración de Directorios"

# Crear directorio de uploads si no existe
print_info "Creando directorio de uploads..."
mkdir -p public/uploads/{certificados,fotos,siniestros}
chmod -R 755 public/uploads
print_success "Directorio de uploads configurado"

# ============================================
# 6. VERIFICACIÓN FINAL
# ============================================

print_header "6. Verificación Final"

print_info "Verificando configuración..."

# Verificar que .env existe y tiene las variables necesarias
if [ -f ".env" ]; then
    if grep -q "DATABASE_URL" .env && grep -q "NEXTAUTH_SECRET" .env; then
        print_success "Variables de entorno configuradas"
    else
        print_warning "Algunas variables de entorno pueden estar faltando"
    fi
else
    print_error "Archivo .env no encontrado"
    exit 1
fi

# Verificar que node_modules existe
if [ -d "node_modules" ]; then
    print_success "Dependencias instaladas"
else
    print_error "Directorio node_modules no encontrado"
    exit 1
fi

# Verificar que Prisma Client está generado
if [ -d "node_modules/.prisma" ]; then
    print_success "Cliente de Prisma generado"
else
    print_warning "Cliente de Prisma puede no estar generado correctamente"
fi

# ============================================
# 7. FINALIZACIÓN
# ============================================

print_header "¡Instalación Completada!"

echo -e "${GREEN}"
cat << "EOF"
  ✓ Entorno validado
  ✓ Dependencias instaladas
  ✓ Variables de entorno configuradas
  ✓ Base de datos inicializada
  ✓ Directorios creados
EOF
echo -e "${NC}"

echo ""
print_info "Próximos pasos:"
echo ""
echo "  1. Para desarrollo:"
echo -e "     ${YELLOW}npm run dev${NC}"
echo ""
echo "  2. Para producción:"
echo -e "     ${YELLOW}npm run build${NC}"
echo -e "     ${YELLOW}npm start${NC}"
echo ""
echo "  3. Con Docker:"
echo -e "     ${YELLOW}docker-compose up -d${NC}"
echo ""
print_info "La aplicación estará disponible en: ${NEXTAUTH_URL}"
echo ""
print_success "¡Listo para comenzar! 🚀"
echo ""
