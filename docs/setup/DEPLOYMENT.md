# Manual de Despliegue - Coopetraes App

Este documento proporciona una guía completa para el despliegue, mantenimiento y monitoreo de la aplicación Coopetraes en entornos de producción.

---

## Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Métodos de Despliegue](#métodos-de-despliegue)
3. [Configuración de Producción](#configuración-de-producción)
4. [Estrategia de Backups](#estrategia-de-backups)
5. [Configuración SSL/HTTPS](#configuración-sslhttps)
6. [Monitoreo y Logs](#monitoreo-y-logs)
7. [Actualizaciones y Mantenimiento](#actualizaciones-y-mantenimiento)
8. [Troubleshooting](#troubleshooting)

---

## Requisitos del Sistema

### Hardware Mínimo (Producción)

- **CPU**: 2 cores
- **RAM**: 4GB (recomendado 8GB)
- **Disco**: 20GB SSD (recomendado 50GB)
- **Red**: Conexión estable a Internet

### Software

- **Sistema Operativo**: Ubuntu 20.04 LTS o superior (recomendado)
- **Node.js**: v18.x o superior
- **PostgreSQL**: v14 o superior
- **Docker**: v20.10+ y Docker Compose v2.0+ (para despliegue con contenedores)
- **Nginx**: v1.18+ (para proxy reverso)

---

## Métodos de Despliegue

### Opción 1: Despliegue con Docker (Recomendado)

El método más simple y reproducible.

#### 1.1 Preparación

```bash
# Clonar el repositorio
git clone <repository-url> coopetraes-app
cd coopetraes-app

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con valores de producción
```

#### 1.2 Configurar `.env` para Producción

```env
# Base de Datos (usar el servicio de PostgreSQL del docker-compose)
DATABASE_URL="postgresql://coopetraes:SECURE_PASSWORD@postgres:5432/coopetraes?schema=public"

# NextAuth
NEXTAUTH_SECRET="<generar-con-openssl-rand-base64-32>"
NEXTAUTH_URL="https://tu-dominio.com"

# Configuración
NODE_ENV=production
```

#### 1.3 Construir y Ejecutar

```bash
# Construir y levantar los contenedores
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker-compose ps

# Ver logs
docker-compose logs -f app
```

#### 1.4 Ejecutar Migraciones

```bash
# Primera vez: ejecutar migraciones
docker-compose exec app npx prisma migrate deploy

# Ejecutar seed (opcional, solo primera vez)
docker-compose exec app npx prisma db seed
```

La aplicación estará disponible en `http://localhost:3000`

---

### Opción 2: Despliegue Tradicional (PM2)

Para servidores sin Docker.

#### 2.1 Instalación de Dependencias del Sistema

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar PM2 globalmente
sudo npm install -g pm2
```

#### 2.2 Configurar PostgreSQL

```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE coopetraes;
CREATE USER coopetraes WITH ENCRYPTED PASSWORD 'SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE coopetraes TO coopetraes;
\q
```

#### 2.3 Configurar la Aplicación

```bash
# Clonar repositorio
cd /var/www
sudo git clone <repository-url> coopetraes-app
cd coopetraes-app

# Dar permisos al usuario
sudo chown -R $USER:$USER /var/www/coopetraes-app

# Ejecutar script de instalación
./setup.sh

# Construir para producción
npm run build
```

#### 2.4 Configurar PM2

Crear archivo `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'coopetraes-app',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/coopetraes-app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
```

Iniciar la aplicación:

```bash
# Crear directorio de logs
mkdir -p logs

# Iniciar con PM2
pm2 start ecosystem.config.js

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para iniciar al arranque del sistema
pm2 startup
# Ejecutar el comando que PM2 sugiere
```

---

## Configuración de Producción

### Variables de Entorno Críticas

```env
# OBLIGATORIAS
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="<secret-aleatorio-de-32-caracteres>"
NEXTAUTH_URL="https://tu-dominio.com"
NODE_ENV="production"

# OPCIONALES
PORT=3000
LOG_LEVEL="info"
```

### Generar NEXTAUTH_SECRET Seguro

```bash
openssl rand -base64 32
```

---

## Estrategia de Backups

### 1. Backup Automático de Base de Datos

#### Script de Backup (`/usr/local/bin/backup-coopetraes.sh`)

```bash
#!/bin/bash

# Configuración
BACKUP_DIR="/var/backups/coopetraes"
DB_NAME="coopetraes"
DB_USER="coopetraes"
DB_HOST="localhost"
RETENTION_DAYS=30

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Nombre del archivo con timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/coopetraes_backup_$TIMESTAMP.sql.gz"

# Realizar backup
PGPASSWORD="$DB_PASSWORD" pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

# Verificar que el backup se creó correctamente
if [ $? -eq 0 ]; then
    echo "Backup exitoso: $BACKUP_FILE"
    
    # Eliminar backups antiguos
    find $BACKUP_DIR -name "coopetraes_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "Backups antiguos eliminados (>$RETENTION_DAYS días)"
else
    echo "Error al crear backup"
    exit 1
fi
```

Hacer el script ejecutable:

```bash
sudo chmod +x /usr/local/bin/backup-coopetraes.sh
```

#### Configurar Cron para Backups Automáticos

```bash
# Editar crontab
sudo crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * DB_PASSWORD='SECURE_PASSWORD' /usr/local/bin/backup-coopetraes.sh >> /var/log/coopetraes-backup.log 2>&1
```

### 2. Backup de Archivos Subidos

```bash
#!/bin/bash

# Script para backup de archivos
UPLOAD_DIR="/var/www/coopetraes-app/public/uploads"
BACKUP_DIR="/var/backups/coopetraes/uploads"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

# Crear archivo tar.gz
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C "$UPLOAD_DIR" .

# Eliminar backups antiguos (>30 días)
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +30 -delete
```

### 3. Restauración de Backups

#### Restaurar Base de Datos

```bash
# Descomprimir y restaurar
gunzip -c /var/backups/coopetraes/coopetraes_backup_YYYYMMDD_HHMMSS.sql.gz | \
  PGPASSWORD="SECURE_PASSWORD" psql -h localhost -U coopetraes coopetraes
```

#### Restaurar Archivos

```bash
# Extraer archivos
tar -xzf /var/backups/coopetraes/uploads/uploads_YYYYMMDD_HHMMSS.tar.gz \
  -C /var/www/coopetraes-app/public/uploads/
```

---

## Configuración SSL/HTTPS

### Opción 1: Nginx + Let's Encrypt (Recomendado)

#### 1.1 Instalar Nginx y Certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

#### 1.2 Configurar Nginx como Proxy Reverso

Crear archivo `/etc/nginx/sites-available/coopetraes`:

```nginx
# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Configuración HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    # Certificados SSL (se configurarán con certbot)
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Tamaño máximo de subida
    client_max_body_size 50M;

    # Proxy a Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Optimización para archivos estáticos
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /var/log/nginx/coopetraes-access.log;
    error_log /var/log/nginx/coopetraes-error.log;
}
```

#### 1.3 Activar Configuración

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/coopetraes /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### 1.4 Obtener Certificado SSL

```bash
# Obtener certificado automáticamente
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

El certificado se renovará automáticamente cada 90 días.

---

## Monitoreo y Logs

### 1. Monitoreo con PM2

```bash
# Ver estado de procesos
pm2 status

# Ver logs en tiempo real
pm2 logs coopetraes-app

# Ver métricas de rendimiento
pm2 monit

# Ver información detallada
pm2 show coopetraes-app
```

### 2. Monitoreo con Docker

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f app

# Ver uso de recursos
docker stats
```

### 3. Healthchecks

Crear endpoint de health check en `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}
```

### 4. Configurar Alertas

Script de monitoreo (`/usr/local/bin/check-coopetraes.sh`):

```bash
#!/bin/bash

# Verificar que la aplicación responde
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)

if [ "$RESPONSE" != "200" ]; then
    echo "ALERTA: La aplicación no responde correctamente (HTTP $RESPONSE)"
    # Aquí puedes agregar notificación por email o Slack
    
    # Reiniciar aplicación si es necesario
    pm2 restart coopetraes-app
    # O con Docker:
    # docker-compose restart app
fi
```

Agregar a cron (cada 5 minutos):

```bash
*/5 * * * * /usr/local/bin/check-coopetraes.sh >> /var/log/coopetraes-health.log 2>&1
```

### 5. Rotación de Logs

Crear `/etc/logrotate.d/coopetraes`:

```text
/var/www/coopetraes-app/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/nginx/coopetraes-*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null
    endscript
}
```

---

## Actualizaciones y Mantenimiento

### Proceso de Actualización Segura

#### 1. Pre-actualización

```bash
# 1. Hacer backup completo
/usr/local/bin/backup-coopetraes.sh

# 2. Activar modo mantenimiento (si está implementado)
# Desde el panel de administración o:
# psql -c "UPDATE \"ConfiguracionGlobal\" SET \"modoMantenimiento\" = true;"
```

#### 2. Actualizar Código

```bash
# Navegar al directorio
cd /var/www/coopetraes-app

# Descargar cambios
git fetch origin

# Ver cambios
git log HEAD..origin/main --oneline

# Aplicar cambios
git pull origin main
```

#### 3. Actualizar Dependencias

```bash
# Instalar nuevas dependencias
npm install

# Verificar vulnerabilidades
npm audit
```

#### 4. Ejecutar Migraciones

```bash
# Ver migraciones pendientes
npx prisma migrate status

# Aplicar migraciones
npx prisma migrate deploy

# Regenerar cliente
npx prisma generate
```

#### 5. Reconstruir y Reiniciar

**Con PM2:**

```bash
# Reconstruir
npm run build

# Reiniciar sin downtime
pm2 reload coopetraes-app
```

**Con Docker:**

```bash
# Reconstruir y reiniciar
docker-compose up -d --build

# Verificar logs
docker-compose logs -f app
```

#### 6. Post-actualización

```bash
# Verificar que la aplicación funciona
curl http://localhost:3000/api/health

# Desactivar modo mantenimiento
# psql -c "UPDATE \"ConfiguracionGlobal\" SET \"modoMantenimiento\" = false;"

# Verificar logs por errores
pm2 logs --lines 100
# o
docker-compose logs --tail=100 app
```

### Rollback en Caso de Error

```bash
# Volver a la versión anterior
git reset --hard HEAD~1

# Restaurar base de datos
gunzip -c /var/backups/coopetraes/coopetraes_backup_LATEST.sql.gz | \
  PGPASSWORD="PASSWORD" psql -h localhost -U coopetraes coopetraes

# Reconstruir y reiniciar
npm run build
pm2 reload coopetraes-app
```

---

## Troubleshooting

### Problema: La aplicación no inicia

**Síntomas**: Error al ejecutar `npm start` o PM2 muestra estado "errored"

**Soluciones**:

1. Verificar logs:

   ```bash
   pm2 logs coopetraes-app --lines 50
   ```

2. Verificar variables de entorno:

   ```bash
   cat .env
   ```

3. Verificar conexión a base de datos:

   ```bash
   PGPASSWORD="password" psql -h localhost -U coopetraes -d coopetraes -c "SELECT 1;"
   ```

4. Regenerar Prisma Client:

   ```bash
   npx prisma generate
   ```

### Problema: Error 502 Bad Gateway (Nginx)

**Causas comunes**:

- La aplicación Next.js no está corriendo
- Puerto incorrecto en configuración de Nginx
- Firewall bloqueando conexión

**Soluciones**:

1. Verificar que Next.js está corriendo:

   ```bash
   pm2 status
   curl http://localhost:3000
   ```

2. Verificar configuración de Nginx:

   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. Revisar logs de Nginx:

   ```bash
   sudo tail -f /var/log/nginx/coopetraes-error.log
   ```

### Problema: Base de datos lenta

**Síntomas**: Consultas tardan mucho tiempo

**Soluciones**:

1. Verificar índices en Prisma schema
2. Analizar queries lentas:

   ```sql
   -- Habilitar logging de queries lentas
   ALTER DATABASE coopetraes SET log_min_duration_statement = 1000;
   
   -- Ver queries activas
   SELECT pid, now() - query_start as duration, query 
   FROM pg_stat_activity 
   WHERE state = 'active' 
   ORDER BY duration DESC;
   ```

3. Ejecutar VACUUM:

   ```bash
   psql -U coopetraes -d coopetraes -c "VACUUM ANALYZE;"
   ```

### Problema: Espacio en disco lleno

**Soluciones**:

1. Verificar uso de disco:

   ```bash
   df -h
   du -sh /var/www/coopetraes-app/*
   ```

2. Limpiar logs antiguos:

   ```bash
   pm2 flush
   sudo journalctl --vacuum-time=7d
   ```

3. Limpiar backups antiguos:

   ```bash
   find /var/backups/coopetraes -mtime +30 -delete
   ```

4. Limpiar Docker (si aplica):

   ```bash
   docker system prune -a
   ```

### Problema: Certificado SSL expirado

**Soluciones**:

1. Renovar manualmente:

   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

2. Verificar renovación automática:

   ```bash
   sudo systemctl status certbot.timer
   ```

---

## Checklist de Despliegue

- [ ] Servidor configurado con requisitos mínimos
- [ ] PostgreSQL instalado y configurado
- [ ] Variables de entorno configuradas en `.env`
- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos migrada (`prisma migrate deploy`)
- [ ] Aplicación construida (`npm run build`)
- [ ] PM2/Docker configurado y corriendo
- [ ] Nginx instalado y configurado
- [ ] Certificado SSL obtenido e instalado
- [ ] Backups automáticos configurados (cron)
- [ ] Monitoreo y healthchecks activos
- [ ] Rotación de logs configurada
- [ ] Firewall configurado (puertos 80, 443 abiertos)
- [ ] DNS apuntando al servidor
- [ ] Pruebas de funcionalidad realizadas
- [ ] Documentación de credenciales guardada de forma segura

---

## Contacto y Soporte

Para soporte técnico o consultas sobre el despliegue, contactar al equipo de desarrollo.

**Versión del documento**: 1.0  
**Última actualización**: Enero 2026
