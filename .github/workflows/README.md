# GitHub Actions CI/CD

Este directorio contiene los workflows de GitHub Actions para el proyecto Coopetraes Smart Fleet.

## 📋 Workflows Disponibles

### `ci-cd.yml` - Pipeline Principal

Pipeline completo de integración y despliegue continuo.

#### Triggers
- **Push** a `main` o `develop`
- **Pull Requests** hacia `main` o `develop`

#### Jobs

1. **Code Quality** 🎨
   - ESLint
   - TypeScript Check
   - Prettier formatting check

2. **Security Audit** 🔒
   - npm audit (nivel high)
   - Continúa aunque falle (para no bloquear el pipeline)

3. **Tests** 🧪
   - Ejecuta suite de tests con Vitest
   - Usa base de datos de prueba

4. **Build** 🏗️
   - Compila la aplicación Next.js
   - Sube artifacts para deployment
   - Solo se ejecuta si quality y tests pasan

5. **Deploy to Staging** 🚀
   - Solo en push a `main`
   - Descarga build artifacts
   - Despliega a ambiente de staging
   - **Nota:** Requiere configuración de secrets

6. **Notify** 📢
   - Reporta resultados de todos los jobs
   - Siempre se ejecuta

## 🔧 Configuración Requerida

### Secrets de GitHub

Para que el pipeline funcione completamente, configura estos secrets en GitHub:

```
Settings → Secrets and variables → Actions → New repository secret
```

**Secrets necesarios:**
- `STAGING_HOST` - Host del servidor de staging
- `STAGING_USER` - Usuario SSH para deployment
- `STAGING_SSH_KEY` - Llave SSH privada
- `DATABASE_URL_STAGING` - URL de base de datos de staging

### Variables de Entorno

Las siguientes variables se configuran automáticamente:
- `NODE_VERSION`: 20.x
- `DATABASE_URL`: (dummy para build)
- `AUTH_SECRET`: (dummy para build)

## 📊 Estado del Pipeline

Puedes ver el estado del pipeline en:
- Badge en README.md
- Tab "Actions" en GitHub
- Checks en Pull Requests

## 🚀 Uso

### Para Desarrolladores

1. **Crear Pull Request:**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   git commit -m "feat: nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```
   El pipeline se ejecutará automáticamente.

2. **Merge a main:**
   - El pipeline ejecutará todos los checks
   - Si pasa, desplegará automáticamente a staging

### Para Administradores

**Despliegue Manual:**
```
Actions → CI/CD Pipeline → Run workflow → Select branch
```

**Ver Logs:**
```
Actions → Select workflow run → Select job → View logs
```

## 🔍 Troubleshooting

### Build Falla

1. Verifica que todas las dependencias estén en `package.json`
2. Asegúrate de que `npm run build` funciona localmente
3. Revisa los logs del job "Build"

### Tests Fallan

1. Ejecuta `npm test` localmente
2. Verifica que la base de datos de prueba esté configurada
3. Revisa los logs del job "Tests"

### Deploy Falla

1. Verifica que los secrets estén configurados
2. Confirma acceso SSH al servidor de staging
3. Revisa permisos de archivos en el servidor

## 📝 Mejoras Futuras

- [ ] Agregar cobertura de tests
- [ ] Implementar deployment a producción
- [ ] Agregar notificaciones (Slack, Discord)
- [ ] Implementar rollback automático
- [ ] Agregar smoke tests post-deployment
