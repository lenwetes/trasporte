# 🔧 Scripts de Gestión del Sistema

Este directorio contiene scripts de utilidad para la gestión del sistema Coopetraes.

## 📜 Scripts Disponibles

### `INICIAR_SISTEMA.bat`
**Inicia el sistema en modo producción**

- ✅ Verifica dependencias
- 🧹 Limpia el caché automáticamente
- 🏗️ Compila si es necesario
- 🚀 Inicia el servidor en segundo plano
- 🌐 Abre el navegador automáticamente

**Uso:** Doble clic en el archivo

---

### `DETENER_SISTEMA.bat`
**Detiene todos los procesos de Node.js**

Útil para detener el servidor que se ejecuta en segundo plano.

**Uso:** Doble clic en el archivo

---

### `LIMPIAR_CACHE.bat`
**Limpia el caché del sistema manualmente**

Útil cuando:
- Has reiniciado la base de datos
- Los datos en el dashboard no se actualizan
- Necesitas forzar una recarga de datos

**Uso:** Doble clic en el archivo

---

## 🛠️ Scripts Técnicos (Carpeta `scripts/`)

### `clear-cache.ts`
Script TypeScript que limpia todos los tags de caché del sistema.

**Uso desde terminal:**
```bash
npx tsx scripts/clear-cache.ts
```

### `background_runner.vbs`
Script VBScript que ejecuta el servidor Node.js en modo oculto.

**Nota:** Este script es llamado automáticamente por `INICIAR_SISTEMA.bat`

---

## 🐛 Solución de Problemas

### El dashboard muestra datos antiguos después de reiniciar la DB
**Solución:** Ejecuta `LIMPIAR_CACHE.bat`

### El puerto 3000 ya está en uso
**Solución:** Ejecuta `DETENER_SISTEMA.bat` y luego `INICIAR_SISTEMA.bat`

### El sistema no inicia
1. Verifica que PostgreSQL esté ejecutándose
2. Revisa el archivo `.env`
3. Consulta los logs en `logs/app.log`
