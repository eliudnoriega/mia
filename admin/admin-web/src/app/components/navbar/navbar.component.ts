import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <!-- Logo Branding -->
        <div class="brand-container">
          <div class="brand-logo">
            <!-- Corporate Globe SVG icon resembling the logo in screenshot -->
            <svg viewBox="0 0 100 40" class="logo-svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0066b3"/>
                  <stop offset="100%" stop-color="#0284c7"/>
                </linearGradient>
              </defs>
              <!-- Globe with orbit lines -->
              <circle cx="80" cy="20" r="14" fill="none" stroke="url(#logoGrad)" stroke-width="2.5"/>
              <ellipse cx="80" cy="20" rx="14" ry="5.5" fill="none" stroke="#0284c7" stroke-width="1.8" transform="rotate(-25 80 20)"/>
              <path d="M68 15 Q80 8 92 15" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
              <path d="M68 25 Q80 32 92 25" fill="none" stroke="#00508f" stroke-width="1.5"/>
              <!-- Text: MIA -->
              <text x="5" y="26" fill="#003e7e" font-size="14.5" font-family="'Outfit', sans-serif" font-weight="800" letter-spacing="-0.5">MIA</text>
            </svg>
          </div>
        </div>

        <!-- Sidebar Collapse Toggle Button -->
        <button 
          type="button" 
          class="sidebar-toggle-btn" 
          (click)="toggleSidebar.emit()"
          title="Colapsar / Expandir menú">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="header-divider"></div>

        <!-- Breadcrumbs -->
        <div class="breadcrumb-nav">
          <span class="crumb-root">Dashboard de Control</span>
          <span class="crumb-separator">|</span>
          <span class="crumb-active">Dashboard</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Add Project Quick Action (Solo ADMIN) -->
        @if (authService.isAdmin()) {
          <button 
            type="button" 
            class="new-project-btn" 
            (click)="openNewProject.emit()"
            title="Registrar nuevo sistema">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Nuevo Sistema</span>
          </button>
        }

        <!-- Quick 9-dots App Grid Icon -->
        <button 
          type="button" 
          class="nav-icon-btn" 
          (click)="openAppLauncher.emit()"
          title="Lanzador rápido de aplicaciones">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <rect x="3" y="3" width="4" height="4" rx="1"/>
            <rect x="10" y="3" width="4" height="4" rx="1"/>
            <rect x="17" y="3" width="4" height="4" rx="1"/>
            <rect x="3" y="10" width="4" height="4" rx="1"/>
            <rect x="10" y="10" width="4" height="4" rx="1"/>
            <rect x="17" y="10" width="4" height="4" rx="1"/>
            <rect x="3" y="17" width="4" height="4" rx="1"/>
            <rect x="10" y="17" width="4" height="4" rx="1"/>
            <rect x="17" y="17" width="4" height="4" rx="1"/>
          </svg>
        </button>

        <!-- Favorites Counter Icon -->
        <button 
          type="button" 
          class="nav-icon-btn" 
          [class.active]="projectService.filter().onlyFavorites"
          (click)="toggleFavoritesFilter()"
          title="Filtrar sistemas favoritos">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          @if (projectService.favoritesCount() > 0) {
            <span class="badge-dot">{{ projectService.favoritesCount() }}</span>
          }
        </button>

        <!-- User Profile Avatar -->
        <div class="user-profile-menu">
          <button 
            type="button" 
            class="nav-icon-btn user-btn" 
            (click)="toggleUserDropdown()"
            [title]="authService.displayName()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span class="online-indicator"></span>
          </button>

          @if (userDropdownOpen) {
            <div class="user-dropdown animate-scale">
              <div class="user-info-header">
                <strong>{{ authService.currentUser()?.fullName || 'Usuario Corporativo' }}</strong>
                <span>{{ (authService.currentUser()?.role || authService.currentUser()?.roles?.[0] || 'ROLE_ADMIN').replace('ROLE_', '') }} · admin-api</span>
                <small class="user-email">{{ authService.currentUser()?.email || 'usuario@mia.com.gt' }}</small>
              </div>
              <div class="dropdown-divider"></div>
              <button type="button" class="drop-item" (click)="openProfile()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mi Perfil y Accesos
              </button>
              @if (authService.isAdmin()) {
                <button type="button" class="drop-item" (click)="openUsers()">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Gestión de Usuarios
                </button>
                <button type="button" class="drop-item" (click)="openRoles()">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <circle cx="12" cy="11" r="3"/>
                    <path d="M12 14v3"/>
                  </svg>
                  Gestión de Roles
                </button>
                <button type="button" class="drop-item" (click)="resetData()">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M3 21v-5h5"></path>
                  </svg>
                  Restaurar 26 Sistemas Iniciales
                </button>
              }
              <div class="dropdown-divider"></div>
              <button type="button" class="drop-item logout" (click)="onLogout()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          }
        </div>

        <!-- Exit / Logout Icon -->
        <button 
          type="button" 
          class="nav-icon-btn logout-btn" 
          (click)="onLogout()"
          title="Cerrar Sesión">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 68px;
      background: #ffffff;
      border-bottom: 1px solid #edf2f7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .brand-container {
      display: flex;
      align-items: center;
    }

    .logo-svg {
      width: 140px;
      height: 38px;
      display: block;
    }

    .sidebar-toggle-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      color: #0284c7;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .sidebar-toggle-btn:hover {
      background: #f0f9ff;
      border-color: #38bdf8;
      transform: scale(1.05);
    }

    .header-divider {
      width: 1px;
      height: 24px;
      background: #e2e8f0;
    }

    .breadcrumb-nav {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.95rem;
    }

    .crumb-root {
      font-weight: 700;
      color: #0f2744;
      letter-spacing: -0.01em;
    }

    .crumb-separator {
      color: #cbd5e1;
      font-weight: 300;
    }

    .crumb-active {
      color: #64748b;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .new-project-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #0284c7;
      color: #ffffff;
      font-size: 0.84rem;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 999px;
      margin-right: 0.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2);
    }

    .new-project-btn:hover {
      background: #0369a1;
      transform: translateY(-1px);
    }

    .nav-icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.15s ease;
    }

    .nav-icon-btn:hover {
      background: #f1f5f9;
      color: #0284c7;
    }

    .nav-icon-btn.active {
      color: #f59e0b;
      background: #fef3c7;
    }

    .badge-dot {
      position: absolute;
      top: 4px;
      right: 4px;
      background: #f59e0b;
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 999px;
      line-height: 1;
    }

    .user-profile-menu {
      position: relative;
    }

    .user-btn {
      position: relative;
    }

    .online-indicator {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 7px;
      height: 7px;
      background: #10b981;
      border: 1.5px solid #ffffff;
      border-radius: 50%;
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      box-shadow: 0 15px 30px -5px rgba(15, 23, 42, 0.18);
      width: 250px;
      padding: 8px;
      z-index: 200;
    }

    .user-info-header {
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-info-header strong {
      font-size: 0.9rem;
      color: #0f172a;
    }

    .user-info-header span {
      font-size: 0.78rem;
      color: #0284c7;
      font-weight: 600;
    }

    .user-email {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .dropdown-divider {
      height: 1px;
      background: #f1f5f9;
      margin: 6px 0;
    }

    .drop-item {
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      padding: 8px 10px;
      font-size: 0.84rem;
      color: #334155;
      border-radius: 8px;
      text-align: left;
    }

    .drop-item:hover {
      background: #f8fafc;
      color: #0284c7;
    }

    .drop-item.logout {
      color: #ef4444;
    }

    .drop-item.logout:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .logout-btn:hover {
      color: #ef4444;
      background: #fee2e2;
    }

    @media (max-width: 768px) {
      .breadcrumb-nav {
        display: none;
      }
      .new-project-btn span {
        display: none;
      }
      .brand-logo {
        transform: scale(0.9);
      }
    }
  `]
})
export class NavbarComponent {
  protected readonly projectService = inject(ProjectService);
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openNewProject = new EventEmitter<void>();
  @Output() openAppLauncher = new EventEmitter<void>();
  @Output() openProfileModal = new EventEmitter<void>();
  @Output() openRolesModal = new EventEmitter<void>();
  @Output() openUsersModal = new EventEmitter<void>();

  userDropdownOpen = false;

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  toggleFavoritesFilter(): void {
    const current = this.projectService.filter().onlyFavorites;
    this.projectService.setOnlyFavorites(!current);
  }

  openProfile(): void {
    this.userDropdownOpen = false;
    this.openProfileModal.emit();
  }

  openRoles(): void {
    this.userDropdownOpen = false;
    this.openRolesModal.emit();
  }

  openUsers(): void {
    this.userDropdownOpen = false;
    this.openUsersModal.emit();
  }

  resetData(): void {
    this.userDropdownOpen = false;
    this.projectService.resetToDefaultProjects();
  }

  onLogout(): void {
    this.userDropdownOpen = false;
    this.authService.logout();
    this.toastService.info('Sesión corporativa cerrada correctamente.');
    this.router.navigate(['/login']);
  }
}
