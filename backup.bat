@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
%GIT% init
%GIT% config user.name "Agent Backup"
%GIT% config user.email "agent@example.com"
%GIT% add .
%GIT% commit -m "Backup current Phase 5"
%GIT% branch -M main
%GIT% remote add origin https://github.com/drealmruvjain5/swatijain.git
%GIT% push -u origin main
