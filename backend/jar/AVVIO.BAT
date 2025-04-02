@echo off


rem Torna alla directory principale e esegui mvn clean install
cd ..
cd ..
cd frontend

call docker rm -f frontend 
call docker build -t frontend:1.0.0 .
call docker run -d --name frontend --network backend_app-network -p 3000:80 frontend:1.0.0  
cd ..
cd backend
rem Avvia il backend eseguendo il JAR
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

REM Punto 2: Conferma completamento del comando Maven
echo "mvn clean install completato"
pause

:end
REM Mantieni aperta la console corrente
echo "Script completato."


