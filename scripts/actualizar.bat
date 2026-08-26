@echo off
TITLE Actualizador SGIT Coopetraes
COLOR 0A

echo ========================================================
echo       ASISTENTE DE ACTUALIZACION - SGIT COOPETRAES
echo ========================================================
echo.
echo Este proceso actualizara el sistema a la ultima version disponible.
echo Se realizara una copia de seguridad de la base de datos antes de continuar.
echo.
echo [IMPORTANTE] Asegurate de haber detenido el sistema (Ctrl + C) antes de continuar.
echo.
pause

REM 1. BACKUP DE LA BASE DE DATOS
echo.
echo [PASO 1/5] Creando copia de seguridad de la base de datos...
if not exist "backups" mkdir backups

REM Obtener fecha y hora para el nombre del archivo (formato yyyyMMdd_HHmm)
set "fecha=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%"
set "fecha=%fecha: =0%"

REM Nota: Se asume que el usuario definió PGPASSWORD en las variables de entorno o el .pgpass, 
REM de lo contrario pedirá contraseña. Usamos el usuario 'postgres' y db 'coopetraes_db' por defecto de la guía.
REM Si pg_dump no está en el PATH, esto podría fallar, pero continuamos con advertencia.

pg_dump -U postgres -h localhost -p 5432 coopetraes_db > "backups/backup_auto_%fecha%.sql"

IF %ERRORLEVEL% NEQ 0 (
    COLOR 0E
    echo.
    echo [ADVERTENCIA] No se pudo realizar el backup automatico. 
    echo Verifique que postgres este corriendo y pg_dump este en el PATH.
    echo ¿Desea continuar de todos modos Riesgo de perdida de datos ?
    pause
    COLOR 0A
) ELSE (
    echo Backup exitoso: backups/backup_auto_%fecha%.sql
)

REM 2. ACTUALIZAR CODIGO (GIT)
echo.
echo [PASO 2/5] Descargando ultimas novedades...
git pull
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    echo.
    echo [ERROR] No se pudo descargar el codigo.
    echo Verifique su conexion a internet o si hay conflictos en los archivos locales.
    pause
    exit /b
)

REM 3. INSTALAR DEPENDENCIAS
echo.
echo [PASO 3/5] Actualizando librerias del sistema...
call npm install
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    echo [ERROR] Fallo la instalacion de dependencias.
    pause
    exit /b
)

REM 4. MIGRAR BASE DE DATOS
echo.
echo [PASO 4/5] Actualizando estructura de la base de datos...
call npx prisma migrate deploy
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    echo [ERROR] Fallo la migracion de la base de datos.
    pause
    exit /b
)

REM 5. CONSTRUIR APLICACION
echo.
echo [PASO 5/5] Optimizando el sistema (Esto puede tardar unos minutos)...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    echo [ERROR] Fallo la construccion de la aplicacion.
    pause
    exit /b
)

echo.
echo ========================================================
echo         ACTUALIZACION COMPLETADA EXITOSAMENTE
echo ========================================================
echo.
echo Ya puedes iniciar el sistema nuevamente con 'npm run start' o 'npm run dev'.
echo.
pause
