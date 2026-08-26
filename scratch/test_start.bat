powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c echo start-test >> logs/app.log' -WorkingDirectory '%cd%' -WindowStyle Hidden"
