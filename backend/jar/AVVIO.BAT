@echo off

start cmd /c "cd ..\..\frontend && npm install && npm start"

rem Elimina il file webApp-0.0.1-SNAPSHOT.jar se esiste
cd ..\jar
if exist webApp-0.0.1-SNAPSHOT.jar (
    del webApp-0.0.1-SNAPSHOT.jar
    echo File webApp-0.0.1-SNAPSHOT.jar eliminato.
) else (
    echo File webApp-0.0.1-SNAPSHOT.jar non trovato.
)

rem Torna alla directory principale e esegui mvn clean package
cd ..\
call mvn clean package
if %errorlevel% neq 0 (
    echo Errore durante mvn clean package
    pause
    exit /b %errorlevel%
)

echo "mvn clean package completato"
cd .\jar
java -jar webApp-0.0.1-SNAPSHOT.jar

pause
