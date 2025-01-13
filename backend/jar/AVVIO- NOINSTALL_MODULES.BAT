@echo off

rem Elimina il file activityManager-1.0.jar se esiste
cd ..\jar
if exist activityManager-1.0.jar (
    del activityManager-1.0.jar
    echo File activityManager-1.0.jar eliminato.
) else (
    echo File activityManager-1.0.jar non trovato.
)

rem Torna alla directory principale e esegui mvn clean package
cd ..\
REM Punto 1: Esegui il comando Maven
call mvn clean package
if %errorlevel% neq 0 (
    echo Errore durante mvn clean package
    pause
    goto end
)

REM Punto 2: Conferma completamento del comando Maven
echo "mvn clean package completato"

REM Punto 3: Apri una nuova console per npm start
start cmd /k "cd ..\frontend && npm start"
start cmd /k "cd ..\backend\jar && java -jar activityManager-1.5.jar

pause

:end
REM Mantieni aperta la console corrente
echo "Script completato."


