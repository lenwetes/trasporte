@echo off
SETLOCAL EnableDelayedExpansion
title Coopetraes Smart Fleet - Iniciando...
COLOR 0A
chcp 65001 >nul 2>&1

cd /d "%~dp0"

echo.
echo  +==================================================+
echo  ^|        COOPETRAES SMART FLEET - v2.0 PROD        ^|
echo  ^|              Sistema de Arranque                 ^|
echo  +==================================================+
echo.

:: Crear carpeta de logs si no existe
if not exist "logs" mkdir "logs"

:: [1/5] Verificar .env
echo  [1/5] Verificando configuracion de entorno...
if not exist ".env" (
    echo.
    echo  +==================================================+
    echo  ^|  ERROR: Archivo .env no encontrado.              ^|
    echo  ^|  Ejecuta INSTALAR_SISTEMA.bat para configurar.   ^|
    echo  +==================================================+
    pause >nul
    exit /b 1
)
echo        OK - Variables de entorno verificadas.

:: [2/5] Verificar dependencias
echo  [2/5] Verificando dependencias...
if not exist "node_modules" (
    echo        Instalando dependencias de produccion ^(puede tardar^)...
    call npm.cmd ci --omit=dev >> "logs\app.log" 2>&1
    if errorlevel 1 (
        echo        ERROR: Fallo la instalacion de dependencias.
        echo        Ultimas lineas del log:
        powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content 'logs\app.log' -Tail 15"
        pause >nul
        exit /b 1
    )
    echo        OK - Dependencias instaladas.
) else (
    echo        OK - node_modules verificado.
)

:: [3/5] Verificar Build de Produccion
echo  [3/5] Verificando build de produccion...
if not exist ".next" (
    echo        Build no encontrado. Compilando aplicacion...
    echo        AVISO: Esto puede tardar 3-8 minutos. Por favor espere.
    call npm.cmd run build >> "logs\app.log" 2>&1
    if errorlevel 1 (
        echo.
        echo        ERROR: Fallo la compilacion. Revisa logs\app.log para detalles.
        powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content 'logs\app.log' -Tail 20"
        pause >nul
        exit /b 1
    )
    echo        OK - Build completado.
) else (
    echo        OK - Build de produccion encontrado.
)

:: [4/5] Verificar si ya esta corriendo
echo  [4/5] Verificando estado del puerto 3000...

:: Usar PowerShell para obtener el PID del proceso en puerto 3000 (mas confiable en Win11)
for /f "tokens=*" %%p in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $c=(Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction Stop); $c.OwningProcess } catch { 'NONE' }"') do set "PORT_PID=%%p"

if not "!PORT_PID!"=="NONE" if defined PORT_PID (
    echo        Puerto 3000 ocupado ^(PID: !PORT_PID!^). Deteniendo instancia anterior...
    taskkill /F /PID !PORT_PID! >nul 2>&1
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -s 3"
    echo        OK - Instancia anterior detenida.
) else (
    echo        OK - Puerto 3000 disponible.
)

:: [5/5] Iniciar servidor en segundo plano via PowerShell (reemplaza wscript en Win11)
echo  [5/5] Iniciando servidor COOPETRAES en segundo plano...
echo        Log del servidor: %~dp0logs\app.log
echo.

powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command ^
  "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c npm.cmd start >> logs\app.log 2>&1' -WorkingDirectory '%~dp0.' -WindowStyle Hidden"

:: Esperar disponibilidad (max. 60 segundos)
echo  Esperando disponibilidad del sistema (max. 60 segundos)...
set /a intentos=0

:WAIT_LOOP
set /a intentos+=1
if %intentos% gtr 60 (
    echo.
    echo  AVISO: Tiempo de espera excedido.
    echo  Verifica el log: logs\app.log
    echo.
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content 'logs\app.log' -Tail 20"
    goto FIN
)
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -s 1"

:: Usar PowerShell para chequear el puerto (evita problemas de errorlevel con pipes en CMD)
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>&1
if errorlevel 1 (
    set /p "=." <nul
    goto WAIT_LOOP
)

echo.
echo.
echo  +==================================================+
echo  ^|   [OK]  SISTEMA INICIADO CORRECTAMENTE          ^|
echo  ^|   URL:  http://localhost:3000                   ^|
echo  ^|   Log:  logs\app.log                            ^|
echo  +==================================================+
echo.
start http://localhost:3000

:FIN
echo  Esta ventana se cerrara en 5 segundos...
echo  Para detener el sistema ejecuta: DETENER_SISTEMA.bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -s 5"
exit
