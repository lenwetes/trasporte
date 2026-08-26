# 🚀 Inicio Rápido - Coopetraes

## Configuración Inicial (5 minutos)

### 1. Configurar Base de Datos

#### Opción A: PostgreSQL Local (Recomendado para producción)

```bash
# Editar .env y cambiar DATABASE_URL:
DATABASE_URL="postgresql://usuario:password@localhost:5432/coopetraes"
```

#### Opción B: Prisma Postgres (Ya configurado, ideal para desarrollo)

```bash
# Ya está configurado en .env, solo ejecutar:
npx prisma dev
```

### 2. Ejecutar Migraciones

```bash
# Crear tablas en la base de datos
npx prisma migrate dev --name init

# Generar Prisma Client
npx prisma generate

# Poblar datos de ejemplo
npx prisma db seed
```

### 3. Crear Directorio de Uploads

```bash
sudo mkdir -p /var/www/uploads
sudo chown -R $USER:$USER /var/www/uploads
sudo chmod -R 755 /var/www/uploads
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abrir: **<http://localhost:3000>**

---

## 🎯 Rutas Disponibles

- **`/`** - Landing page con demo
- **`/dashboard`** - Dashboard con sistema de semáforo
- **`/api/upload`** - API para subir archivos

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
npm start

# Ver base de datos (GUI)
npx prisma studio

# Reset completo de DB
npx prisma migrate reset

# Ver logs de Prisma
npx prisma db push --preview-feature
```

---

## 📊 Datos de Prueba

Después de ejecutar `npx prisma db seed`:

**Usuario Admin:**

- Email: `admin@coopetraes.com`
- Password: `CHANGE_ME`

**Vehículos de ejemplo:**

- `ABC123` - Toyota Hiace (Flota Propia)
- `XYZ789` - Chevrolet NPR (Convenio Externo)

---

## ✅ Verificar Instalación

1. ✅ Build exitoso: `npm run build`
2. ✅ Base de datos conectada: `npx prisma studio`
3. ✅ Servidor corriendo: `npm run dev`
4. ✅ Dashboard carga: `http://localhost:3000/dashboard`

---

## 🐛 Solución de Problemas

### Error: "DATABASE_URL not set"

```bash
# Verificar que existe .env en la raíz
cat .env

# Si no existe, crear:
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/coopetraes"' > .env
```

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# O usar Prisma Postgres:
npx prisma dev
```

### Error: "Permission denied /var/www/uploads"

```bash
# Dar permisos correctos
sudo chown -R $USER:$USER /var/www/uploads
sudo chmod -R 755 /var/www/uploads
```

### Error: "Prisma Client not generated"

```bash
# Regenerar cliente
npx prisma generate
```

---

## 📚 Documentación Completa

- **README.md** - Documentación completa del proyecto
- **IMPLEMENTATION_PLAN.md** - Plan de desarrollo por fases
- **RESUMEN.md** - Resumen de lo implementado

---

## 🎯 Próximos Pasos

1. ✅ Configurar base de datos
2. ✅ Ejecutar migraciones
3. ✅ Probar dashboard
4. ⏳ Implementar autenticación (Fase 2)
5. ⏳ Desarrollar CRUD completo (Fase 3)

---

**¿Todo listo?** Ejecuta `npm run dev` y visita `http://localhost:3000` 🚀
