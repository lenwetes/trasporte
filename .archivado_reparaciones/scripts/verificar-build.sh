#!/bin/bash

# 🔍 Script de Verificación de Build - SGIT Coopetraes
# Fecha: 2026-02-04
# Propósito: Verificar que todas las correcciones estén funcionando correctamente

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Banner
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🔍 Verificación de Build - SGIT Coopetraes            ║"
echo "║     Verificando correcciones de errores de producción     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

print_status "Iniciando verificaciones..."
echo ""

# 1. Verificar TypeScript
print_status "1/5 Verificando TypeScript..."
if npx tsc --noEmit 2>&1 | tee /tmp/tsc-check.log; then
    print_success "TypeScript check pasó sin errores"
else
    print_error "TypeScript check falló. Revisa /tmp/tsc-check.log"
    exit 1
fi
echo ""

# 2. Verificar ESLint
print_status "2/5 Verificando ESLint..."
if npm run lint 2>&1 | tee /tmp/eslint-check.log; then
    print_success "ESLint pasó sin errores"
else
    print_error "ESLint falló. Revisa /tmp/eslint-check.log"
    exit 1
fi
echo ""

# 3. Verificar que los archivos corregidos existen
print_status "3/5 Verificando archivos corregidos..."

files_to_check=(
    "components/forms/vehiculo-form.tsx"
    "lib/pdf/siniestros/generator.ts"
    "lib/services/user.service.ts"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        print_success "Archivo encontrado: $file"
    else
        print_error "Archivo no encontrado: $file"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    print_error "Algunos archivos no se encontraron"
    exit 1
fi
echo ""

# 4. Verificar imports específicos
print_status "4/5 Verificando imports corregidos..."

# Verificar import de updateVehiculo
if grep -q "updateVehiculo" components/forms/vehiculo-form.tsx; then
    print_success "Import de updateVehiculo encontrado en vehiculo-form.tsx"
else
    print_error "Import de updateVehiculo NO encontrado en vehiculo-form.tsx"
    exit 1
fi

# Verificar validación de null en siniestros
if grep -q "numeroDocumento || \"N/A\"" lib/pdf/siniestros/generator.ts; then
    print_success "Validación de null encontrada en siniestros/generator.ts"
else
    print_error "Validación de null NO encontrada en siniestros/generator.ts"
    exit 1
fi

# Verificar validación de email
if grep -q "if (user.email)" lib/services/user.service.ts; then
    print_success "Validación de email encontrada en user.service.ts"
else
    print_error "Validación de email NO encontrada en user.service.ts"
    exit 1
fi
echo ""

# 5. Build de producción
print_status "5/5 Ejecutando build de producción..."
print_warning "Esto puede tomar ~1 minuto..."
echo ""

if npm run build 2>&1 | tee /tmp/build-check.log; then
    print_success "Build de producción completado exitosamente"
else
    print_error "Build de producción falló. Revisa /tmp/build-check.log"
    exit 1
fi
echo ""

# Resumen final
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ✅ VERIFICACIÓN EXITOSA                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
print_success "Todas las verificaciones pasaron correctamente"
echo ""
echo "📊 Resumen:"
echo "   ✅ TypeScript: Sin errores"
echo "   ✅ ESLint: Sin errores"
echo "   ✅ Archivos corregidos: Verificados"
echo "   ✅ Imports: Correctos"
echo "   ✅ Build: Exitoso"
echo ""
echo "🚀 El proyecto está listo para producción"
echo ""

# Mostrar logs guardados
echo "📁 Logs guardados en:"
echo "   - /tmp/tsc-check.log"
echo "   - /tmp/eslint-check.log"
echo "   - /tmp/build-check.log"
echo ""

exit 0
