@echo off
rem Elimina il file .jar esistente (se necessario)
cd ..\jar
if exist activityManager-1.0.jar (
    del activityManager-1.0.jar
    echo File activityManager-1.0.jar eliminato.
) else (
    echo File activityManager-1.0.jar non trovato.
)

rem Torna alla directory principale e esegui mvn clean install
cd ..\
echo Eseguendo mvn clean install...
call mvn clean install
if %errorlevel% neq 0 (
    echo Errore durante mvn clean install.
    pause
    goto end
)
echo mvn clean install completato.

rem Esegui Docker Compose
echo Avvio dei container con Docker Compose...
call docker-compose up --build
if %errorlevel% neq 0 (
    echo Errore durante docker-compose up --build.
    pause
    goto end
)

:end
echo Script completato.
pause
