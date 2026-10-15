import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Company, Project, ProjectCategory, ProjectEnvironment, ProjectFilter } from '../models/project.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'mia_admin_projects_v1';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Public Web',
    subtitle: 'Public Web',
    description: 'Portal web corporativo institucional para consulta de productos y servicios generales.',
    category: 'web',
    categoryLabel: 'Portal Web',
    icon: 'cloud-web',
    iconBgColor: '#60a5fa',
    url: 'https://publicweb.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v3.4.1',
    team: 'Equipo Digital Web',
    uptime: '99.98%',
    lastDeploy: 'Hace 2 días',
    accessCount: 1420
  },
  {
    id: 'proj-2',
    title: 'Recursos Humanos',
    subtitle: 'Api De Recursos Humanos',
    description: 'Gestión de colaboradores, planillas, vacaciones y solicitudes administrativas internas.',
    category: 'rrhh',
    categoryLabel: 'Recursos Humanos',
    icon: 'handshake',
    iconBgColor: '#34d399',
    url: 'https://rrhh.mia.com.gt/api',
    isFavorite: true,
    status: 'active',
    environment: 'PROD',
    version: 'v2.1.0',
    team: 'Talento Humano TI',
    uptime: '99.95%',
    lastDeploy: 'Hace 5 días',
    accessCount: 890
  },
  {
    id: 'proj-3',
    title: 'Sgd',
    subtitle: 'Api Para Sgd',
    description: 'Sistema de Gestión Documental y archivo digital corporativo con firma electrónica.',
    category: 'api',
    categoryLabel: 'Gestión Documental',
    icon: 'browser-www',
    iconBgColor: '#38bdf8',
    url: 'https://sgd.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v4.0.2',
    team: 'Core Architecture',
    uptime: '100%',
    lastDeploy: 'Ayer',
    accessCount: 3120
  },
  {
    id: 'proj-4',
    title: 'Sistema Entrega De Cheques (Tablet)',
    subtitle: 'Sistema Que Se Usa En La Tablet Para Entrega De Cheques En...',
    description: 'Aplicación optimizada para tabletas para registro biométrico y entrega segura de cheques en ventanilla.',
    category: 'operaciones',
    categoryLabel: 'Operaciones',
    icon: 'tablet-check',
    iconBgColor: '#fbbf24',
    url: 'https://cheques-tablet.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v1.8.4',
    team: 'Operaciones y Caja',
    uptime: '99.90%',
    lastDeploy: 'Hace 1 semana',
    accessCount: 640
  },
  {
    id: 'proj-5',
    title: 'Sistema Gestión De Cartera',
    subtitle: 'Sistema De Cartera, Modulo Para Felicitación De...',
    description: 'Control y fidelización de cartera de clientes, recordatorios automáticos y seguimiento de primas.',
    category: 'finanzas',
    categoryLabel: 'Cartera y Clientes',
    icon: 'wallet-user',
    iconBgColor: '#818cf8',
    url: 'https://cartera.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.6.0',
    team: 'Créditos y Cobranzas',
    uptime: '99.85%',
    lastDeploy: 'Hace 3 días',
    accessCount: 1750
  },
  {
    id: 'proj-6',
    title: 'Uniaccess',
    subtitle: 'Sistema Administrativo De Accesos',
    description: 'Plataforma centralizada de autenticación SSO, control de permisos RBAC y auditoría de accesos.',
    category: 'seguridad',
    categoryLabel: 'Seguridad e Identidad',
    icon: 'security-lock',
    iconBgColor: '#2dd4bf',
    url: 'https://uniaccess.mia.com.gt',
    isFavorite: true,
    status: 'active',
    environment: 'PROD',
    version: 'v5.1.0',
    team: 'Ciberseguridad & DevOps',
    uptime: '100%',
    lastDeploy: 'Hoy',
    accessCount: 5410
  },
  {
    id: 'proj-7',
    title: 'Uni-ticket',
    subtitle: 'Sistema De Ticketing',
    description: 'Mesa de ayuda corporativa, seguimiento de incidentes de TI y soporte técnico a usuarios.',
    category: 'soporte',
    categoryLabel: 'Mesa de Ayuda',
    icon: 'ticket-support',
    iconBgColor: '#38bdf8',
    url: 'https://uniticket.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v3.2.1',
    team: 'Service Desk TI',
    uptime: '99.92%',
    lastDeploy: 'Hace 4 días',
    accessCount: 2280
  },
  {
    id: 'proj-8',
    title: 'Ventas',
    subtitle: 'App Ejecutivos',
    description: 'Módulo de prospección comercial, emisión ágil de cotizaciones y metas para ejecutivos de cuenta.',
    category: 'finanzas',
    categoryLabel: 'Fuerza Comercial',
    icon: 'sales-growth',
    iconBgColor: '#4ade80',
    url: 'https://ventas.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.9.3',
    team: 'Desarrollo Comercial',
    uptime: '99.97%',
    lastDeploy: 'Hace 1 día',
    accessCount: 3890
  },
  {
    id: 'proj-9',
    title: 'Consulta Póliza',
    subtitle: 'Módulo Consulta y Emisión',
    description: 'Consulta rápida de estados de cuenta, coberturas vigentes y descarga de certificados de póliza.',
    category: 'corporativo',
    categoryLabel: 'Pólizas',
    icon: 'shield-check',
    iconBgColor: '#0ea5e9',
    url: 'https://polizas.mia.com.gt',
    isFavorite: true,
    status: 'active',
    environment: 'PROD',
    version: 'v4.5.0',
    team: 'Equipo Emisión Seguros',
    uptime: '99.99%',
    lastDeploy: 'Hace 2 días',
    accessCount: 4120
  },
  {
    id: 'proj-10',
    title: 'MIA Core API',
    subtitle: 'Servicios de Integración Empresarial',
    description: 'Gateway de microservicios con endpoints REST y GraphQL para interoperabilidad de todas las apps.',
    category: 'api',
    categoryLabel: 'Infraestructura API',
    icon: 'cloud-web',
    iconBgColor: '#6366f1',
    url: 'https://api.mia.com.gt',
    isFavorite: true,
    status: 'active',
    environment: 'PROD',
    version: 'v3.0.0',
    team: 'Arquitectura Corporativa',
    uptime: '99.99%',
    lastDeploy: 'Hoy',
    accessCount: 9240
  },
  {
    id: 'proj-11',
    title: 'Facturación Electrónica DTE',
    subtitle: 'Emisión Tributaria y Enlace SAT',
    description: 'Generación, certificación y anulación de Documentos Tributarios Electrónicos con sello digital.',
    category: 'finanzas',
    categoryLabel: 'Tributario',
    icon: 'invoice',
    iconBgColor: '#10b981',
    url: 'https://dte.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.4.2',
    team: 'Contabilidad & Sistemas',
    uptime: '99.95%',
    lastDeploy: 'Hace 6 días',
    accessCount: 1980
  },
  {
    id: 'proj-12',
    title: 'Business Intelligence & KPIs',
    subtitle: 'Portal de Analítica y Reportería',
    description: 'Tableros interactivos PowerBI / Superset con métricas de siniestralidad, ventas y retención.',
    category: 'corporativo',
    categoryLabel: 'Analítica',
    icon: 'chart-bar',
    iconBgColor: '#f97316',
    url: 'https://bi.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v1.9.0',
    team: 'Data & Analytics',
    uptime: '99.90%',
    lastDeploy: 'Hace 3 días',
    accessCount: 1150
  },
  {
    id: 'proj-13',
    title: 'Portal de Proveedores',
    subtitle: 'Recepción y Programación de Pagos',
    description: 'Portal de autogestión para proveedores, carga de facturas electrónicas y consulta de retenciones.',
    category: 'finanzas',
    categoryLabel: 'Finanzas',
    icon: 'browser-www',
    iconBgColor: '#06b6d4',
    url: 'https://proveedores.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.2.0',
    team: 'Cuentas por Pagar',
    uptime: '99.88%',
    lastDeploy: 'Hace 1 semana',
    accessCount: 780
  },
  {
    id: 'proj-14',
    title: 'Control de Siniestros',
    subtitle: 'Gestión y Liquidación de Reclamos',
    description: 'Flujo de apertura, inspección en campo con geolocalización y liquidación de siniestros.',
    category: 'operaciones',
    categoryLabel: 'Operaciones',
    icon: 'shield-check',
    iconBgColor: '#ec4899',
    url: 'https://siniestros.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v3.1.5',
    team: 'Ajustadores y Reclamos',
    uptime: '99.96%',
    lastDeploy: 'Hace 4 días',
    accessCount: 2310
  },
  {
    id: 'proj-15',
    title: 'Cotizador Online',
    subtitle: 'Simulador Multirramo Web',
    description: 'Herramienta de cotización instantánea para seguros de auto, gastos médicos y vida individual.',
    category: 'web',
    categoryLabel: 'Portal Web',
    icon: 'browser-www',
    iconBgColor: '#8b5cf6',
    url: 'https://cotizador.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.8.0',
    team: 'Productos Masivos',
    uptime: '99.99%',
    lastDeploy: 'Hace 2 días',
    accessCount: 3450
  },
  {
    id: 'proj-16',
    title: 'App Móvil Asegurados',
    subtitle: 'Backoffice y API Mobile',
    description: 'Gestión de notificaciones push, carnets digitales y asistencia vial en ruta para usuarios móviles.',
    category: 'web',
    categoryLabel: 'Móvil',
    icon: 'tablet-check',
    iconBgColor: '#0ea5e9',
    url: 'https://app-api.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v4.1.2',
    team: 'Mobile Experience',
    uptime: '99.94%',
    lastDeploy: 'Hace 5 días',
    accessCount: 4800
  },
  {
    id: 'proj-17',
    title: 'Auditoría & Cumplimiento',
    subtitle: 'Seguridad y Logs Transaccionales',
    description: 'Registro forense de transacciones, cumplimiento de leyes de protección de datos y reportes IVE.',
    category: 'seguridad',
    categoryLabel: 'Seguridad e Identidad',
    icon: 'security-lock',
    iconBgColor: '#64748b',
    url: 'https://audit.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v1.5.0',
    team: 'Oficialía de Cumplimiento',
    uptime: '100%',
    lastDeploy: 'Hace 2 semanas',
    accessCount: 520
  },
  {
    id: 'proj-18',
    title: 'Gestión de Cobranzas',
    subtitle: 'Pasarelas de Pago Recurrente',
    description: 'Procesamiento de débitos automáticos en tarjetas de crédito y transferencias bancarias ACH.',
    category: 'finanzas',
    categoryLabel: 'Finanzas',
    icon: 'wallet-user',
    iconBgColor: '#14b8a6',
    url: 'https://cobranzas.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v3.3.0',
    team: 'Tesorería',
    uptime: '99.98%',
    lastDeploy: 'Hace 3 días',
    accessCount: 2190
  },
  {
    id: 'proj-19',
    title: 'Bóveda Digital',
    subtitle: 'Almacenamiento Criptográfico',
    description: 'Custodia segura de pólizas originales firmadas digitalmente con marcas de tiempo certificadas.',
    category: 'seguridad',
    categoryLabel: 'Seguridad e Identidad',
    icon: 'security-lock',
    iconBgColor: '#3b82f6',
    url: 'https://boveda.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.0.4',
    team: 'Legal & TI',
    uptime: '99.99%',
    lastDeploy: 'Hace 1 mes',
    accessCount: 670
  },
  {
    id: 'proj-20',
    title: 'Mesa de Servicio TI Staging',
    subtitle: 'Ambiente de Homologación Mesa TI',
    description: 'Entorno de pruebas y control de calidad para las nuevas versiones del sistema de tickets.',
    category: 'soporte',
    categoryLabel: 'Mesa de Ayuda',
    icon: 'ticket-support',
    iconBgColor: '#eab308',
    url: 'https://qa-tickets.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'STAGE',
    version: 'v3.3.0-rc1',
    team: 'QA Automation',
    uptime: '98.50%',
    lastDeploy: 'Ayer',
    accessCount: 340
  },
  {
    id: 'proj-21',
    title: 'Onboarding Biométrico',
    subtitle: 'Validación de Identidad y KYC',
    description: 'Verificación de DPI guatemalteco y reconocimiento facial con prueba de vida activa.',
    category: 'seguridad',
    categoryLabel: 'Seguridad e Identidad',
    icon: 'shield-check',
    iconBgColor: '#059669',
    url: 'https://kyc.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v1.4.1',
    team: 'Innovación & AI',
    uptime: '99.91%',
    lastDeploy: 'Hace 1 semana',
    accessCount: 1650
  },
  {
    id: 'proj-22',
    title: 'Control de Inventario TI',
    subtitle: 'Activos y Licenciamiento Microsoft',
    description: 'Gestión y asignación de computadoras, periféricos y licencias de software por departamento.',
    category: 'operaciones',
    categoryLabel: 'Operaciones',
    icon: 'tablet-check',
    iconBgColor: '#0284c7',
    url: 'https://inventario-ti.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.0.1',
    team: 'Soporte Técnico',
    uptime: '99.80%',
    lastDeploy: 'Hace 2 semanas',
    accessCount: 420
  },
  {
    id: 'proj-23',
    title: 'Gestor de Notificaciones',
    subtitle: 'Envío Masivo SMS, WhatsApp y Mail',
    description: 'Motor multicanal para envío transaccional de estados de cuenta y avisos importantes.',
    category: 'api',
    categoryLabel: 'Infraestructura API',
    icon: 'cloud-web',
    iconBgColor: '#7c3aed',
    url: 'https://notify.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.7.0',
    team: 'Canales Digitales',
    uptime: '99.99%',
    lastDeploy: 'Hace 3 días',
    accessCount: 8120
  },
  {
    id: 'proj-24',
    title: 'Portal del Corredor',
    subtitle: 'Gestión de Productores y Brokers',
    description: 'Plataforma para intermediarios independientes con descarga de estados de comisiones.',
    category: 'finanzas',
    categoryLabel: 'Fuerza Comercial',
    icon: 'sales-growth',
    iconBgColor: '#16a34a',
    url: 'https://corredores.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v3.5.0',
    team: 'Canal Intermediarios',
    uptime: '99.95%',
    lastDeploy: 'Hace 4 días',
    accessCount: 2900
  },
  {
    id: 'proj-25',
    title: 'Monitor de Salud Microservicios',
    subtitle: 'Telemetry & APM Datadog/Grafana',
    description: 'Monitoreo en tiempo real de latencia, tasa de error 5xx y consumo de pods en Kubernetes.',
    category: 'corporativo',
    categoryLabel: 'Infraestructura API',
    icon: 'browser-www',
    iconBgColor: '#f43f5e',
    url: 'https://telemetry.mia.com.gt',
    isFavorite: false,
    status: 'active',
    environment: 'PROD',
    version: 'v2.12.0',
    team: 'Site Reliability Engineering',
    uptime: '100%',
    lastDeploy: 'Hoy',
    accessCount: 1540
  },
  {
    id: 'proj-26',
    title: 'Plataforma de Capacitación',
    subtitle: 'Campus Virtual y Evaluaciones',
    description: 'Cursos internos sobre prevención de lavado de dinero, ciberseguridad y nuevos productos.',
    category: 'rrhh',
    categoryLabel: 'Recursos Humanos',
    icon: 'handshake',
    iconBgColor: '#d97706',
    url: 'https://campus.mia.com.gt',
    isFavorite: false,
    status: 'maintenance',
    environment: 'DEV',
    version: 'v1.1.0-beta',
    team: 'Capacitación y Desarrollo',
    uptime: '97.20%',
    lastDeploy: 'Hoy',
    accessCount: 310
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Endpoint base y URLs de servicios configurados desde environment
  readonly apiUrl = environment.apiUrl;
  readonly services = environment.services;

  private readonly _projects = signal<Project[]>(this.loadInitialProjects());

  // Estado de conexión y carga
  readonly isLoading = signal<boolean>(false);
  readonly isApiConnected = signal<boolean>(false);
  readonly apiError = signal<string | null>(null);

  // Usuario actual cuyos proyectos se están consultando (0 = Catálogo Completo / Admin)
  readonly selectedUserId = signal<number>(this.authService.isAdmin() ? 0 : (this.authService.currentUser()?.id ?? 1));

  // Empresas consumidas desde /api/companies
  readonly companies = signal<Company[]>([]);

  readonly filter = signal<ProjectFilter>({
    searchTerm: '',
    category: 'todos',
    environment: 'ALL',
    onlyFavorites: false,
    viewMode: 'grid',
    sortBy: 'name'
  });

  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = signal<number>(8);

  // Filtered projects computed
  readonly filteredProjects = computed(() => {
    let list = this._projects();
    const isAdmin = this.authService.isAdmin();
    const currentUser = this.authService.currentUser();

    // FILTRADO POR ROL:
    // Si el usuario es ADMIN, puede ver y filtrar TODOS los proyectos.
    // Si es CUALQUIER OTRO ROL, filtra estrictamente solo por los proyectos asignados al usuario.
    if (!isAdmin) {
      if (currentUser && Array.isArray(currentUser.projectIds)) {
        list = list.filter(item => currentUser.projectIds!.includes(item.id));
      }
    }

    const f = this.filter();
    const search = f.searchTerm.trim().toLowerCase();

    return list.filter(item => {
      // Search term filter
      if (search) {
        const matchesTitle = item.title.toLowerCase().includes(search);
        const matchesSub = item.subtitle.toLowerCase().includes(search);
        const matchesDesc = item.description.toLowerCase().includes(search);
        const matchesCat = item.categoryLabel.toLowerCase().includes(search);
        if (!matchesTitle && !matchesSub && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      // Category filter
      if (f.category !== 'todos' && item.category !== f.category) {
        return false;
      }

      // Environment filter
      if (f.environment !== 'ALL' && item.environment !== f.environment) {
        return false;
      }

      // Only favorites filter
      if (f.onlyFavorites && !item.isFavorite) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (f.sortBy === 'popular') {
        return b.accessCount - a.accessCount;
      }
      if (f.sortBy === 'recent') {
        return b.id.localeCompare(a.id);
      }
      return a.title.localeCompare(b.title);
    });
  });

  // Total count of filtered projects
  readonly totalFilteredCount = computed(() => this.filteredProjects().length);

  // Total pages
  readonly totalPages = computed(() => {
    const total = this.totalFilteredCount();
    const perPage = this.itemsPerPage();
    return Math.max(1, Math.ceil(total / perPage));
  });

  // Paginated items
  readonly paginatedProjects = computed(() => {
    const all = this.filteredProjects();
    const page = Math.min(this.currentPage(), this.totalPages());
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return all.slice(start, start + perPage);
  });

  // Pagination bounds text
  readonly paginationInfo = computed(() => {
    const total = this.totalFilteredCount();
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    return { start, end, total };
  });

  // Favorites count
  readonly favoritesCount = computed(() => {
    let list = this._projects();
    const isAdmin = this.authService.isAdmin();
    const currentUser = this.authService.currentUser();
    if (!isAdmin && currentUser && Array.isArray(currentUser.projectIds)) {
      list = list.filter(item => currentUser.projectIds!.includes(item.id));
    }
    return list.filter(p => p.isFavorite).length;
  });

  constructor() {
    // Al inicializar el servicio, sincronizar catálogo o asignaciones según el rol
    if (this.authService.isSessionValid()) {
      this.loadProjectsForCurrentUser();
      this.loadCompanies();
    }
  }

  // =========================================================================
  // CONSUMO DE SERVICIOS REST DE ADMIN-API (PUERTO 8080)
  // =========================================================================

  /**
   * Consume GET /projects?size=100 desde admin-api
   * Retorna todo el catálogo completo de proyectos (26 proyectos) para usuarios con rol ADMIN.
   */
  getAllProjects(): Observable<Project[]> {
    const url = `${this.services.projects}?size=100`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const items = res?.content || (Array.isArray(res) ? res : []);
        return items.map((item: any) => this.mapApiProjectToModel(item));
      }),
      tap(projects => {
        if (projects && projects.length > 0) {
          this.isApiConnected.set(true);
          this.apiError.set(null);
        }
      }),
      catchError(err => {
        console.warn(`[admin-api] Error al consultar catálogo general en ${url}:`, err);
        this.isApiConnected.set(false);
        this.apiError.set(err?.message || 'Error al conectar con el servicio admin-api');
        return of(INITIAL_PROJECTS);
      })
    );
  }

  /**
   * Consume GET /users/{id}/projects desde admin-api
   * Retorna los proyectos asignados al usuario especificado.
   */
  getUserProjects(userId: number | string = 1): Observable<Project[]> {
    const url = `${this.services.users}/${userId}/projects`;
    return this.http.get<any[]>(url).pipe(
      map(items => (items || []).map(item => this.mapApiProjectToModel(item))),
      tap(projects => {
        this.isApiConnected.set(true);
        this.apiError.set(null);
      }),
      catchError(err => {
        console.warn(`[admin-api] Error al consultar ${url}:`, err);
        this.isApiConnected.set(false);
        this.apiError.set(err?.message || 'Error al conectar con el servicio admin-api');
        // Si falla la conexión remota, filtrar de INITIAL_PROJECTS los proyectos asignados
        const userProjectIds = this.authService.currentUser()?.projectIds;
        if (userProjectIds && userProjectIds.length > 0) {
          return of(INITIAL_PROJECTS.filter(p => userProjectIds.includes(p.id)));
        }
        return of(INITIAL_PROJECTS.slice(0, 6));
      })
    );
  }

  /**
   * Carga todo el catálogo de proyectos y actualiza las señales reactivas (Modo ADMIN)
   */
  loadAllProjects(): void {
    this.isLoading.set(true);
    this.selectedUserId.set(0);

    this.getAllProjects().subscribe({
      next: (projects) => {
        if (projects && projects.length > 0) {
          this.saveProjects(projects);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga los proyectos según el rol del usuario autenticado:
   * - Si es ADMIN: Carga todo el catálogo de proyectos (/api/projects).
   * - Si es CUALQUIER OTRO ROL: Carga únicamente los proyectos asignados al usuario (/api/users/{userId}/projects).
   */
  loadProjectsForCurrentUser(): void {
    if (!this.authService.isSessionValid()) return;

    this.isLoading.set(true);
    const isAdmin = this.authService.isAdmin();
    const current = this.authService.currentUser();

    if (isAdmin) {
      this.selectedUserId.set(0);
      this.getAllProjects().subscribe({
        next: (projects) => {
          if (projects && projects.length > 0) {
            this.saveProjects(projects);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      const userId = current?.id ?? 1;
      this.selectedUserId.set(Number(userId));
      this.getUserProjects(userId).subscribe({
        next: (projects) => {
          if (projects) {
            this.saveProjects(projects);
            // Sincronizar projectIds en currentUser si aún no los tenía
            if (current && (!current.projectIds || current.projectIds.length === 0)) {
              const ids = projects.map(p => p.id);
              this.authService.currentUser.set({ ...current, projectIds: ids });
            }
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  /**
   * Consume GET /companies desde admin-api
   * Retorna la lista de empresas registradas.
   */
  getCompanies(): Observable<Company[]> {
    const url = this.services.companies;
    return this.http.get<Company[]>(url).pipe(
      tap(list => {
        if (list && list.length > 0) {
          this.companies.set(list);
          this.isApiConnected.set(true);
        }
      }),
      catchError(err => {
        console.warn(`[admin-api] Error al consultar ${url}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Consume GET /projects/dashboard/stats desde admin-api
   * Retorna estadísticas y métricas generales del catálogo de proyectos.
   */
  getDashboardStats(): Observable<any> {
    const url = `${this.services.projects}/dashboard/stats`;
    return this.http.get<any>(url).pipe(
      catchError(err => {
        console.warn(`[admin-api] Error al consultar métricas en ${url}:`, err);
        return of(null);
      })
    );
  }

  /**
   * Consume GET /roles desde admin-api
   * Retorna el catálogo de roles del sistema.
   */
  getRoles(): Observable<any[]> {
    const url = this.services.roles;
    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        console.warn(`[admin-api] Error al consultar roles en ${url}:`, err);
        return of([]);
      })
    );
  }

  // =========================================================================
  // CONSUMO DE NUEVOS SERVICIOS PLANIFICADOS (ARQUITECTURA MIA)
  // =========================================================================

  /**
   * Consume GET /policies (Nuevo Servicio de Consulta de Pólizas)
   */
  getPolicies(): Observable<any[]> {
    const url = this.services.policies;
    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        console.warn(`[admin-api] Servicio de pólizas no disponible en ${url}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Consume GET /audit (Nuevo Servicio de Auditoría y Trazabilidad)
   */
  getAuditLogs(): Observable<any[]> {
    const url = this.services.audit;
    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        console.warn(`[admin-api] Servicio de auditoría no disponible en ${url}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Consume GET /reports (Nuevo Servicio de Reportería)
   */
  getReports(): Observable<any[]> {
    const url = this.services.reports;
    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        console.warn(`[admin-api] Servicio de reportes no disponible en ${url}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Consume GET /notifications (Nuevo Servicio de Notificaciones y Alertas)
   */
  getNotifications(): Observable<any[]> {
    const url = this.services.notifications;
    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        console.warn(`[admin-api] Servicio de notificaciones no disponible en ${url}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Carga los proyectos del usuario especificado desde el backend y actualiza los Signals reactivos
   */
  loadUserProjects(userId: number | string = 1): void {
    this.isLoading.set(true);
    this.selectedUserId.set(Number(userId));

    this.getUserProjects(userId).subscribe({
      next: (projects) => {
        if (projects && projects.length > 0) {
          this.saveProjects(projects);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga las empresas desde admin-api
   */
  loadCompanies(): void {
    this.getCompanies().subscribe();
  }

  /**
   * Convierte la respuesta del backend ProjectResponse al modelo Project del frontend
   */
  private mapApiProjectToModel(item: any): Project {
    const isFav = Boolean(item.favorite ?? item.isFavorite ?? false);
    return {
      id: item.id || `proj-${Date.now()}`,
      title: item.title || 'Sistema Sin Título',
      subtitle: item.subtitle || item.title || '',
      description: item.description || '',
      category: (item.category as ProjectCategory) || 'corporativo',
      categoryLabel: item.categoryLabel || 'Corporativo',
      icon: item.icon || 'browser-www',
      iconBgColor: item.iconBgColor || '#38bdf8',
      url: item.url || 'https://mia.com.gt',
      isFavorite: isFav,
      favorite: isFav,
      status: (item.status as any) || 'active',
      environment: (item.environment as any) || 'PROD',
      version: item.version || 'v1.0.0',
      team: item.team || 'Equipo TI',
      uptime: item.uptime || '99.9%',
      lastDeploy: item.lastDeploy || 'Reciente',
      accessCount: item.accessCount ?? 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }

  // =========================================================================
  // GESTIÓN Y PERSISTENCIA LOCAL / MOCK FALLBACK
  // =========================================================================

  private loadInitialProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!this.authService.isAdmin()) {
            const ids = this.authService.currentUser()?.projectIds;
            if (ids && ids.length > 0) {
              return parsed.filter(p => ids.includes(p.id));
            }
          }
          return parsed;
        }
      }
    } catch {
      // LocalStorage error fallback
    }

    if (!this.authService.isAdmin()) {
      const ids = this.authService.currentUser()?.projectIds;
      if (ids && ids.length > 0) {
        return INITIAL_PROJECTS.filter(p => ids.includes(p.id));
      }
    }

    return INITIAL_PROJECTS;
  }

  private saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore storage errors
    }
    this._projects.set(projects);
  }

  toggleFavorite(id: string): void {
    const updated = this._projects().map(p => {
      if (p.id === id) {
        const nextFav = !p.isFavorite;
        return { ...p, isFavorite: nextFav, favorite: nextFav };
      }
      return p;
    });
    this.saveProjects(updated);

    // Si admin-api está disponible, sincronizar el PATCH en segundo plano
    this.http.patch(`${this.apiUrl}/projects/${id}/favorite`, {}).pipe(
      catchError(() => of(null))
    ).subscribe();
  }

  addProject(projectData: Omit<Project, 'id' | 'accessCount' | 'uptime' | 'lastDeploy'>): Project {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
      accessCount: 1,
      uptime: '100%',
      lastDeploy: 'Reciente',
      favorite: projectData.isFavorite
    };

    const updated = [newProject, ...this._projects()];
    this.saveProjects(updated);

    // Intentar persistir en admin-api /api/projects
    this.http.post(`${this.apiUrl}/projects`, newProject).pipe(
      catchError(() => of(null))
    ).subscribe();

    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): void {
    const updated = this._projects().map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
    this.saveProjects(updated);

    // Sincronizar en admin-api /api/projects/{id}
    this.http.put(`${this.apiUrl}/projects/${id}`, updates).pipe(
      catchError(() => of(null))
    ).subscribe();
  }

  deleteProject(id: string): void {
    const updated = this._projects().filter(p => p.id !== id);
    this.saveProjects(updated);
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(Math.max(1, this.totalPages()));
    }

    // Sincronizar DELETE en admin-api
    this.http.delete(`${this.apiUrl}/projects/${id}`).pipe(
      catchError(() => of(null))
    ).subscribe();
  }

  setSearchTerm(term: string): void {
    this.filter.update(f => ({ ...f, searchTerm: term }));
    this.currentPage.set(1);
  }

  setCategory(category: ProjectCategory): void {
    this.filter.update(f => ({ ...f, category }));
    this.currentPage.set(1);
  }

  setEnvironment(env: 'ALL' | ProjectEnvironment): void {
    this.filter.update(f => ({ ...f, environment: env }));
    this.currentPage.set(1);
  }

  setOnlyFavorites(only: boolean): void {
    this.filter.update(f => ({ ...f, onlyFavorites: only }));
    this.currentPage.set(1);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.filter.update(f => ({ ...f, viewMode: mode }));
  }

  setSortBy(sortBy: 'name' | 'popular' | 'recent'): void {
    this.filter.update(f => ({ ...f, sortBy }));
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  resetFilters(): void {
    this.filter.set({
      searchTerm: '',
      category: 'todos',
      environment: 'ALL',
      onlyFavorites: false,
      viewMode: 'grid',
      sortBy: 'name'
    });
    this.currentPage.set(1);
  }

  resetToDefaultProjects(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    this._projects.set(INITIAL_PROJECTS);
    this.currentPage.set(1);
  }
}

