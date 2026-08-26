#!/bin/bash

# ==============================================================================
# Script de Parada del Servidor - SGIT COOPETRAES
# ==============================================================================

# Colores
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}Deteniendo servidor de SGIT COOPETRAES...${NC}"

# 1. Intentar con PM2
if command -v pm2 &> /dev/null; then
    pm2 stop "coopetraes-app" && pm2 delete "coopetraes-app"
    echo -e "${GREEN}Aplicación detenida en PM2.${NC}"
fi

# 2. Intentar por archivo PID
if [ -f .server.pid ]; then
    PID=$(cat .server.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo -e "${GREEN}Proceso con PID $PID detenido.${NC}"
    fi
    rm .server.pid
fi

# 3. Limpieza por puerto (Seguridad adicional por si Next.js dejó procesos huérfanos)
PORT_PID=$(lsof -t -i:3000)
if [ ! -z "$PORT_PID" ]; then
    kill -9 $PORT_PID
    echo -e "${GREEN}Procesos en el puerto 3000 finalizados.${NC}"
fi

echo -e "${GREEN}Servidor fuera de línea.${NC}"
