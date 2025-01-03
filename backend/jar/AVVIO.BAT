@echo off

start cmd /c "cd ..\..\frontend && npm install && npm start"

rem Elimina il file activityManager-1.5.jar se esiste
cd ..\jar
if exist activityManager-1.5.jar (
    del activityManager-1.5.jar
    echo File activityManager-1.5.jar eliminato.
) else (
    echo File activityManager-1.5.jar non trovato.
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
java -jar activityManager-1.5.jar

pause
