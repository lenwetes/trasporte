-- CreateEnum
CREATE TYPE "GravedadSiniestro" AS ENUM ('SOLO_DANOS', 'CON_HERIDOS', 'MORTAL');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CONDUCTOR', 'SECRETARIA', 'PROPIETARIO');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('FLOTA_PROPIA', 'CONVENIO_EXTERNO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CC', 'CE', 'PASAPORTE', 'NIT');

-- CreateEnum
CREATE TYPE "ClaseVehiculo" AS ENUM ('MICROBUS', 'CAMIONETA', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoNovedad" AS ENUM ('MULTA', 'COMPARENDO', 'FALLA_MECANICA', 'CONDUCTA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoNovedad" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'ANULADO');

-- CreateEnum
CREATE TYPE "EstadoAlerta" AS ENUM ('OK', 'POR_VENCER', 'VENCIDO');

-- CreateEnum
CREATE TYPE "AccionAudit" AS ENUM ('CREAR', 'ACTUALIZAR', 'ELIMINAR', 'LOGIN', 'LOGOUT', 'EXPORTAR');

-- CreateEnum
CREATE TYPE "FrecuenciaMantenimiento" AS ENUM ('KILOMETROS', 'TIEMPO', 'AMBOS');

-- CreateEnum
CREATE TYPE "EstadoOrdenServicio" AS ENUM ('PENDIENTE', 'EN_REVISION', 'COMPLETADA', 'RECHAZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoExamen" AS ENUM ('INGRESO', 'PERIODICO', 'EGRESO', 'POST_INCAPACIDAD');

-- CreateEnum
CREATE TYPE "ConceptoMedico" AS ENUM ('APTO', 'APTO_CON_RESTRICCION', 'NO_APTO');

-- CreateEnum
CREATE TYPE "EstadoPreoperacional" AS ENUM ('APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "NivelCriticidad" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "tipo_documento" "TipoDocumento" NOT NULL DEFAULT 'CC',
    "numero_documento" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),
    "lugar_nacimiento" TEXT,
    "estado_civil" TEXT,
    "direccion" TEXT,
    "municipio" TEXT DEFAULT 'Sincelejo',
    "telefono" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'CONDUCTOR',
    "id_foto_perfil" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "numero_licencia" TEXT,
    "ultimo_login" TIMESTAMP(3),
    "ultima_revision_simit" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'INFO',
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "vinculo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hojas_vida_usuarios" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "rh" TEXT,
    "eps" TEXT,
    "arl" TEXT,
    "fondo_pensiones" TEXT,
    "contacto_emergencia_nombre" TEXT,
    "contacto_emergencia_telefono" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fondo_cesantias" TEXT,
    "perfil_profesional" TEXT,

    CONSTRAINT "hojas_vida_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_licencias_usuarios" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "servicio" TEXT NOT NULL DEFAULT 'PARTICULAR',
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detalles_licencias_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiencia_laboral" (
    "id" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "jefe_inmediato" TEXT,
    "telefono_jefe" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "tiempo_laborado" TEXT,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiencia_laboral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referencias_personales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ocupacion" TEXT,
    "telefono" TEXT,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referencias_personales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificados_usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "institucion" TEXT,
    "fecha_emision" TIMESTAMP(3),
    "fecha_vencimiento" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,
    "archivo_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT DEFAULT 'OTRO',

    CONSTRAINT "certificados_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "propietario" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "anho" INTEGER,
    "capacidad_puestos" INTEGER,
    "cilindraje" TEXT,
    "clase" "ClaseVehiculo" NOT NULL DEFAULT 'OTRO',
    "color" TEXT,
    "lugar_expedicion" TEXT,
    "modelo" TEXT,
    "numero_chasis" TEXT,
    "numero_motor" TEXT,
    "peso" TEXT,
    "propietario_id" TEXT,
    "kilometraje_actual" INTEGER DEFAULT 0,
    "estado_alertas" "EstadoAlerta" NOT NULL DEFAULT 'OK',

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hojas_vida_vehiculos" (
    "id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "observaciones" TEXT,
    "ultima_revision" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hojas_vida_vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinculaciones" (
    "id" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vinculaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_vehiculo" (
    "id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "archivo_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "estado_alerta" "EstadoAlerta" NOT NULL DEFAULT 'OK',

    CONSTRAINT "documentos_vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repositorio_archivos" (
    "id" TEXT NOT NULL,
    "nombre_original" TEXT NOT NULL,
    "nombre_unico" TEXT NOT NULL,
    "ruta_absoluta" TEXT NOT NULL,
    "tipo_mime" TEXT NOT NULL,
    "tamano" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siniestro_id" TEXT,

    CONSTRAINT "repositorio_archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reglas_alertas" (
    "id" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "dias_anticipacion" INTEGER NOT NULL DEFAULT 30,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reglas_alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siniestros" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lugar" TEXT NOT NULL,
    "reporte_hechos" TEXT NOT NULL,
    "gravedad" "GravedadSiniestro" NOT NULL DEFAULT 'SOLO_DANOS',
    "conductor_id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siniestros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigaciones_siniestros" (
    "id" TEXT NOT NULL,
    "siniestro_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participantes" TEXT,
    "analisis_causas" TEXT NOT NULL,
    "plan_accion" TEXT NOT NULL,
    "conclusiones" TEXT NOT NULL,
    "dias_perdidos" INTEGER NOT NULL DEFAULT 0,
    "costo_estimado" DOUBLE PRECISION,

    CONSTRAINT "investigaciones_siniestros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "novedades" (
    "id" TEXT NOT NULL,
    "tipo" "TipoNovedad" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" DOUBLE PRECISION,
    "estado" "EstadoNovedad" NOT NULL DEFAULT 'PENDIENTE',
    "conductor_id" TEXT,
    "vehiculo_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "novedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_global" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "nombre_empresa" TEXT NOT NULL DEFAULT 'COOPETRAES',
    "logo_url" TEXT,
    "color_primario" TEXT DEFAULT '#10b981',
    "modulo_siniestros" BOOLEAN NOT NULL DEFAULT true,
    "modulo_reportes" BOOLEAN NOT NULL DEFAULT true,
    "modulo_conductores" BOOLEAN NOT NULL DEFAULT true,
    "smtp_host" TEXT,
    "smtp_port" INTEGER,
    "smtp_user" TEXT,
    "smtp_pass" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "direccion" TEXT,
    "email" TEXT,
    "logo_local_path" TEXT,
    "representante_legal" TEXT,
    "telefono" TEXT,
    "modo_mantenimiento" BOOLEAN NOT NULL DEFAULT false,
    "session_timeout" INTEGER NOT NULL DEFAULT 480,

    CONSTRAINT "configuracion_global_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "accion" "AccionAudit" NOT NULL,
    "entidad_tipo" TEXT NOT NULL,
    "entidad_id" TEXT,
    "detalles" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes_mantenimiento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "frecuencia" "FrecuenciaMantenimiento" NOT NULL DEFAULT 'KILOMETROS',
    "km_intervalo" INTEGER,
    "meses_intervalo" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_mantenimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mantenimientos_realizados" (
    "id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kilometraje" INTEGER NOT NULL,
    "costo" DOUBLE PRECISION,
    "observaciones" TEXT,
    "archivo_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "orden_servicio_id" TEXT,

    CONSTRAINT "mantenimientos_realizados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_servicio" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" TIMESTAMP(3),
    "estado" "EstadoOrdenServicio" NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "comprobante_id" TEXT,
    "kilometraje_reportado" INTEGER,
    "costo_reportado" DOUBLE PRECISION,
    "observaciones_conductor" TEXT,
    "fecha_comprobante" TIMESTAMP(3),
    "motivo_rechazo" TEXT,

    CONSTRAINT "ordenes_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examenes_medicos" (
    "id" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "tipo" "TipoExamen" NOT NULL,
    "fecha_realizacion" TIMESTAMP(3) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3),
    "entidad_medica" TEXT NOT NULL,
    "concepto" "ConceptoMedico" NOT NULL,
    "restricciones" TEXT,
    "archivo_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examenes_medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entregas_dotacion" (
    "id" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "fecha_entrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "items" JSONB NOT NULL,
    "observaciones" TEXT,
    "firma_digital" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entregas_dotacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preoperacionales" (
    "id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kilometraje" INTEGER NOT NULL,
    "resultado" "EstadoPreoperacional" NOT NULL,
    "observaciones" TEXT,
    "firma_digital" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preoperacionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_preoperacional" (
    "id" TEXT NOT NULL,
    "preoperacional_id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "criticidad" "NivelCriticidad" NOT NULL,
    "observacion" TEXT,

    CONSTRAINT "detalles_preoperacional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_numero_documento_key" ON "usuarios"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_id_foto_perfil_key" ON "usuarios"("id_foto_perfil");

-- CreateIndex
CREATE INDEX "usuarios_nombres_apellidos_idx" ON "usuarios"("nombres", "apellidos");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_activo_idx" ON "usuarios"("activo");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_idx" ON "notificaciones"("usuario_id");

-- CreateIndex
CREATE INDEX "notificaciones_leida_idx" ON "notificaciones"("leida");

-- CreateIndex
CREATE UNIQUE INDEX "hojas_vida_usuarios_usuario_id_key" ON "hojas_vida_usuarios"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_usuarios_archivo_id_key" ON "certificados_usuarios"("archivo_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- CreateIndex
CREATE INDEX "vehiculos_propietario_id_idx" ON "vehiculos"("propietario_id");

-- CreateIndex
CREATE INDEX "vehiculos_clase_idx" ON "vehiculos"("clase");

-- CreateIndex
CREATE INDEX "vehiculos_modalidad_idx" ON "vehiculos"("modalidad");

-- CreateIndex
CREATE INDEX "vehiculos_activo_idx" ON "vehiculos"("activo");

-- CreateIndex
CREATE INDEX "vehiculos_created_at_idx" ON "vehiculos"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "hojas_vida_vehiculos_vehiculo_id_key" ON "hojas_vida_vehiculos"("vehiculo_id");

-- CreateIndex
CREATE INDEX "vinculaciones_vehiculo_id_idx" ON "vinculaciones"("vehiculo_id");

-- CreateIndex
CREATE INDEX "vinculaciones_conductor_id_idx" ON "vinculaciones"("conductor_id");

-- CreateIndex
CREATE INDEX "vinculaciones_activo_idx" ON "vinculaciones"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "documentos_vehiculo_archivo_id_key" ON "documentos_vehiculo"("archivo_id");

-- CreateIndex
CREATE INDEX "documentos_vehiculo_vehiculo_id_idx" ON "documentos_vehiculo"("vehiculo_id");

-- CreateIndex
CREATE INDEX "documentos_vehiculo_fecha_vencimiento_idx" ON "documentos_vehiculo"("fecha_vencimiento");

-- CreateIndex
CREATE INDEX "documentos_vehiculo_tipo_idx" ON "documentos_vehiculo"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "repositorio_archivos_nombre_unico_key" ON "repositorio_archivos"("nombre_unico");

-- CreateIndex
CREATE UNIQUE INDEX "reglas_alertas_tipo_documento_key" ON "reglas_alertas"("tipo_documento");

-- CreateIndex
CREATE INDEX "siniestros_vehiculo_id_idx" ON "siniestros"("vehiculo_id");

-- CreateIndex
CREATE INDEX "siniestros_conductor_id_idx" ON "siniestros"("conductor_id");

-- CreateIndex
CREATE INDEX "siniestros_fecha_idx" ON "siniestros"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "investigaciones_siniestros_siniestro_id_key" ON "investigaciones_siniestros"("siniestro_id");

-- CreateIndex
CREATE INDEX "novedades_vehiculo_id_idx" ON "novedades"("vehiculo_id");

-- CreateIndex
CREATE INDEX "novedades_conductor_id_idx" ON "novedades"("conductor_id");

-- CreateIndex
CREATE INDEX "novedades_fecha_idx" ON "novedades"("fecha");

-- CreateIndex
CREATE INDEX "novedades_estado_idx" ON "novedades"("estado");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entidad_tipo_idx" ON "audit_logs"("entidad_tipo");

-- CreateIndex
CREATE UNIQUE INDEX "mantenimientos_realizados_archivo_id_key" ON "mantenimientos_realizados"("archivo_id");

-- CreateIndex
CREATE UNIQUE INDEX "mantenimientos_realizados_orden_servicio_id_key" ON "mantenimientos_realizados"("orden_servicio_id");

-- CreateIndex
CREATE INDEX "mantenimientos_realizados_vehiculo_id_idx" ON "mantenimientos_realizados"("vehiculo_id");

-- CreateIndex
CREATE INDEX "mantenimientos_realizados_plan_id_idx" ON "mantenimientos_realizados"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_servicio_codigo_key" ON "ordenes_servicio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_servicio_comprobante_id_key" ON "ordenes_servicio"("comprobante_id");

-- CreateIndex
CREATE UNIQUE INDEX "examenes_medicos_archivo_id_key" ON "examenes_medicos"("archivo_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_foto_perfil_fkey" FOREIGN KEY ("id_foto_perfil") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_vida_usuarios" ADD CONSTRAINT "hojas_vida_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_licencias_usuarios" ADD CONSTRAINT "detalles_licencias_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencia_laboral" ADD CONSTRAINT "experiencia_laboral_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias_personales" ADD CONSTRAINT "referencias_personales_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados_usuarios" ADD CONSTRAINT "certificados_usuarios_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados_usuarios" ADD CONSTRAINT "certificados_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_propietario_id_fkey" FOREIGN KEY ("propietario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hojas_vida_vehiculos" ADD CONSTRAINT "hojas_vida_vehiculos_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaciones" ADD CONSTRAINT "vinculaciones_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaciones" ADD CONSTRAINT "vinculaciones_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_vehiculo" ADD CONSTRAINT "documentos_vehiculo_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_vehiculo" ADD CONSTRAINT "documentos_vehiculo_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositorio_archivos" ADD CONSTRAINT "repositorio_archivos_siniestro_id_fkey" FOREIGN KEY ("siniestro_id") REFERENCES "siniestros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigaciones_siniestros" ADD CONSTRAINT "investigaciones_siniestros_siniestro_id_fkey" FOREIGN KEY ("siniestro_id") REFERENCES "siniestros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimientos_realizados" ADD CONSTRAINT "mantenimientos_realizados_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimientos_realizados" ADD CONSTRAINT "mantenimientos_realizados_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes_mantenimiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimientos_realizados" ADD CONSTRAINT "mantenimientos_realizados_orden_servicio_id_fkey" FOREIGN KEY ("orden_servicio_id") REFERENCES "ordenes_servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimientos_realizados" ADD CONSTRAINT "mantenimientos_realizados_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes_mantenimiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_comprobante_id_fkey" FOREIGN KEY ("comprobante_id") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examenes_medicos" ADD CONSTRAINT "examenes_medicos_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examenes_medicos" ADD CONSTRAINT "examenes_medicos_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_dotacion" ADD CONSTRAINT "entregas_dotacion_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preoperacionales" ADD CONSTRAINT "preoperacionales_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preoperacionales" ADD CONSTRAINT "preoperacionales_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_preoperacional" ADD CONSTRAINT "detalles_preoperacional_preoperacional_id_fkey" FOREIGN KEY ("preoperacional_id") REFERENCES "preoperacionales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
