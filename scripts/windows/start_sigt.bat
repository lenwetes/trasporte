@echo off
:: Script de Arranque para Sistema SIGT
:: Este archivo debe ser llamado por el lanzador VBS u ejecutado manualmente.

:: 1. Navegar al directorio del proyecto (AJUSTAR ESTA RUTA EN DEPLOYMENT)
:: Use %~dp0 para referirse a la ruta donde está este script, y subir dos niveles
:: Si el script esta en C:\App\scripts\windows\, sube a C:\App\
pushd "%~dp0..\.."

echo Guardando log de arranque en %cd%\startup_log.txt
echo [%DATE% %TIME%] Iniciando Sistema SIGT... >> startup_log.txt

:: 2. Verificar variables de entorno minimas
if not exist .env (
    echo [ERROR] No se encuentra el archivo .env >> startup_log.txt
    exit /b 1
)

:: 3. Iniciar la aplicacion Next.js en produccion
:: Se usa call para asegurar que el bat no termine prematuramente si npm es otro bat
call npm start >> startup_log.txt 2>&1

:: Si npm start falla o termina
echo [%DATE% %TIME%] El servidor se ha detenido. >> startup_log.txt
popd
