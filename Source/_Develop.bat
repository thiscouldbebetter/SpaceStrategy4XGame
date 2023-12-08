@echo off

cd ..

for %%i in (.) do set repositoryName=%%~nxi

cd Source

start notepad++ %repositoryName%.html

start chrome %cd%\%repositoryName%.html

rem Assuming we're running this from File Explorer:
start cmd /k echo To build, run: "cls & _Build.bat & type _BuildErrors.txt"

