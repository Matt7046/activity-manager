@echo off

rem Attendi 5 secondi prima di avviare il comando "npm start"
timeout /t 5 /nobreak > nul
start cmd /c "cd ..\demots && npm install && npm start"

rem Esegui mvn clean package
cd ..\
call mvn clean package
if %errorlevel% neq 0 (
    echo Errore durante mvn clean package
    pause
    exit /b %errorlevel%
)


echo "mvn clean package completato"
cd .\jar
java -jar webApp-0.0.1-SNAPSHOT.jar"

pause
