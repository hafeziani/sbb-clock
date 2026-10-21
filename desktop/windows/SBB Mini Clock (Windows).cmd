@echo off
rem Double-click to start the SBB mini clock (see sbb-mini-windows.ps1). Right-click the clock and choose Quit to close it.
rem start ""                     : launch PowerShell and return at once, so this console window closes by itself
rem -NoProfile                   : don't load the user's PowerShell profile (faster, and nothing in it can interfere)
rem -ExecutionPolicy Bypass      : allow this one unsigned script to run without changing the PC's settings
rem -STA                         : the window code (WPF) needs a single-threaded apartment
rem -WindowStyle Hidden          : no PowerShell console next to the clock
rem %~dp0                        : the folder this .cmd file is in
start "" powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -WindowStyle Hidden -File "%~dp0sbb-mini-windows.ps1"
