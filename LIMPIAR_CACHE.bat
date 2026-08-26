@echo off
SETLOCAL EnableDelayedExpansion
title Coopetraes Smart Fleet - Limpiando Cache...
COLOR 0B
chcp 65001 >nul 2>&1

cd /d "%~dp0"

echo.
echo  +==================================================+
echo  ^|      COOPETRAES SMART FLEET - LIMPIEZA DE CACHE  ^|
echo  +==================================================+
echo.

if not exist "logs" mkdir "logs"

:: [1/3] Limpiar cache Redis via script TypeScript (si existe)
echo  [1/3] Limpiando cache Redis del servidor...
if exist "scripts\clear-cache.ts" (
    call npx tsx scripts\clear-cache.ts >> "logs\cache.log" 2>&1
    if errorlevel 1 (
        echo       AVISO: No se pudo limpiar Redis. Puede que el servidor no este activo.
        echo              Los datos persistidos en BD siguen siendo validos.
    ) else (
        echo       OK - Cache Redis limpiado.
    )
) else (
    echo       AVISO: Script clear-cache.ts no encontrado. Saltando limpieza Redis.
)

:: [2/3] Limpiar cache Next.js (.next/cache)
echo  [2/3] Limpiando cache de compilacion Next.js...
if exist ".next\cache" (
    rmdir /s /q ".next\cache" >nul 2>&1
    if errorlevel 1 (
        echo       AVISO: No se pudo limpiar .next\cache ^(puede estar en uso^).
        echo              Detener el sistema con DETENER_SISTEMA.bat e intentar de nuevo.
    ) else (
        echo       OK - Cache Next.js limpiado. El proximo arranque recompilara paginas.
    )
) else (
    echo       OK - No existe cache de Next.js ^(ya esta limpio^).
)

:: [3/3] Limpiar logs obsoletos (mas de 7 dias) via forfiles
echo  [3/3] Limpiando logs antiguos ^(+7 dias^)...
if exist "logs" (
    forfiles /p "logs" /m "*.log" /d -7 /c "cmd /c del @path >nul 2>&1" 2>nul
    echo       OK - Logs antiguos depurados.
) else (
    echo       OK - Carpeta logs no existe, nada que limpiar.
)

echo.
echo  +==================================================+
echo  ^|   [OK]  LIMPIEZA COMPLETADA                     ^|
echo  ^|   Si el sistema esta corriendo, los datos        ^|
echo  ^|   se actualizaran en la proxima consulta.        ^|
echo  +==================================================+
echo.
echo  Presiona cualquier tecla para salir...
pause >nul
