' Lanzador Oculto para Sistema SIGT
' Este script ejecuta el start_sigt.bat sin mostrar la ventana de consola.

Option Explicit
Dim WshShell, fso, scriptDir, targetPath

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Obtener la ruta del directorio donde está este script (.vbs)
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Construir la ruta al archivo .bat (se asume que está en la misma carpeta)
targetPath = scriptDir & "\start_sigt.bat"

' Verificar si el archivo existe
If Not fso.FileExists(targetPath) Then
    MsgBox "Error: No se encuentra el archivo de arranque: " & targetPath, 16, "Error de Inicio SIGT"
    WScript.Quit
End If

' Ejecutar oculto (0)
WshShell.Run chr(34) & targetPath & chr(34), 0, False

Set WshShell = Nothing
Set fso = Nothing
