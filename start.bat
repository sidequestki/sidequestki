@echo off
echo ========================================================
echo   Launching Sidequestki Local Server
echo ========================================================
echo.
echo Opening http://localhost:8000 in your browser...
start http://localhost:8000
echo Server is running! Press Ctrl+C in this window to stop it.
python -m http.server 8000
