Option Explicit

' =======================================================
' background_runner.vbs -- Coopetraes Smart Fleet (PROD)
' NOTA: Este script se mantiene como fallback.
' INICIAR_SISTEMA.bat ya usa PowerShell directamente.
'
' Lanza "npm start" en segundo plano (ventana oculta).
' Captura stdout/stderr en logs\app.log
' =======================================================

Dim WshShell, fso, scriptDir, rootDir, logDir, logFile, cmd

Set WshShell = CreateObject("WScript.Shell")
Set fso      = CreateObject("Scripting.FileSystemObject")

' El .vbs vive en <root>\scripts\ -> sube un nivel al root
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
rootDir   = fso.GetParentFolderName(scriptDir)

' Crear carpeta de logs si no existe
logDir = rootDir & "\logs"
If Not fso.FolderExists(logDir) Then
    fso.CreateFolder(logDir)
End If

' Verificar .env antes de arrancar
If Not fso.FileExists(rootDir & "\.env") Then
    MsgBox "ERROR: No se encontro el archivo .env en:" & vbCrLf & rootDir & _
           vbCrLf & vbCrLf & "El sistema no puede iniciarse sin variables de entorno.", _
           16, "Coopetraes - Error de Configuracion"
    WScript.Quit 1
End If

' Verificar build de produccion
If Not fso.FolderExists(rootDir & "\.next") Then
    MsgBox "ERROR: No existe la carpeta .next (build de produccion)." & vbCrLf & _
           "Ejecute INSTALAR_SISTEMA.bat primero para compilar la aplicacion.", _
           16, "Coopetraes - Build No Encontrado"
    WScript.Quit 1
End If

' Ruta del log (escapada correctamente para CMD)
logFile = logDir & "\app.log"

' Construir el comando con rutas entre comillas dobles escapadas
' Usa PowerShell para iniciar el proceso en background (mas confiable en Windows 11)
cmd = "powershell.exe -NoProfile -WindowStyle Hidden -Command " & _
      """Start-Process -FilePath 'cmd.exe' " & _
      "-ArgumentList '/c npm start >> '" & logFile & "' 2>&1' " & _
      "-WorkingDirectory '" & rootDir & "' -WindowStyle Hidden"""

' 0 = ventana oculta, False = no esperar resultado
WshShell.Run cmd, 0, False

Set WshShell = Nothing
Set fso      = Nothing
