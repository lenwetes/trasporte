# 🔐 Guía de Configuración de CI/CD

Esta guía te ayudará a configurar GitHub Secrets y activar el pipeline de CI/CD para Coopetraes Smart Fleet.

---

## 📋 PASO 1: Configurar GitHub Secrets

### Acceder a la Configuración de Secrets

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

### Secrets Requeridos

#### 1. `STAGING_HOST`
**Descripción:** Dirección IP o dominio del servidor de staging

**Ejemplo:**
```
staging.coopetraes.com
```
o
```
192.168.1.100
```

**Cómo obtenerlo:**
- Pregunta a tu proveedor de hosting
- O ejecuta `hostname -I` en tu servidor

---

#### 2. `STAGING_USER`
**Descripción:** Usuario SSH para conectarse al servidor

**Ejemplo:**
```
deploy
```
o
```
ubuntu
```

**Cómo obtenerlo:**
- Usuario que creaste para deployment
- Generalmente es `deploy`, `ubuntu`, o `root`

---

#### 3. `STAGING_SSH_KEY`
**Descripción:** Llave SSH privada para autenticación

**Cómo generarla:**

```bash
# En tu máquina local
ssh-keygen -t ed25519 -C "github-actions@coopetraes.com" -f ~/.ssh/coopetraes_deploy

# Esto genera dos archivos:
# - coopetraes_deploy (privada) ← Esta va al secret
# - coopetraes_deploy.pub (pública) ← Esta va al servidor
```

**Copiar la llave privada:**
```bash
cat ~/.ssh/coopetraes_deploy
```

**Copiar TODO el contenido** (incluyendo `-----BEGIN` y `-----END`)

**Agregar llave pública al servidor:**
```bash
# En el servidor de staging
ssh user@staging-server
mkdir -p ~/.ssh
echo "CONTENIDO_DE_coopetraes_deploy.pub" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

#### 4. `DATABASE_URL_STAGING`
**Descripción:** URL de conexión a la base de datos de staging

**Formato:**
```
postgresql://usuario:contraseña@host:puerto/nombre_db
```

**Ejemplo:**
```
postgresql://coopetraes_user:mi_password_seguro@localhost:5432/coopetraes_staging
```

**Componentes:**
- `usuario`: Usuario de PostgreSQL
- `contraseña`: Contraseña del usuario
- `host`: Dirección del servidor DB (generalmente `localhost`)
- `puerto`: Puerto de PostgreSQL (generalmente `5432`)
- `nombre_db`: Nombre de la base de datos

---

### Crear los Secrets en GitHub

Para cada secret:

1. Click en **New repository secret**
2. **Name:** Nombre del secret (ej: `STAGING_HOST`)
3. **Secret:** Valor del secret
4. Click en **Add secret**

Repite para los 4 secrets.

---

## 📋 PASO 2: Configurar el Servidor de Staging

### Requisitos del Servidor

- **OS:** Ubuntu 20.04+ o similar
- **Node.js:** 20.x
- **PostgreSQL:** 14+
- **Espacio:** Mínimo 2GB libre
- **RAM:** Mínimo 2GB

### Instalación de Dependencias

```bash
# Conectarse al servidor
ssh user@staging-server

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe mostrar v20.x
npm --version

# Instalar PostgreSQL (si no está instalado)
sudo apt install -y postgresql postgresql-contrib

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2
```

### Crear Directorio de Deployment

```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www/coopetraes
sudo chown -R $USER:$USER /var/www/coopetraes
cd /var/www/coopetraes
```

### Configurar PostgreSQL

```bash
# Conectarse a PostgreSQL
sudo -u postgres psql

# Crear usuario y base de datos
CREATE USER coopetraes_user WITH PASSWORD 'mi_password_seguro';
CREATE DATABASE coopetraes_staging OWNER coopetraes_user;
GRANT ALL PRIVILEGES ON DATABASE coopetraes_staging TO coopetraes_user;
\q
```

### Crear Archivo .env en el Servidor

```bash
cd /var/www/coopetraes
nano .env
```

Contenido del `.env`:
```env
DATABASE_URL="postgresql://coopetraes_user:mi_password_seguro@localhost:5432/coopetraes_staging"
AUTH_SECRET="genera-un-secret-aleatorio-aqui"
AUTH_TRUST_HOST=true
NODE_ENV=production
```

Generar AUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## 📋 PASO 3: Actualizar el Workflow de Deployment

Edita `.github/workflows/ci-cd.yml` y reemplaza la sección de deployment:

```yaml
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: staging
      url: https://staging.coopetraes.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-artifacts
          path: .next

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.STAGING_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.STAGING_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to server
        run: |
          # Sync files to server
          rsync -avz --delete \
            -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
            --exclude node_modules \
            --exclude .git \
            --exclude .env \
            ./ ${{ secrets.STAGING_USER }}@${{ secrets.STAGING_HOST }}:/var/www/coopetraes/

      - name: Install dependencies and restart
        run: |
          ssh -i ~/.ssh/deploy_key ${{ secrets.STAGING_USER }}@${{ secrets.STAGING_HOST }} << 'EOF'
            cd /var/www/coopetraes
            npm ci --omit=dev
            npx prisma generate
            npx prisma migrate deploy
            pm2 restart coopetraes || pm2 start npm --name coopetraes -- start
          EOF

      - name: Verify deployment
        run: |
          sleep 5
          curl -f http://${{ secrets.STAGING_HOST }}:3000/api/health || exit 1
```

---

## 📋 PASO 4: Activar el CI/CD

### Hacer Push al Repositorio

```bash
# En tu máquina local
git add .
git commit -m "feat: configure CI/CD pipeline"
git push origin main
```

### Verificar el Pipeline

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Deberías ver el workflow ejecutándose
4. Click en el workflow para ver los detalles

### Estados del Pipeline

- **🟡 Amarillo (Running):** En ejecución
- **🟢 Verde (Success):** Completado exitosamente
- **🔴 Rojo (Failed):** Falló (revisa los logs)

---

## 📋 PASO 5: Configurar Monitoring

### Crear Script de Monitoring

Crea `scripts/start-monitoring.ts`:

```typescript
import { MonitoringService } from "@/lib/services/monitoring.service";
import logger from "@/lib/logger";

// Start monitoring
const interval = MonitoringService.startMonitoring((health) => {
    if (!health || health.status === "unhealthy") {
        logger.error("CRITICAL: System is unhealthy!");
        // Aquí puedes agregar notificaciones (email, Slack, etc.)
    }
});

// Log metrics every 5 minutes
setInterval(() => {
    MonitoringService.logMetrics();
}, 5 * 60 * 1000);

// Graceful shutdown
process.on("SIGTERM", () => {
    if (interval) {
        MonitoringService.stopMonitoring(interval);
    }
    process.exit(0);
});

logger.info("Monitoring service started");
```

### Agregar al package.json

```json
{
  "scripts": {
    "monitor": "tsx scripts/start-monitoring.ts"
  }
}
```

### Ejecutar en Producción

```bash
# Opción 1: Con PM2
pm2 start npm --name coopetraes-monitor -- run monitor

# Opción 2: En el mismo proceso (agregar a tu startup)
# Importar y ejecutar en tu server.ts o similar
```

---

## 🧪 PASO 6: Probar el Sistema

### Probar Health Check

```bash
# Local
curl http://localhost:3000/api/health

# Staging
curl http://staging.coopetraes.com/api/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-10T...",
  "uptime": 3600,
  "checks": {
    "database": { "status": "up", "responseTime": 15 },
    "cache": { "status": "up", "type": "memory" }
  },
  "version": "0.1.0",
  "environment": "production"
}
```

### Probar CI/CD

1. Haz un cambio pequeño en el código
2. Commit y push a `main`
3. Verifica que el pipeline se ejecute
4. Verifica que el deployment funcione
5. Verifica que la aplicación esté corriendo

---

## 🔍 Troubleshooting

### Error: "Permission denied (publickey)"

**Solución:**
```bash
# Verificar que la llave pública esté en el servidor
ssh user@staging-server
cat ~/.ssh/authorized_keys
# Debe contener el contenido de coopetraes_deploy.pub
```

### Error: "Database connection failed"

**Solución:**
```bash
# Verificar DATABASE_URL en el servidor
cat /var/www/coopetraes/.env
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql
```

### Error: "Build artifacts not found"

**Solución:**
- Verifica que el job "build" se complete exitosamente
- Revisa los logs del job "build"
- Asegúrate de que `.next` se genere correctamente

### Pipeline no se ejecuta

**Solución:**
- Verifica que el archivo esté en `.github/workflows/`
- Verifica que el YAML sea válido
- Verifica que hayas hecho push a `main` o `develop`

---

## ✅ Checklist de Configuración

- [ ] Secrets de GitHub configurados (4/4)
- [ ] Servidor de staging preparado
- [ ] PostgreSQL instalado y configurado
- [ ] Node.js 20.x instalado
- [ ] PM2 instalado
- [ ] Directorio `/var/www/coopetraes` creado
- [ ] Archivo `.env` configurado en servidor
- [ ] SSH keys configuradas
- [ ] Workflow actualizado con deployment real
- [ ] Push a main realizado
- [ ] Pipeline ejecutándose correctamente
- [ ] Health check respondiendo
- [ ] Monitoring configurado

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs del pipeline** en GitHub Actions
2. **Revisa los logs del servidor:**
   ```bash
   pm2 logs coopetraes
   ```
3. **Revisa los logs de PostgreSQL:**
   ```bash
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

---

**Última actualización:** 2026-02-10  
**Versión:** 1.0
