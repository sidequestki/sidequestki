@echo off
cd /d "%~dp0"
echo ==============================================
echo   Pushing Sidequestki updates to GitHub...
echo ==============================================
git add .
git commit -m "update: latest changes"
git push origin main
echo.
echo ==============================================
echo   Done! All updates are live on GitHub!
echo ==============================================
pause
