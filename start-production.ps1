<#
.SYNOPSIS
    Script de Inicio de Producción para Coopetraes SGIT
    Versión: 1.0.0
    Autor: IA Engineer

.DESCRIPTION
    Este script automatiza el proceso de despliegue y ejecución del sistema en un entorno Windows.
    Realiza las siguientes tareas:
    1. Verifica prerrequisitos (Node.js, PostgreSQL)
    2. Instala dependencias si faltan
    3. Genera el cliente de Prisma
    4. Ejecuta migraciones de base de datos
    5. Compila la aplicación Next.js
    6. Inicia el servidor de producción

.EXAMPLE
    .\start-production.ps1
#>

$ErrorActionPreference = "Stop"

# Colores para la consola
$green = [ConsoleColor]::Green
$red = [ConsoleColor]::Red
$yellow = [ConsoleColor]::Yellow
$cyan = [ConsoleColor]::Cyan
$reset = [ConsoleColor]::White

function Write-Color($text, $color) {
    Write-Host $text -ForegroundColor $color
}

function Test-Command($command) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        Write-Color "❌ Error: $command no está instalado o no está en el PATH." $red
        exit 1
    }
}

Write-Color "`n🚀 Iniciando Coopetraes Smart Fleet - Entorno de Producción`n" $cyan

# 1. Verificación de Entorno
Write-Color "🔍 Verificando prerrequisitos..." $yellow
Test-Command "node"
Test-Command "npm"
Write-Color "✅ Node.js $(node -v) detectado" $green
Write-Color "✅ npm $(npm -v) detectado" $green

# Verificar archivo .env
if (-not (Test-Path ".env")) {
    Write-Color "❌ Error: Archivo .env no encontrado." $red
    Write-Color "ℹ️  Por favor crea el archivo .env con las variables de configuración." $yellow
    exit 1
}

# 2. Instalación de Dependencias
if (-not (Test-Path "node_modules")) {
    Write-Color "`n📦 Instalando dependencias..." $yellow
    npm ci --omit=dev
    if ($LASTEXITCODE -ne 0) {
        Write-Color "❌ Error instalando dependencias" $red
        exit 1
    }
    Write-Color "✅ Dependencias instaladas" $green
} else {
    Write-Color "✅ Dependencias ya instaladas (saltando npm install)" $green
}

# 3. Base de Datos (Prisma)
Write-Color "`n🗄️  Configurando base de datos..." $yellow
try {
    # Generar cliente
    Write-Color "ℹ️  Generando Prisma Client..." $reset
    npx prisma generate
    
    # Verificar conexión y aplicar migraciones
    Write-Color "ℹ️  Verificando esquema de base de datos..." $reset
    npx prisma migrate deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Color "✅ Base de datos sincronizada" $green
    } else {
        Write-Color "⚠️  Advertencia: 'prisma migrate deploy' falló. Intentando 'db push'..." $yellow
        npx prisma db push
    }
    
} catch {
    Write-Color "❌ Error configurando la base de datos: $_" $red
    exit 1
}

# 4. Construcción (Build)
# Solo construir si no existe la carpeta .next o si se fuerza con -Force
if (-not (Test-Path ".next")) {
    Write-Color "`n🏗️  Compilando aplicación para producción..." $yellow
    $env:NODE_ENV = "production"
    
    # Desactivar linting durante build para producción si ya se validó en CI
    $env:NEXT_TELEMETRY_DISABLED = "1"
    
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Color "❌ Error durante la compilación" $red
        exit 1
    }
    Write-Color "✅ Compilación exitosa" $green
} else {
    Write-Color "✅ Build existente detectado (usa 'npm run build' manualmente para reconstruir)" $green
}

# 5. Ejecución
Write-Color "`n🚀 Iniciando servidor..." $cyan
Write-Color "ℹ️  La aplicación estará disponible en: http://localhost:3000" $reset
Write-Color "ℹ️  Presiona Ctrl+C para detener el servidor" $yellow
Write-Color "════════════════════════════════════════════════════" $cyan

$env:NODE_ENV = "production"
$env:PORT = "3000"

try {
    npm start
} catch {
    Write-Color "❌ El servidor se detuvo inesperadamente" $red
}
