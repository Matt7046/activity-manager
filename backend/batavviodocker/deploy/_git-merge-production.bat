@echo off
rem Flusso: assicurati modifiche su main, poi merge in production e push.
setlocal
call "%~dp0_load-config.bat"

cd /d "%REPO_ROOT%"
if errorlevel 1 exit /b 1

echo.
echo === GIT: stato ===
git status -sb
echo.

if /i not "%DEPLOY_GIT_MERGE%"=="1" (
  echo [SKIP] DEPLOY_GIT_MERGE!=1 — nessun merge.
  exit /b 0
)

rem Se ci sono modifiche non committate, avvisa (non auto-commit)
git diff --quiet
set "DIRTY=%errorlevel%"
git diff --cached --quiet
if errorlevel 1 set "DIRTY=1"
if not "%DIRTY%"=="0" (
  echo [ERRORE] Working tree sporca. Committa su main prima del deploy.
  git status -sb
  exit /b 1
)

echo [1/4] Checkout main + pull...
git checkout main
if errorlevel 1 exit /b 1
git pull origin main
if errorlevel 1 exit /b 1

echo [2/4] Checkout production + pull...
git checkout production
if errorlevel 1 exit /b 1
git pull origin production
if errorlevel 1 exit /b 1

echo [3/4] Merge main -^> production...
git merge main -m "Merge branch 'main' into production"
if errorlevel 1 (
  echo Merge fallito — risolvi i conflitti e rilancia.
  exit /b 1
)

if /i "%DEPLOY_GIT_PUSH%"=="1" (
  echo [4/4] Push origin production...
  git push origin production
  if errorlevel 1 exit /b 1
) else (
  echo [4/4] SKIP push ^(DEPLOY_GIT_PUSH!=1^)
)

echo [OK] production aggiornata da main.
exit /b 0
