@echo off
SETLOCAL EnableDelayedExpansion
title Coopetraes Smart Fleet - Asistente de Instalacion
chcp 65001 >nul 2>&1
COLOR 0A

cd /d "%~dp0"

:: ============================================================================
::  INSTALAR_SISTEMA.bat  -  Coopetraes Smart Fleet v2.0
::  Instalacion guiada completa para entorno de PRODUCCION
::  Autor: Agente AI Coopetraes | Fecha: 2026-04-11 (fix Windows 11)
:: ============================================================================

echo.
echo  +==================================================================+
echo  ^|                                                                  ^|
echo  ^|        COOPETRAES SMART FLEET - ASISTENTE DE INSTALACION        ^|
echo  ^|                        Produccion v2.0                          ^|
echo  ^|                                                                  ^|
echo  +==================================================================+
echo.
echo  Este asistente lo guiara paso a paso para instalar el sistema.
echo  Asegurese de tener acceso a internet antes de continuar.
echo.
echo  REQUISITOS PREVIOS:
echo    - Node.js v20 o superior  (https://nodejs.org)
echo    - PostgreSQL 14+          (base de datos)
echo    - Redis 7+                (cache - opcional pero recomendado)
echo.
pause

:: ============================================================================
::  PASO 0 - Verificar herramientas del sistema
:: ============================================================================
echo.
echo  ==========================================
echo   PASO 0 - Verificando herramientas
echo  ==========================================
echo.

:: Verificar Node
node --version >nul 2>&1
if errorlevel 1 (
    COLOR 0C
    echo  ERROR: Node.js no esta instalado o no esta en el PATH.
    echo     Descargalo desde: https://nodejs.org/en/download
    echo     Instala y vuelve a ejecutar este asistente.
    pause >nul
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo  OK - Node.js detectado: %NODE_VER%

:: Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    COLOR 0C
    echo  ERROR: npm no esta disponible.
    pause >nul
    exit /b 1
)
for /f "tokens=*" %%v in ('npm --version') do set NPM_VER=%%v
echo  OK - npm detectado: v%NPM_VER%

:: Verificar Git (opcional)
git --version >nul 2>&1
if errorlevel 1 (
    echo  AVISO: Git no encontrado. No se podran aplicar actualizaciones automaticas.
) else (
    for /f "tokens=*" %%v in ('git --version') do set GIT_VER=%%v
    echo  OK - Git detectado: %GIT_VER%
)

:: Verificar PostgreSQL CLI (opcional)
pg_dump --version >nul 2>&1
if errorlevel 1 (
    echo  AVISO: pg_dump no esta en el PATH. Los backups automaticos no funcionaran.
    echo     Agrega la carpeta bin de PostgreSQL al PATH del sistema.
) else (
    echo  OK - PostgreSQL CLI detectado.
)

echo.
echo  Verificacion completada. Continuando con la instalacion...
echo.
pause

:: ============================================================================
::  PASO 1 - Configurar variables de entorno (.env)
:: ============================================================================
echo.
echo  ==========================================
echo   PASO 1 - Configuracion de Entorno (.env)
echo  ==========================================
echo.

if exist ".env" (
    echo  Se encontro un archivo .env existente.
    echo.
    echo  Desea conservar la configuracion actual?
    echo    [S] Si, conservar mi .env actual
    echo    [N] No, crear uno nuevo desde la plantilla
    echo.
    set /p RESP_ENV="  Ingrese su opcion [S/N]: "
    if /i "!RESP_ENV!"=="N" goto :CREAR_ENV
    echo  OK - Conservando .env actual.
    goto :ENV_DONE
)

:CREAR_ENV
echo.
echo  Configurando el archivo de entorno de produccion...
echo  Por favor ingrese los datos de su servidor:
echo.

:: Base de Datos PostgreSQL
echo  --- BASE DE DATOS POSTGRESQL ---
set /p DB_HOST="  Host de la BD       [default: localhost]: "
if "!DB_HOST!"=="" set DB_HOST=localhost

set /p DB_PORT="  Puerto de la BD     [default: 5432]: "
if "!DB_PORT!"=="" set DB_PORT=5432

set /p DB_NAME="  Nombre de la BD     [default: coopetraes_db]: "
if "!DB_NAME!"=="" set DB_NAME=coopetraes_db

set /p DB_USER="  Usuario de la BD    [default: postgres]: "
if "!DB_USER!"=="" set DB_USER=postgres

set /p DB_PASS="  Contrasena de la BD: "

:: Auth Secret
echo.
echo  --- AUTENTICACION (NextAuth) ---
echo  Generando AUTH_SECRET aleatorio...
set /p AUTH_SECRET_INPUT="  Ingrese un AUTH_SECRET personalizado (o presione Enter para auto-generar): "
if "!AUTH_SECRET_INPUT!"=="" (
    set "AUTH_SECRET=coopetraes_%COMPUTERNAME%_%DATE:~6,4%%DATE:~3,2%%DATE:~0,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%"
) else (
    set "AUTH_SECRET=!AUTH_SECRET_INPUT!"
)

:: URL de la Aplicacion
echo.
echo  --- URL DE LA APLICACION ---
set /p APP_URL="  URL del servidor    [default: http://localhost:3000]: "
if "!APP_URL!"=="" set APP_URL=http://localhost:3000

:: Redis (opcional)
echo.
echo  --- REDIS (Cache - Opcional) ---
set /p REDIS_URL_INPUT="  URL de Redis        [default: redis://localhost:6379]: "
if "!REDIS_URL_INPUT!"=="" set REDIS_URL_INPUT=redis://localhost:6379

:: Construir DATABASE_URL
set "DATABASE_URL=postgresql://!DB_USER!:!DB_PASS!@!DB_HOST!:!DB_PORT!/!DB_NAME!?schema=public"

:: Escribir .env
echo  Generando archivo .env...

(
    echo # =============================================
    echo # Coopetraes Smart Fleet - Configuracion PROD
    echo # Generado por INSTALAR_SISTEMA.bat - %DATE% %TIME%
    echo # =============================================
    echo.
    echo # Base de Datos
    echo DATABASE_URL="!DATABASE_URL!"
    echo.
    echo # Autenticacion
    echo AUTH_SECRET="!AUTH_SECRET!"
    echo NEXTAUTH_URL="!APP_URL!"
    echo.
    echo # Cache Redis
    echo REDIS_URL="!REDIS_URL_INPUT!"
    echo.
    echo # Entorno
    echo NODE_ENV=production
    echo.
    echo # AWS S3 ^(DataLake - completar si se usa^)
    echo # AWS_ACCESS_KEY_ID=
    echo # AWS_SECRET_ACCESS_KEY=
    echo # AWS_REGION=us-east-1
    echo # AWS_S3_BUCKET_NAME=
) > ".env"

echo  OK - Archivo .env generado correctamente.

:ENV_DONE
echo.
pause

:: ============================================================================
::  PASO 2 - Instalar dependencias de produccion
:: ============================================================================
echo.
echo  ==========================================
echo   PASO 2 - Instalando Dependencias
echo  ==========================================
echo.
echo  Instalando paquetes de produccion (sin devDependencies)...
echo  Esto puede tardar varios minutos dependiendo de su conexion.
echo.

if not exist "logs" mkdir "logs"

:: NOTA: 'tee' no existe en CMD de Windows. Se redirige al log directamente.
call npm ci --omit=dev > "logs\install.log" 2>&1
if errorlevel 1 (
    COLOR 0C
    echo.
    echo  ERROR: Fallo la instalacion de dependencias.
    echo  Ultimas lineas del log:
    echo  ----------------------------------------
    powershell -Command "Get-Content 'logs\install.log' -Tail 20"
    echo  ----------------------------------------
    echo  Log completo en: logs\install.log
    pause >nul
    exit /b 1
)
echo.
echo  OK - Dependencias instaladas correctamente.
echo.
pause

:: ============================================================================
::  PASO 3 - Generar cliente de Prisma
:: ============================================================================
echo.
echo  ==========================================
echo   PASO 3 - Generando Cliente de Prisma
echo  ==========================================
echo.

call npx prisma generate > "logs\prisma_generate.log" 2>&1
if errorlevel 1 (
    COLOR 0C
    echo.
    echo  ERROR: Fallo la generacion del cliente Prisma.
    echo  Ultimas lineas del log:
    echo  ----------------------------------------
    powershell -Command "Get-Content 'logs\prisma_generate.log' -Tail 20"
    echo  ----------------------------------------
    echo  Log completo en: logs\prisma_generate.log
    pause >nul
    exit /b 1
)
echo.
echo  OK - Cliente Prisma generado.
echo.
pause

:: ============================================================================
::  PASO 4 - Migrar base de datos
:: ============================================================================
echo.
echo  ==========================================
echo   PASO 4 - Migracion de Base de Datos
echo  ==========================================
echo.
echo  Aplicando migraciones de Prisma a la base de datos...
echo  IMPORTANTE: Asegurese de que PostgreSQL este corriendo.
echo.

call npx prisma migrate deploy > "logs\migrate.log" 2>&1
if errorlevel 1 (
    COLOR 0E
    echo.
    echo  AVISO: Algunas migraciones fallaron o la BD no esta accesible.
    echo  Ultimas lineas del log:
    echo  ----------------------------------------
    powershell -Command "Get-Content 'logs\migrate.log' -Tail 20"
    echo  ----------------------------------------
    echo  Log completo en: logs\migrate.log
    echo.
    echo  Desea continuar de todos modos?
    set /p RESP_MIG="  Continuar [S/N]: "
    if /i "!RESP_MIG!" NEQ "S" (
        pause >nul
        exit /b 1
    )
    COLOR 0A
) else (
    echo.
    echo  OK - Migraciones aplicadas correctamente.
)
echo.
pause

:: ============================================================================
::  PASO 5 - Compilar aplicacion (Build de produccion)
:: ============================================================================
echo.
echo  ==========================================
echo   PASO 5 - Compilando la Aplicacion
echo  ==========================================
echo.
echo  Construyendo el bundle de produccion de Next.js...
echo  AVISO: Este proceso puede tardar entre 5 y 15 minutos.
echo         NO cierre esta ventana.
echo.

call npm run build > "logs\build.log" 2>&1
if errorlevel 1 (
    COLOR 0C
    echo.
    echo  ERROR CRITICO: Fallo la compilacion de la aplicacion.
    echo  Ultimas lineas del log:
    echo  ----------------------------------------
    powershell -Command "Get-Content 'logs\build.log' -Tail 30"
    echo  ----------------------------------------
    echo.
    echo  Log completo en: logs\build.log
    echo.
    echo  Causas comunes:
    echo    - Variables de entorno mal configuradas en .env
    echo    - Error de TypeScript en el codigo fuente
    echo    - Dependencia faltante
    pause >nul
    exit /b 1
)
echo.
echo  OK - Aplicacion compilada exitosamente.
echo.
pause

:: ============================================================================
::  MENSAJE FINAL
:: ============================================================================
COLOR 0A
echo.
echo  +==================================================================+
echo  ^|                                                                  ^|
echo  ^|   [OK]  INSTALACION COMPLETADA EXITOSAMENTE                     ^|
echo  ^|                                                                  ^|
echo  ^|   El sistema Coopetraes Smart Fleet esta listo para produccion.  ^|
echo  ^|                                                                  ^|
echo  ^|   PROXIMOS PASOS:                                                ^|
echo  ^|     1. Doble click en  INICIAR_SISTEMA.bat  para arrancar.       ^|
echo  ^|     2. El sistema abrira automaticamente el navegador.           ^|
echo  ^|     3. Para detener, ejecuta DETENER_SISTEMA.bat                 ^|
echo  ^|                                                                  ^|
echo  ^|   SCRIPTS DISPONIBLES:                                           ^|
echo  ^|     [>] INICIAR_SISTEMA.bat    - Arrancar el sistema             ^|
echo  ^|     [=] DETENER_SISTEMA.bat    - Detener el sistema              ^|
echo  ^|     [L] LIMPIAR_CACHE.bat      - Limpiar cache Redis y Next.js   ^|
echo  ^|                                                                  ^|
echo  ^|   Logs de instalacion guardados en:  logs\                       ^|
echo  ^|                                                                  ^|
echo  +==================================================================+
echo.

set /p ARRNQ="  Desea iniciar el sistema ahora? [S/N]: "
if /i "!ARRNQ!"=="S" (
    echo  Iniciando sistema...
    start "" "%~dp0INICIAR_SISTEMA.bat"
)

echo.
echo  Presiona cualquier tecla para salir...
pause >nul
