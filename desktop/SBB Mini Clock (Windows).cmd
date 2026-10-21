@echo off
rem Starts the SBB mini clock (see sbb-mini-windows.ps1)
start "" powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -WindowStyle Hidden -File "%~dp0sbb-mini-windows.ps1"
