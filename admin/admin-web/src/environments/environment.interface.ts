export interface ServicesEndpoints {
  // =========================================================================
  // SERVICIOS EXISTENTES ACTIVOS EN ADMIN-API
  // =========================================================================
  /** Servicio de autenticación JWT (/auth, login, register, me) */
  auth: string;

  /** Servicio de catálogo de proyectos (/projects, stats, filtros) */
  projects: string;

  /** Servicio de empresas asociadas (/companies) */
  companies: string;

  /** Servicio de administración de usuarios y asignación de proyectos (/users) */
  users: string;

  /** Servicio de gestión de roles y permisos (/roles) */
  roles: string;

  // =========================================================================
  // NUEVOS SERVICIOS PLANIFICADOS EN LA ARQUITECTURA MIA
  // =========================================================================
  /** Servicio de consulta de pólizas y asegurados (/policies) */
  policies: string;

  /** Servicio de auditoría, bitácora y trazabilidad de accesos (/audit) */
  audit: string;

  /** Servicio de analítica, generación de reportes y exportación (/reports) */
  reports: string;

  /** Servicio centralizado de alertas, webhooks y notificaciones (/notifications) */
  notifications: string;
}

export interface AppEnvironment {
  production: boolean;
  appName: string;
  appVersion: string;
  /** Contexto base de la aplicación web (ej. /admin-web) */
  contextPath: string;
  /** Endpoint base de admin-api (ej. http://localhost:8080/admin-api/api) */
  apiUrl: string;
  /** URLs específicas de cada microservicio / módulo */
  services: ServicesEndpoints;
}
