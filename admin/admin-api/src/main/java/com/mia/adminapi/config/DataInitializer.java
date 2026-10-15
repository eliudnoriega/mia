package com.mia.adminapi.config;

import com.mia.adminapi.entity.Company;
import com.mia.adminapi.entity.Menu;
import com.mia.adminapi.entity.Project;
import com.mia.adminapi.entity.Role;
import com.mia.adminapi.entity.User;
import com.mia.adminapi.repository.CompanyRepository;
import com.mia.adminapi.repository.MenuRepository;
import com.mia.adminapi.repository.ProjectRepository;
import com.mia.adminapi.repository.RoleRepository;
import com.mia.adminapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;
    private final MenuRepository menuRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            RoleRepository roleRepository,
            ProjectRepository projectRepository,
            CompanyRepository companyRepository,
            MenuRepository menuRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.projectRepository = projectRepository;
        this.companyRepository = companyRepository;
        this.menuRepository = menuRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedCompanies();
        seedRoles();
        seedProjects();
        seedUsers();
        seedMenus();
    }

    private void seedCompanies() {
        if (companyRepository.count() == 0) {
            log.info("Inicializando tabla de Empresas (Companies)...");
            List<Company> companies = List.of(
                    new Company(
                            "Seguros Universales S.A.",
                            "348210-9",
                            "Avenida Reforma 9-55, Zona 10, Ciudad de Guatemala",
                            "+502 2300-0000",
                            "contacto@universales.com",
                            "https://universales.com",
                            "https://ui-avatars.com/api/?name=Universales&background=1e3a8a&color=fff"
                    ),
                    new Company(
                            "MIA Digital Technologies",
                            "884129-3",
                            "Tech Hub InsurTech, Nivel 8, Edificio Zona Pradera",
                            "+502 2400-1111",
                            "tech@mia.universales.com",
                            "https://mia.universales.com",
                            "https://ui-avatars.com/api/?name=MIA+Tech&background=2563eb&color=fff"
                    ),
                    new Company(
                            "FinTech Solutions Lab",
                            "991204-5",
                            "Boulevard Los Próceres 24-69, Zona 10",
                            "+502 2210-9988",
                            "lab@fintechsolutions.gt",
                            "https://fintechsolutions.gt",
                            "https://ui-avatars.com/api/?name=FinTech+Lab&background=059669&color=fff"
                    )
            );
            companyRepository.saveAll(companies);
            log.info("{} empresas creadas en la tabla 'companies'.", companies.size());
        }
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            log.info("Inicializando tabla de Roles...");
            List<Role> roles = List.of(
                    new Role("ROLE_ADMIN", "Administrador Total del Sistema con acceso completo"),
                    new Role("ROLE_USER", "Usuario estándar con permisos de lectura y consulta"),
                    new Role("ROLE_DEVELOPER", "Ingeniero de Software y desarrollo de APIs"),
                    new Role("ROLE_MANAGER", "Gerente de Producto y Analítica de Negocio"),
                    new Role("ROLE_AUDITOR", "Auditor de Cumplimiento, Seguridad y Trazabilidad")
            );
            roleRepository.saveAll(roles);
            log.info("{} roles creados en la tabla 'roles'.", roles.size());
        }
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            log.info("Inicializando catálogo de proyectos para el Dashboard...");

            List<Project> defaultProjects = List.of(
                    new Project(
                            "proj-1",
                            "Portal Clientes MIA",
                            "Gestión de Pólizas en Línea",
                            "Portal de autoservicio para asegurados con consulta de coberturas, pagos en línea y descarga de pólizas vigentes.",
                            "web",
                            "Ventas & Web",
                            "browser-www",
                            "#2563eb",
                            "https://mia.universales.com",
                            true,
                            "active",
                            "PROD",
                            "v2.4.1",
                            "Equipo Digital",
                            "99.98%",
                            "Hace 2 horas",
                            1420
                    ),
                    new Project(
                            "proj-2",
                            "Core de Seguros Universales",
                            "Sistema Central de Emisión y Cobranza",
                            "Motor transaccional principal que procesa la suscripción, emisión de pólizas y cálculo actuarial de primas.",
                            "corporativo",
                            "Core Seguros",
                            "shield-check",
                            "#1e40af",
                            "https://core.universales.com",
                            true,
                            "active",
                            "PROD",
                            "v5.1.0",
                            "Equipo Core",
                            "99.99%",
                            "Ayer",
                            3890
                    ),
                    new Project(
                            "proj-3",
                            "API Gateway Corporativo",
                            "Ruteo, Rate Limiting & Seguridad OAuth2",
                            "Punto de entrada unificado para microservicios con validación de tokens JWT, balanceo de carga y throttling.",
                            "api",
                            "Infraestructura API",
                            "code-circle",
                            "#0284c7",
                            "https://api.universales.com/docs",
                            true,
                            "active",
                            "PROD",
                            "v3.0.2",
                            "DevOps & Cloud",
                            "100%",
                            "Hace 1 semana",
                            8920
                    ),
                    new Project(
                            "proj-4",
                            "Sistema de Facturación FEL",
                            "Emisión Tributaria y Certificación SAT",
                            "Módulo de firma electrónica digital y generación de Documentos Tributarios Electrónicos autorizados por la SAT.",
                            "finanzas",
                            "Finanzas & Cobranza",
                            "file-invoice",
                            "#059669",
                            "https://fel.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v1.8.4",
                            "FinTech",
                            "99.95%",
                            "Hace 3 días",
                            2105
                    ),
                    new Project(
                            "proj-5",
                            "Reclamaciones & Siniestros Auto",
                            "Inspección Digital y Ajuste de Daños",
                            "Plataforma de seguimiento y liquidación de siniestros automotrices con geolocalización de ajustadores.",
                            "operaciones",
                            "Siniestros",
                            "car-crash",
                            "#d97706",
                            "https://siniestros.universales.com",
                            true,
                            "active",
                            "PROD",
                            "v2.2.0",
                            "Operaciones",
                            "99.90%",
                            "Hace 5 días",
                            1780
                    ),
                    new Project(
                            "proj-6",
                            "Cotizador Web Vida & Salud",
                            "Tarificador Dinámico de Coberturas",
                            "Herramienta interactiva para cotizar planes individuales y familiares de seguro de vida y gastos médicos mayores.",
                            "web",
                            "Ventas & Web",
                            "shopping-cart",
                            "#ec4899",
                            "https://cotiza.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v3.4.1",
                            "Comercial",
                            "99.85%",
                            "Hace 1 día",
                            3250
                    ),
                    new Project(
                            "proj-7",
                            "Portal del Agente",
                            "Gestión de Cartera de Intermediarios",
                            "Panel exclusivo para agentes con liquidación de comisiones, cotización asistida y seguimiento de metas.",
                            "corporativo",
                            "Fuerza Comercial",
                            "handshake",
                            "#8b5cf6",
                            "https://agentes.universales.com",
                            false,
                            "maintenance",
                            "STAGE",
                            "v2.0.0-rc3",
                            "Fuerza Ventas",
                            "98.40%",
                            "En mantenimiento",
                            940
                    ),
                    new Project(
                            "proj-8",
                            "Dashboard Gerencial BI",
                            "Analítica de Negocio y KPIs de Siniestralidad",
                            "Tableros ejecutivos construidos en PowerBI y Superset con métricas de solvencia, primas netas y siniestralidad.",
                            "corporativo",
                            "Inteligencia de Negocios",
                            "bar-chart-2",
                            "#6366f1",
                            "https://bi.universales.com",
                            true,
                            "active",
                            "PROD",
                            "v4.0.0",
                            "Data & BI",
                            "99.99%",
                            "Hace 4 días",
                            620
                    ),
                    new Project(
                            "proj-9",
                            "Motor de Pagos & Recaudación",
                            "Integración Cybersource, Visa y BAC",
                            "Pasarela centralizada de cobros recurrentes en tarjetas de crédito, débito y transferencias ACH.",
                            "finanzas",
                            "Finanzas & Cobranza",
                            "credit-card",
                            "#10b981",
                            "https://pagos.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v2.7.3",
                            "FinTech",
                            "100%",
                            "Hace 2 semanas",
                            4530
                    ),
                    new Project(
                            "proj-10",
                            "Gestor Documental & Pólizas",
                            "Repositorio Seguro S3 & OCR",
                            "Almacenamiento de carátulas, endosos, cédulas y expedientes médicos con indexación por número de contrato.",
                            "operaciones",
                            "Gestión Documental",
                            "folder-archive",
                            "#06b6d4",
                            "https://docs.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v1.4.0",
                            "Operaciones",
                            "99.92%",
                            "Hace 3 semanas",
                            1120
                    ),
                    new Project(
                            "proj-11",
                            "Autenticación Centralizada SSO",
                            "Keycloak & Active Directory",
                            "Servicio central de identidad federada con autenticación multifactor (MFA) para empleados y contratistas.",
                            "seguridad",
                            "Seguridad & Acceso",
                            "lock",
                            "#475569",
                            "https://sso.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v2.0.1",
                            "Ciberseguridad",
                            "100%",
                            "Hace 1 mes",
                            12000
                    ),
                    new Project(
                            "proj-12",
                            "Notificaciones Multicanal SMS/Email",
                            "Envío Transaccional Twilio y SendGrid",
                            "Microservicio para alertas automáticas de renovación, avisos de cobro y recordatorios de pago de pólizas.",
                            "api",
                            "Infraestructura API",
                            "bell",
                            "#eab308",
                            "https://notify.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v1.2.9",
                            "DevOps & Cloud",
                            "99.97%",
                            "Hace 2 días",
                            7600
                    ),
                    new Project(
                            "proj-13",
                            "Servicio de Inspección Móvil",
                            "Peritaje de Vehículos vía App",
                            "Herramienta para captura guiada de fotos y estado vehicular antes de emitir cobertura contra accidentes.",
                            "operaciones",
                            "Siniestros",
                            "camera",
                            "#14b8a6",
                            "https://inspeccion.universales.com",
                            false,
                            "offline",
                            "DEV",
                            "v0.9.1-beta",
                            "Equipo Móvil",
                            "92.10%",
                            "Hace 1 semana",
                            180
                    ),
                    new Project(
                            "proj-14",
                            "Conciliación Bancaria Automática",
                            "Cruce de Extractos Bancarios",
                            "Proceso batch nocturno que concilia cobros procesados contra estados de cuenta de bancos receptores.",
                            "finanzas",
                            "Finanzas & Cobranza",
                            "scale",
                            "#047857",
                            "https://conciliacion.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v1.5.0",
                            "FinTech",
                            "99.99%",
                            "Ayer",
                            850
                    ),
                    new Project(
                            "proj-15",
                            "Portal Proveedores Médicos y Talleres",
                            "Pre-autorizaciones y Órdenes de Trabajo",
                            "Módulo para clínicas, farmacias y talleres mecánicos para someter órdenes de reparación y facturas médicas.",
                            "operaciones",
                            "Red Proveedores",
                            "truck",
                            "#f97316",
                            "https://proveedores.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v2.1.0",
                            "Operaciones",
                            "99.88%",
                            "Hace 6 días",
                            1940
                    ),
                    new Project(
                            "proj-16",
                            "Prevención de Fraude con IA",
                            "Score de Riesgo en Emisión y Siniestros",
                            "Modelo de aprendizaje automático que detecta patrones atípicos en reportes de daños y reclamos sospechosos.",
                            "seguridad",
                            "Ciberseguridad",
                            "shield-alert",
                            "#dc2626",
                            "https://antifraude.universales.com",
                            true,
                            "active",
                            "PROD",
                            "v1.1.2",
                            "Data Science",
                            "99.90%",
                            "Hace 2 semanas",
                            420
                    ),
                    new Project(
                            "proj-17",
                            "Mesa de Ayuda TI",
                            "Tickets y Soporte a Usuarios Internos",
                            "Sistema Jira Service Desk integrado con ServiceNow para soporte de hardware, software y accesos de red.",
                            "soporte",
                            "Soporte TI",
                            "help-circle",
                            "#64748b",
                            "https://soporte.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v3.8.0",
                            "Mesa de Ayuda",
                            "99.95%",
                            "Hace 3 días",
                            2240
                    ),
                    new Project(
                            "proj-18",
                            "App Móvil Asegurados iOS/Android",
                            "Asistencia Vial en Tiempo Real",
                            "Aplicación nativa móvil con botón de auxilio 24/7, rastreo de grúa y reporte de emergencias en ruta.",
                            "web",
                            "Ventas & Web",
                            "smartphone",
                            "#3b82f6",
                            "https://app.universales.com",
                            true,
                            "active",
                            "PROD",
                            "v4.2.0",
                            "Equipo Móvil",
                            "99.92%",
                            "Hace 3 días",
                            6890
                    ),
                    new Project(
                            "proj-19",
                            "Plataforma de Auditoría & Compliance",
                            "Trazabilidad Normativa SIB y AML",
                            "Registro inmutable de transacciones y cambios de pólizas para cumplimiento ante la Superintendencia de Bancos.",
                            "seguridad",
                            "Auditoría",
                            "file-check",
                            "#0f766e",
                            "https://compliance.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v1.3.4",
                            "Compliance",
                            "100%",
                            "Hace 1 mes",
                            310
                    ),
                    new Project(
                            "proj-20",
                            "Conector SAT & Tributario",
                            "Validación de NIT y Retenciones ISR",
                            "Servicio de consulta en tiempo real del registro tributario unificado y generación de retenciones de ley.",
                            "finanzas",
                            "Finanzas & Cobranza",
                            "building-bank",
                            "#047857",
                            "https://sat-connector.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v2.0.0",
                            "FinTech",
                            "99.94%",
                            "Hace 5 días",
                            3100
                    ),
                    new Project(
                            "proj-21",
                            "Cotizador Autos Rápido",
                            "Flujo de Cotización en 3 Pasos",
                            "Experiencia ultra rápida optimizada para redes sociales con cálculo inmediato de deducibles y coberturas.",
                            "web",
                            "Ventas & Web",
                            "zap",
                            "#e11d48",
                            "https://cotiza-auto.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v2.5.0",
                            "Marketing Digital",
                            "99.89%",
                            "Ayer",
                            4120
                    ),
                    new Project(
                            "proj-22",
                            "Monitoreo de Infraestructura Datadog",
                            "Métricas de Servidores y Clústeres K8s",
                            "Paneles unificados de rendimiento de CPU, memoria, bases de datos PostgreSQL y colas Kafka.",
                            "corporativo",
                            "Infraestructura Cloud",
                            "activity",
                            "#7c3aed",
                            "https://monitoring.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v2.11.0",
                            "DevOps & Cloud",
                            "100%",
                            "Hace 2 días",
                            980
                    ),
                    new Project(
                            "proj-23",
                            "Microservicio de Cotizaciones",
                            "Cálculo Actuarial Desacoplado",
                            "Motor en Java de alta velocidad que resuelve matrices de tarifas de seguros de incendio y líneas comerciales.",
                            "api",
                            "Infraestructura API",
                            "server",
                            "#2563eb",
                            "https://api-tarificador.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v1.9.3",
                            "Equipo Actuarial",
                            "99.99%",
                            "Hace 1 semana",
                            5640
                    ),
                    new Project(
                            "proj-24",
                            "Portal del Corredor",
                            "Gestión de Productores y Brokers",
                            "Plataforma para intermediarios independientes con descarga de estados de comisiones.",
                            "finanzas",
                            "Fuerza Comercial",
                            "sales-growth",
                            "#16a34a",
                            "https://corredores.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v3.5.0",
                            "Canal Intermediarios",
                            "99.95%",
                            "Hace 4 días",
                            2900
                    ),
                    new Project(
                            "proj-25",
                            "Monitor de Salud Microservicios",
                            "Telemetry & APM Datadog/Grafana",
                            "Monitoreo en tiempo real de latencia, tasa de error 5xx y consumo de pods en Kubernetes.",
                            "corporativo",
                            "Infraestructura API",
                            "browser-www",
                            "#f43f5e",
                            "https://telemetry.universales.com",
                            false,
                            "active",
                            "PROD",
                            "v2.12.0",
                            "Site Reliability Engineering",
                            "100%",
                            "Hoy",
                            1540
                    ),
                    new Project(
                            "proj-26",
                            "Plataforma de Capacitación",
                            "Campus Virtual y Evaluaciones",
                            "Cursos internos sobre prevención de lavado de dinero, ciberseguridad y nuevos productos.",
                            "rrhh",
                            "Recursos Humanos",
                            "handshake",
                            "#d97706",
                            "https://campus.universales.com",
                            false,
                            "maintenance",
                            "DEV",
                            "v1.1.0-beta",
                            "Capacitación y Desarrollo",
                            "97.20%",
                            "Hoy",
                            310
                    )
            );

            projectRepository.saveAll(defaultProjects);
            log.info("Catálogo de {} proyectos cargado exitosamente en la base de datos.", defaultProjects.size());
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            log.info("Inicializando usuarios con múltiples roles y proyectos asignados...");

            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();
            Role devRole = roleRepository.findByName("ROLE_DEVELOPER").orElseThrow();
            Role managerRole = roleRepository.findByName("ROLE_MANAGER").orElseThrow();

            Company compUniversales = companyRepository.findByName("Seguros Universales S.A.").orElse(null);
            Company compMia = companyRepository.findByName("MIA Digital Technologies").orElse(null);

            // 1. Usuario Admin (Roles: ROLE_ADMIN, ROLE_USER)
            User admin = new User(
                    "admin",
                    "admin@universales.com",
                    passwordEncoder.encode("admin123"),
                    "Administrador Corporativo"
            );
            admin.setRoles(Set.of(adminRole, userRole));
            admin.setCompany(compUniversales);
            admin.setAvatarUrl("https://ui-avatars.com/api/?name=Admin+Corporativo&background=1e293b&color=38bdf8");
            
            // Asignar proyectos clave al Admin
            List<Project> adminProjects = projectRepository.findAllById(List.of("proj-1", "proj-2", "proj-3", "proj-8", "proj-11", "proj-16"));
            admin.setProjects(new HashSet<>(adminProjects));

            // 2. Usuario Developer (Roles: ROLE_DEVELOPER, ROLE_USER)
            User dev = new User(
                    "developer",
                    "dev@universales.com",
                    passwordEncoder.encode("dev123"),
                    "Carlos Ingeniero"
            );
            dev.setRoles(Set.of(devRole, userRole));
            dev.setCompany(compMia);
            dev.setAvatarUrl("https://ui-avatars.com/api/?name=Carlos+Ingeniero&background=2563eb&color=ffffff");
            
            // Asignar proyectos de APIs y microservicios al Dev
            List<Project> devProjects = projectRepository.findAllById(List.of("proj-1", "proj-3", "proj-6", "proj-12", "proj-18", "proj-21", "proj-23", "proj-25"));
            dev.setProjects(new HashSet<>(devProjects));

            // 3. Usuario Analyst (Roles: ROLE_MANAGER, ROLE_USER)
            User analyst = new User(
                    "analyst",
                    "analista@universales.com",
                    passwordEncoder.encode("analyst123"),
                    "Sofía Consultora"
            );
            analyst.setRoles(Set.of(managerRole, userRole));
            analyst.setCompany(compUniversales);
            analyst.setAvatarUrl("https://ui-avatars.com/api/?name=Sofia+Consultora&background=10b981&color=ffffff");
            
            // Asignar proyectos de Finanzas, Core y BI
            List<Project> analystProjects = projectRepository.findAllById(List.of("proj-2", "proj-4", "proj-8", "proj-9", "proj-14", "proj-19", "proj-24"));
            analyst.setProjects(new HashSet<>(analystProjects));

            userRepository.saveAll(List.of(admin, dev, analyst));
            log.info("Usuarios creados exitosamente con empresa asignada, múltiples roles y proyectos.");
        } else {
            // Asegurar que usuarios existentes tengan su empresa asignada si aún es null
            Company compUniversales = companyRepository.findByName("Seguros Universales S.A.").orElse(null);
            Company compMia = companyRepository.findByName("MIA Digital Technologies").orElse(null);

            userRepository.findByUsername("admin").ifPresent(admin -> {
                if (admin.getCompany() == null && compUniversales != null) {
                    admin.setCompany(compUniversales);
                    userRepository.save(admin);
                }
            });
            userRepository.findByUsername("developer").ifPresent(dev -> {
                if (dev.getCompany() == null && compMia != null) {
                    dev.setCompany(compMia);
                    userRepository.save(dev);
                }
            });
            userRepository.findByUsername("analyst").ifPresent(analyst -> {
                if (analyst.getCompany() == null && compUniversales != null) {
                    analyst.setCompany(compUniversales);
                    userRepository.save(analyst);
                }
            });
        }
    }

    private void seedMenus() {
        if (menuRepository.count() == 0) {
            log.info("Inicializando tabla de Menús asociados a Roles y Proyectos...");

            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElse(null);
            Role devRole = roleRepository.findByName("ROLE_DEVELOPER").orElse(null);
            Role userRole = roleRepository.findByName("ROLE_USER").orElse(null);
            Role managerRole = roleRepository.findByName("ROLE_MANAGER").orElse(null);
            Role auditorRole = roleRepository.findByName("ROLE_AUDITOR").orElse(null);

            Company compUniversales = companyRepository.findByName("Seguros Universales S.A.").orElse(null);
            Company compMia = companyRepository.findByName("MIA Digital Technologies").orElse(null);

            Project proj1 = projectRepository.findById("proj-1").orElse(null); // Portal Clientes MIA
            Project proj3 = projectRepository.findById("proj-3").orElse(null); // API Gateway Corporativo

            List<Menu> menusToSave = new ArrayList<>();

            if (proj1 != null) {
                // Menú 1: Dashboard (Global para todas las empresas)
                Menu mDash = new Menu("portal-dashboard", "Panel de Control", "/projects/proj-1/dashboard", "layout-dashboard", 1);
                mDash.setProjects(Set.of(proj1));
                if (adminRole != null && userRole != null && devRole != null && managerRole != null) {
                    mDash.setRoles(Set.of(adminRole, userRole, devRole, managerRole));
                }
                menusToSave.add(mDash);

                // Menú 2: Gestión de Pólizas (Asociado a Seguros Universales)
                Menu mPolizas = new Menu("portal-polizas", "Consulta de Pólizas", "/projects/proj-1/polizas", "shield-check", 2);
                mPolizas.setProjects(Set.of(proj1));
                if (compUniversales != null) {
                    mPolizas.setCompanies(Set.of(compUniversales));
                }
                if (adminRole != null && userRole != null && managerRole != null) {
                    mPolizas.setRoles(Set.of(adminRole, userRole, managerRole));
                }
                menusToSave.add(mPolizas);

                // Menú 3: Cotizador (Global para todas las empresas)
                Menu mCotiza = new Menu("portal-cotizador", "Cotizador de Seguros", "/projects/proj-1/cotizaciones", "shopping-cart", 3);
                mCotiza.setProjects(Set.of(proj1));
                if (adminRole != null && userRole != null && managerRole != null) {
                    mCotiza.setRoles(Set.of(adminRole, userRole, managerRole));
                }
                menusToSave.add(mCotiza);

                // Menú 4: Reportes de Emisión (Asociado a Seguros Universales)
                Menu mReportes = new Menu("portal-reportes", "Reportes Financieros", "/projects/proj-1/reportes", "bar-chart-2", 4);
                mReportes.setProjects(Set.of(proj1));
                if (compUniversales != null) {
                    mReportes.setCompanies(Set.of(compUniversales));
                }
                if (adminRole != null && managerRole != null) {
                    mReportes.setRoles(Set.of(adminRole, managerRole));
                }
                menusToSave.add(mReportes);

                // Menú 5 (Padre): Configuración Técnica (Disponible para ambas empresas)
                Menu mSettings = new Menu("portal-settings", "Configuración & APIs", "/projects/proj-1/config", "settings", 5);
                mSettings.setProjects(Set.of(proj1));
                if (compMia != null && compUniversales != null) {
                    mSettings.setCompanies(Set.of(compMia, compUniversales));
                }
                if (adminRole != null && devRole != null) {
                    mSettings.setRoles(Set.of(adminRole, devRole));
                }
                menusToSave.add(mSettings);

                // Menú 5.1 (Hijo): Integraciones API (Developer y Admin)
                Menu mApis = new Menu("portal-webhooks", "Webhooks y Endpoints", "/projects/proj-1/config/webhooks", "code", 1);
                mApis.setProjects(Set.of(proj1));
                mApis.setParent(mSettings);
                if (compMia != null && compUniversales != null) {
                    mApis.setCompanies(Set.of(compMia, compUniversales));
                }
                if (adminRole != null && devRole != null) {
                    mApis.setRoles(Set.of(adminRole, devRole));
                }
                menusToSave.add(mApis);

                // Menú 5.2 (Hijo): Logs de Auditoría (Auditor y Admin)
                Menu mLogs = new Menu("portal-audit-logs", "Bitácora de Auditoría", "/projects/proj-1/config/logs", "file-text", 2);
                mLogs.setProjects(Set.of(proj1));
                mLogs.setParent(mSettings);
                if (compMia != null && compUniversales != null) {
                    mLogs.setCompanies(Set.of(compMia, compUniversales));
                }
                if (adminRole != null && auditorRole != null) {
                    mLogs.setRoles(Set.of(adminRole, auditorRole));
                }
                menusToSave.add(mLogs);

                // Menú 6: Portal Exclusivo MIA Tech Lab (Solo para usuarios de MIA Digital Technologies)
                Menu mMiaLab = new Menu("portal-mia-lab", "MIA Cloud Sandbox", "/projects/proj-1/mia-lab", "cpu", 6);
                mMiaLab.setProjects(Set.of(proj1));
                if (compMia != null) {
                    mMiaLab.setCompanies(Set.of(compMia));
                }
                if (adminRole != null && devRole != null) {
                    mMiaLab.setRoles(Set.of(adminRole, devRole));
                }
                menusToSave.add(mMiaLab);
            }

            if (proj3 != null) {
                // Menús para API Gateway (proj-3)
                Menu mGatewayRoutes = new Menu("gateway-routes", "Rutas de Microservicios", "/projects/proj-3/routes", "git-branch", 1);
                mGatewayRoutes.setProjects(Set.of(proj3));
                if (adminRole != null && devRole != null) {
                    mGatewayRoutes.setRoles(Set.of(adminRole, devRole));
                }
                menusToSave.add(mGatewayRoutes);

                Menu mRateLimit = new Menu("gateway-throttling", "Políticas Rate Limiting", "/projects/proj-3/rate-limiting", "activity", 2);
                mRateLimit.setProjects(Set.of(proj3));
                if (adminRole != null && devRole != null) {
                    mRateLimit.setRoles(Set.of(adminRole, devRole));
                }
                menusToSave.add(mRateLimit);

                Menu mGatewayAudit = new Menu("gateway-security", "Monitoreo de Tokens OAuth2", "/projects/proj-3/security", "lock", 3);
                mGatewayAudit.setProjects(Set.of(proj3));
                if (adminRole != null && auditorRole != null && devRole != null) {
                    mGatewayAudit.setRoles(Set.of(adminRole, auditorRole, devRole));
                }
                menusToSave.add(mGatewayAudit);
            }

            menuRepository.saveAll(menusToSave);
            log.info("{} menús configurados y asociados exitosamente a roles y proyectos.", menusToSave.size());
        }
    }
}
