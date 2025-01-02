@echo off

cd ..\
REM Punto 3: Apri una nuova console per npm start
start cmd /k "cd .\..\demots && npm start"
pause

:end
REM Mantieni aperta la console corrente
echo "Script completato."


