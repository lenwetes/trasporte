#!/bin/bash

# ==============================================================================
# Script de Instalación y Despliegue - SGIT COOPETRAES
# ==============================================================================

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  Iniciando Instalación de SGIT COOPETRAES          ${NC}"
echo -e "${BLUE}====================================================${NC}"

# 1. Verificar .env
if [ ! -f .env ]; then
    echo -e "${RED}Error: Archivo .env no encontrado.${NC}"
    echo -e "${YELLOW}Por favor, crea un archivo .env basado en .env.example antes de continuar.${NC}"
    exit 1
fi

# 2. Instalación de dependencias
echo -e "\n${YELLOW}[1/5] Instalando dependencias de Node.js...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error instalando dependencias.${NC}"
    exit 1
fi

# 3. Preparación de Base de Datos
echo -e "\n${YELLOW}[2/5] Configurando Base de Datos PostgreSQL...${NC}"
npx prisma generate
npx prisma db push --accept-data-loss
if [ $? -ne 0 ]; then
    echo -e "${RED}Error configurando la base de datos. Verifica tu DATABASE_URL en .env${NC}"
    exit 1
fi

# 4. Construcción del proyecto
echo -e "\n${YELLOW}[3/5] Compilando aplicación para producción...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error en el proceso de build.${NC}"
    exit 1
fi

# 5. Iniciar Servidor en segundo plano
echo -e "\n${YELLOW}[4/5] Iniciando servidor de producción...${NC}"

# Intentar usar PM2 si está instalado (recomendado)
if command -v pm2 &> /dev/null; then
    pm2 delete "coopetraes-app" 2>/dev/null
    pm2 start npm --name "coopetraes-app" -- start
    pm2 save
    echo -e "${GREEN}Servidor iniciado exitosamente con PM2.${NC}"
else
    # Si no hay PM2, iniciar con nohup y guardar PID
    nohup npm start > server.log 2>&1 &
    echo $! > .server.pid
    echo -e "${GREEN}Servidor iniciado en segundo plano (PID: $(cat .server.pid)).${NC}"
    echo -e "${YELLOW}Logs disponibles en: server.log${NC}"
fi

# 6. Configurar Backup Automático (Cron Job)
echo -e "\n${YELLOW}[5/5] Configurando Backup Automático (diario a las 00:00)...${NC}"
CRON_PATH=$(pwd)/scripts/backup-db.sh
CRON_JOB="0 0 * * * $CRON_PATH >> $(pwd)/backup.log 2>&1"

# Verificar si ya existe en crontab para no duplicar
(crontab -l 2>/dev/null | grep -F "$CRON_PATH") || (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo -e "${GREEN}Tarea de backup programada en crontab.${NC}"

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${GREEN}  INSTALACIÓN COMPLETADA EXITOSAMENTE               ${NC}"
echo -e "  El sistema está corriendo en el puerto 3000       "
echo -e "${BLUE}====================================================${NC}"
