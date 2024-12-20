@echo off

rem Attendi 5 secondi prima di avviare il comando "npm start"
timeout /t 5 /nobreak > nul
start cmd /c "cd ..\demots && npm start"

rem Avvia l'applicazione Java in un'altra console
start cmd /c "java -jar webApp-0.0.1-SNAPSHOT.jar"

rem Mantieni aperta la finestra principale (opzionale)
pause
