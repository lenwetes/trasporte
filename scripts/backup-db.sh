#!/bin/bash

# ==============================================================================
# Script de Backup Automático - SGIT COOPETRAES
# ==============================================================================

# Cargar variables de entorno
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Directorio de backups
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Extraer nombre de la base de datos de DATABASE_URL
# Formato esperado: postgresql://user:pass@host:port/dbname
DB_NAME=$(echo $DATABASE_URL | rev | cut -d'/' -f1 | rev)

# Nombre del archivo de backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/backup_${DB_NAME}_$TIMESTAMP.sql"

echo "Iniciando backup de la base de datos: $DB_NAME..."

# Ejecutar pg_dump
# Nota: Asume que pg_dump está instalado y que la contraseña está en DATABASE_URL o manejada por .pgpass
pg_dump $DATABASE_URL > $FILENAME

if [ $? -eq 0 ]; then
    echo "Backup completado exitosamente: $FILENAME"
    # Mantener solo los últimos 7 días de backups
    find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
    echo "Limpieza de backups antiguos (más de 7 días) completada."
else
    echo "Error al crear el backup."
    exit 1
fi
