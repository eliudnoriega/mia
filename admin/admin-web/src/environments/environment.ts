import { AppEnvironment } from './environment.interface';

// En entorno de producción se puede usar ruta relativa ante proxy corporativo o dominio institucional
const API_BASE = 'http://localhost:8080/admin-api/api';

export const environment: AppEnvironment = {
  production: true,
  appName: 'MIA Admin Portal',
  appVersion: '1.0.0',
  contextPath: '/admin-web',
  apiUrl: API_BASE,
  services: {
    // 1. Servicios Existentes en admin-api
    auth: `${API_BASE}/auth`,
    projects: `${API_BASE}/projects`,
    companies: `${API_BASE}/companies`,
    users: `${API_BASE}/users`,
    roles: `${API_BASE}/roles`,

    // 2. Nuevos Servicios Planificados
    policies: `${API_BASE}/policies`,
    audit: `${API_BASE}/audit`,
    reports: `${API_BASE}/reports`,
    notifications: `${API_BASE}/notifications`
  }
};
