# MIA Admin API - Spring Boot JPA con Autenticación JWT y Dashboard de Proyectos

Sistema backend empresarial desarrollado en **Java 21** y **Spring Boot 3.3.4**, con persistencia en **JPA / Hibernate**, seguridad robusta mediante **Spring Security 6 y JSON Web Tokens (JJWT 0.12.6)**, y un catálogo interactivo con motor de búsqueda y métricas para el **Dashboard de Proyectos**.

---

## 🚀 Características Principales

1. **Autenticación y Autorización JWT:**
   - Registro de usuarios con validaciones y encriptación de contraseñas con **BCrypt**.
   - Inicio de sesión con generación de tokens **JWT Bearer (HMAC-SHA256)** con expiración configurable (24 horas).
   - Filtro de seguridad `JwtAuthenticationFilter` por petición HTTP (`OncePerRequestFilter`).
   - Endpoint `/api/auth/me` para consulta de perfil y roles del usuario autenticado.

2. **Búsqueda y Gestión de Proyectos en el Dashboard:**
   - Búsqueda por texto predictivo y libre en título, subtítulo, descripción, equipo y etiquetas.
   - Filtros dinámicos mediante **JPA Specification**:
     - Por categoría: `corporativo`, `web`, `api`, `finanzas`, `operaciones`, `rrhh`, `seguridad`, `soporte`.
     - Por ambiente: `PROD`, `STAGE`, `DEV`.
     - Por estado: `active`, `maintenance`, `offline`.
     - Por favoritos: Proyectos marcados como favoritos por el usuario.
   - Paginación y ordenamiento configurable (`popular`, `recent`, `name`, dirección `asc`/`desc`).
   - Endpoint de métricas ejecutivas `/api/projects/dashboard/stats`: total de proyectos, activos, en mantenimiento, favoritos y conteo por categoría/entorno.
   - Operaciones CRUD completas y marcado rápido de favoritos (`PATCH /api/projects/{id}/favorite`).

3. **Gestión de Roles (Tabla `roles`):**
   - Entidad JPA `Role` con persistencia en base de datos (`id`, `name`, `description`, `createdAt`).
   - Endpoints CRUD completos en `/api/roles` para listar, crear, modificar y eliminar roles dinámicamente.
   - Formateo automático de nombres con convención de prefijo `ROLE_`.

4. **Entidad Company y Gestión de Empresas (Tabla `companies`):**
   - Entidad JPA `Company` (`id`, `name`, `taxId`, `address`, `phone`, `email`, `website`, `logoUrl`, `active`, timestamps).
   - Endpoints CRUD completos en `/api/companies` (`GET`, `POST`, `PUT`, `DELETE`).
   - Cada usuario está asociado **exclusivamente a una empresa** (`@ManyToOne` / `company_id`), permitiendo multi-inquilino o pertenencia corporativa única.

5. **Asignación Múltiple de Roles y Proyectos a Usuarios:**
   - **Empresa (1:1 / N:1):** Cada usuario solo se asocia a **una sola empresa** (`company_id`). Endpoints: `PUT /api/users/{id}/company/{companyId}` y `DELETE /api/users/{id}/company`.
   - **Proyectos (N:M):** Cada usuario puede asociarse a **múltiples proyectos** a través de la tabla relacional `users_projects`. Endpoints: `PUT /api/users/{id}/projects`, `POST /api/users/{id}/projects/{projectId}`, `DELETE /api/users/{id}/projects/{projectId}`.
   - **Roles (N:M):** Cada usuario puede tener **múltiples roles** a través de la tabla relacional `users_roles`. Endpoint: `PUT /api/users/{id}/roles`.

6. **Dashboard Web Interactivo Integrado:**
   - Servido en `http://localhost:8080/` con diseño moderno oscuro y efectos glassmorphism.
   - Barra de estado de token JWT con botón de copia rápida al portapapeles.
   - Búsqueda en tiempo real con debounce, filtros por pastillas (pills) y tarjetas dinámicas de proyectos.
   - Botones de acceso rápido para pruebas inmediatas con credenciales de prueba.

7. **Documentación Swagger / OpenAPI 3:**
   - Interfaz interactiva en `http://localhost:8080/swagger-ui.html` con soporte nativo para `BearerAuth`.

8. **Base de Datos MySQL (`mia_db`):**
   - Conectado a **MySQL** en `localhost:3306` con la base de datos `mia_db`.
   - Tablas gestionadas: `companies`, `users`, `roles`, `projects`, `users_roles`, `users_projects`.
   - Soporte automático para testing con base de datos H2 en memoria (`test_mia_db`).

9. **Compatibilidad Total Frontend:**
   - CORS configurado para admitir clientes Angular (`http://localhost:4200`), React, Vue o cualquier origen en desarrollo.
   - Estructura de modelo 100% compatible con el frontend `admin-web`.

---

## 👥 Cuentas de Acceso Precargadas

| Usuario | Contraseña | Empresa Asignada | Roles Asignados | Proyectos Asignados | Nombre Completo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`admin`** | `admin123` | Seguros Universales S.A. | `ROLE_ADMIN`, `ROLE_USER` | 6 proyectos clave | Administrador Corporativo |
| **`developer`** | `dev123` | MIA Digital Technologies | `ROLE_DEVELOPER`, `ROLE_USER` | 8 proyectos (APIs y microservicios) | Carlos Ingeniero |
| **`analyst`** | `analyst123` | Seguros Universales S.A. | `ROLE_MANAGER`, `ROLE_USER` | 7 proyectos (Core, BI y Finanzas) | Sofía Consultora |

---

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** Java 21 (OpenJDK 21)
- **Framework:** Spring Boot 3.3.4
- **Seguridad:** Spring Security 6 & JJWT 0.12.6
- **Persistencia:** Spring Data JPA / Hibernate 6.5
- **Base de Datos Principal:** MySQL 8.x / MariaDB (`mia_db`)
- **Base de Datos de Pruebas:** H2 Database Engine (`test_mia_db`)
- **Documentación API:** SpringDoc OpenAPI 2.6.0 (Swagger UI)
- **Herramienta de Construcción:** Apache Maven con Maven Wrapper (`mvnw.cmd`)

---

## 📦 Estructura del Proyecto

```text
admin-api/
├── pom.xml
├── mvnw.cmd / mvnw
├── run.bat
├── src/
│   ├── main/
│   │   ├── java/com/mia/adminapi/
│   │   │   ├── AdminApiApplication.java
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── DataInitializer.java (precarga 26 proyectos y usuarios)
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── JwtService.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   └── ProjectController.java
│   │   │   ├── dto/
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── DashboardStatsResponse.java
│   │   │   │   ├── PagedResponse.java
│   │   │   │   ├── ProjectRequest.java
│   │   │   │   ├── ProjectResponse.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   └── UserDto.java
│   │   │   ├── entity/
│   │   │   │   ├── Project.java
│   │   │   │   ├── Role.java
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   ├── ProjectRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   └── service/
│   │   │       ├── AuthService.java
│   │   │       ├── ProjectService.java
│   │   │       └── UserDetailsServiceImpl.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── static/
│   │           ├── index.html (Dashboard Web interactivo)
│   │           ├── css/dashboard.css
│   │           └── js/dashboard.js
│   └── test/
│       └── java/com/mia/adminapi/
│           └── AdminApiApplicationTests.java
```

---

## ▶️ Ejecución del Proyecto

### Opción 1: Ejecución directa con el script rápido
Hacer doble clic en `run.bat` o ejecutar en terminal PowerShell / CMD:
```powershell
.\run.bat
```

### Opción 2: Con Maven Wrapper
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.2"
.\mvnw.cmd spring-boot:run
```

### Opción 3: Con el archivo JAR empaquetado
```powershell
& "C:\Program Files\Java\jdk-21.0.2\bin\java.exe" -jar target\admin-api-1.0.0.jar
```

---

## 🌐 URLs de Acceso (Contexto: `/admin-api/api`)

- **Dashboard Web interactivo:** [http://localhost:8080/admin-api/api/](http://localhost:8080/admin-api/api/)
- **Documentación Swagger UI:** [http://localhost:8080/admin-api/api/swagger-ui.html](http://localhost:8080/admin-api/api/swagger-ui.html)
- **Especificación OpenAPI (JSON):** [http://localhost:8080/admin-api/api/v3/api-docs](http://localhost:8080/admin-api/api/v3/api-docs)

---

## 📡 Ejemplos de Peticiones API (cURL / REST)

### 1. Iniciar Sesión (Login) y Obtener Token JWT
```bash
curl -X POST http://localhost:8080/admin-api/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "admin123"
  }'
```
**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJmdWxsTmFtZSI6IkFkbWluaXN0cmFkb3IgQ29ycG9yYXRpdm8iLCJyb2xlIjoiUk9MRV9BRE1JTiIsInVzZXJJZCI6MSwic3ViIjoiYWRtaW4iLCJpYXQiOjE3Mjk4NzY1NDMsImV4cCI6MTcyOTk2Mjk0M30...",
  "tokenType": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@universales.com",
  "fullName": "Administrador Corporativo",
  "role": "ROLE_ADMIN",
  "expiresIn": 86400000
}
```

### 2. Obtener Métricas Generales del Dashboard
```bash
curl -X GET http://localhost:8080/admin-api/api/projects/dashboard/stats \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```
**Respuesta:**
```json
{
  "totalProjects": 26,
  "activeProjects": 23,
  "maintenanceProjects": 2,
  "offlineProjects": 1,
  "favoritesCount": 7,
  "projectsByCategory": {
    "web": 4,
    "corporativo": 5,
    "api": 4,
    "finanzas": 5,
    "operaciones": 4,
    "seguridad": 3,
    "soporte": 1
  },
  "projectsByEnvironment": {
    "PROD": 22,
    "STAGE": 1,
    "DEV": 3
  }
}
```

### 3. Buscar y Filtrar Proyectos
```bash
curl -X GET "http://localhost:8080/admin-api/api/projects?search=Seguros&category=todos&environment=ALL&page=0&size=5" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### 4. Marcar / Desmarcar como Favorito
```bash
curl -X PATCH http://localhost:8080/admin-api/api/projects/proj-1/favorite \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### 5. Registrar un Nuevo Usuario (con Roles y Proyectos iniciales)
```bash
curl -X POST http://localhost:8080/admin-api/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "email": "nuevo@universales.com",
    "password": "Password123!",
    "fullName": "Juan Pérez",
    "roles": ["ROLE_USER", "ROLE_DEVELOPER"],
    "projectIds": ["proj-1", "proj-3"]
  }'
```

### 6. Gestión de Roles (Crear y Modificar)
```bash
# Crear un nuevo rol en la base de datos
curl -X POST http://localhost:8080/admin-api/api/roles \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ROLE_SUPERVISOR",
    "description": "Supervisor general de operaciones"
  }'

# Modificar un rol existente por su ID
curl -X PUT http://localhost:8080/admin-api/api/roles/6 \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ROLE_SUPERVISOR_OPERACIONES",
    "description": "Supervisor senior actualizado"
  }'

# Listar todos los roles
curl -X GET http://localhost:8080/admin-api/api/roles \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### 7. Asignar Múltiples Roles y Proyectos a un Usuario
```bash
# Asignar un conjunto de roles al usuario (ID 2)
curl -X PUT http://localhost:8080/admin-api/api/users/2/roles \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '["ROLE_DEVELOPER", "ROLE_USER", "ROLE_SUPERVISOR_OPERACIONES"]'

# Asignar un conjunto de proyectos al usuario (ID 2)
curl -X PUT http://localhost:8080/admin-api/api/users/2/projects \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '["proj-1", "proj-2", "proj-3", "proj-12"]'

# Consultar los proyectos asignados al usuario (ID 2)
curl -X GET http://localhost:8080/admin-api/api/users/2/projects \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### 8. Gestión de Empresas (Companies) y Asignación a Usuarios
```bash
# Listar todas las empresas
curl -X GET http://localhost:8080/admin-api/api/companies \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"

# Crear una nueva empresa
curl -X POST http://localhost:8080/admin-api/api/companies \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "InsurTech Global Corp",
    "taxId": "772190-K",
    "address": "Zona 14, Ciudad de Guatemala",
    "phone": "+502 2200-8888",
    "email": "info@insurtechglobal.com",
    "website": "https://insurtechglobal.com",
    "logoUrl": "https://ui-avatars.com/api/?name=InsurTech",
    "active": true
  }'

# Asignar una empresa a un usuario (un usuario solo puede tener una empresa)
curl -X PUT http://localhost:8080/admin-api/api/users/2/company/4 \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"

# Desasignar la empresa de un usuario
curl -X DELETE http://localhost:8080/admin-api/api/users/2/company \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

---

## 🧪 Pruebas Automatizadas

Para ejecutar las pruebas unitarias y de integración del proyecto:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.2"
.\mvnw.cmd test
```
Las pruebas cubren:
- Carga de contexto de Spring Boot.
- Protección y rechazo de peticiones sin token JWT (403 Forbidden).
- Autenticación, generación de JWT, búsqueda de proyectos y obtención de métricas con `MockMvc`.
