@echo off
REM Script de inicio rapido para MIA Admin API (Spring Boot + JWT + JPA)
setlocal

set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo ========================================================
echo   Iniciando MIA Admin API (Spring Boot 3.3.4 / Java 21)
echo ========================================================
echo   - URL del Dashboard: http://localhost:8080/
echo   - Documentacion Swagger: http://localhost:8080/swagger-ui.html
echo   - Base de Datos: MySQL (mia_db) en localhost:3306
echo   - Usuario Admin: admin / admin123
echo   - Usuario Dev:   developer / dev123
echo ========================================================

call mvnw.cmd spring-boot:run
pause
