# Coopetraes - Sistema de Gestión de Transporte

Sistema web integral para la gestión operativa, financiera y legal de la cooperativa de transporte **Coopetraes**.

## 🚀 Stack Tecnológico

- **Frontend**: React 18+ con Next.js 15 (App Router)
- **Styling**: Vanilla CSS & Tailwind CSS (Zenith Indigo/Emerald Design System)
- **Icons**: Lucide React
- **Backend**: Next.js Server Actions y API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Validation**: Zod (Strict Validation)
- **PDF Generation**: @react-pdf/renderer (Generación legal de FUEC)
- **File Storage**: Sistema local administrado en `/storage/`

## 📋 Características Principales

### ✅ Estructura y UI/UX
- **Arquitectura Modular**: Código desacoplado siguiendo principios de responsabilidad única.
- **Diseño Premium**: Interfaz moderna, responsiva y orientada a la eficiencia operativa (Semáforos e Indicadores).
- **Control de Navegación**: Persistencia de estados y pestañas mediante URL SearchParams.

### ✅ Gestión de Flota y Conductores
- **Expediente Digital**: Centralización de documentos críticos (SOAT, Tecno, Licencias) con alertas de vencimiento automáticas.
- **Semáforo PESV**: Visualización analítica del estado de cumplimiento de la flota (Verde/Amarillo/Rojo).
- **Bloqueo Operativo**: Sistema de restricción manual y automática por incumplimiento documental o financiero.

### ✅ Módulo Legal (FUEC)
- **Emisión Automatizada**: Generación de FUEC inmutable con numeración de 21 dígitos (Resolución 6652).
- **Validación Estricta**: Control cruzado de vigencia documental y saldos financieros antes de emitir.
- **Documento Oficial**: PDF con logos institucionales, firmas digitales y código QR de validación pública.
- **Persistencia de Assets**: Restauración automática de logos institucionales vía Seeds para garantizar disponibilidad en cualquier entorno.

### ✅ Módulo Financiero
- **Contabilidad Base**: Integración completa con el Plan Único de Cuentas (PUC Colombia).
- **Gestión de Cartera**: Control de saldos y descuentos automáticos por servicios prestados a conductores.
- **Transacciones**: Registro auditable de ingresos, egresos y notas contables.

### ✅ Seguridad Vial
- **Inspección Preoperacional**: Registro digital de estados mecánicos y de seguridad.
- **Gestión de Incidencias**: Módulo unificado para siniestros, infracciones y novedades de conducta.

## 🔧 Configuración Inicial

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/coopetraes"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Instalación y Despliegue
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
npx prisma migrate dev
npx prisma generate

### 3. Poblar datos y restaurar assets (Logos FUEC)
```bash
npx prisma db seed
```

> **🔑 Credenciales Iniciales (Admin):**
> - **Usuario:** `admin@admin.com`
> - **Contraseña:** `admin`
> *(Se recomienda cambiar la contraseña inmediatamente después del primer ingreso)*

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```

## 📁 Arquitectura del Proyecto
```
/src
├── actions/      # Lógica de servidor (Server Actions)
├── app/          # Capa de presentación y ruteo (App Router)
├── components/   # UI Library (Atoms, Molecules, Organisms)
├── hooks/        # Lógica de UI reutilizable
├── lib/          # Utilidades, validaciones y clientes (Prisma)
├── services/     # Capa lógicas de negocio (Business Intelligence)
└── types/        # Tipado estricto (TypeScript)
```

## 📚 Documentación Técnica
Para una guía detallada sobre la arquitectura, el despliegue y manuales de usuario, consulta nuestro:
**[Centro de Documentación Unificado](./docs/README.md)**

## 🔧 Comandos de Mantenimiento
- **Verificar Tipado**: `npx tsc --noEmit`
- **Ejecutar Pruebas**: `npm test`
- **Explorar Datos**: `npx prisma studio`

## 📄 Licencia
Proyecto privado exclusivo para **Coopetraes**. Todos los derechos reservados.
