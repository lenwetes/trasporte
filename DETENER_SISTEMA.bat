@echo off
SETLOCAL EnableDelayedExpansion
title Coopetraes Smart Fleet - Deteniendo...
COLOR 0C
chcp 65001 >nul 2>&1

cd /d "%~dp0"

echo.
echo  +==================================================+
echo  ^|       COOPETRAES SMART FLEET - DETENER           ^|
echo  +==================================================+
echo.

:: Registrar evento de detencion en log
if not exist "logs" mkdir "logs"
echo [%DATE% %TIME%] Sistema detenido manualmente por el usuario. >> "logs\app.log"

:: Obtener PID del proceso escuchando en puerto 3000 via PowerShell (confiable en Win11)
echo  Buscando servicios activos en el puerto 3000...

for /f "tokens=*" %%p in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $c=(Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction Stop); $c.OwningProcess } catch { 'NONE' }"') do set "PORT_PID=%%p"

if "!PORT_PID!"=="NONE" (
    echo  INFO: No se encontraron servicios activos en el puerto 3000.
    goto NO_PROCESOS
)
if not defined PORT_PID (
    echo  INFO: No se encontraron servicios activos en el puerto 3000.
    goto NO_PROCESOS
)

echo  Terminando proceso PID: !PORT_PID!
taskkill /F /PID !PORT_PID! >nul 2>&1
if !errorlevel! equ 0 (
    echo  OK - Proceso !PORT_PID! terminado correctamente.
) else (
    echo  Fallback: terminando todos los procesos node.exe...
    taskkill /F /IM node.exe /T >nul 2>&1
)

:NO_PROCESOS
:: Limpiar procesos wscript/cscript huerfanos (por compatibilidad con versiones anteriores)
tasklist /FI "IMAGENAME eq wscript.exe" 2>nul | find "wscript.exe" >nul
if not errorlevel 1 (
    echo  Limpiando procesos wscript residuales...
    taskkill /F /IM wscript.exe /T >nul 2>&1
)

:: Verificacion final via PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -s 2"
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }" >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ADVERTENCIA: El puerto 3000 aun puede estar en uso.
    echo  Puede que necesites esperar unos segundos o reiniciar.
    echo  Comando manual: Get-NetTCPConnection -LocalPort 3000
) else (
    echo.
    echo  +==================================================+
    echo  ^|   [OK]  SISTEMA DETENIDO CORRECTAMENTE          ^|
    echo  ^|   Puerto 3000 liberado.                         ^|
    echo  +==================================================+
)

echo.
echo  Presiona cualquier tecla para salir...
pause >nul
