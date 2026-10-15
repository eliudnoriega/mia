import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar-container" [class.collapsed]="isCollapsed()">
      <div class="sidebar-content">
        <!-- Quick search in sidebar matching 'Consulta Póliza' from the screenshot -->
        <div class="sidebar-section">
          <div class="sidebar-search-item" (click)="onSelectQuickAction('consulta-poliza')" title="Consulta Póliza">
            <svg viewBox="0 0 24 24" class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            @if (!isCollapsed()) {
              <span class="item-text font-bold">Consulta Póliza</span>
              <span class="badge-quick">F1</span>
            }
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Main Navigation Links -->
        <div class="nav-group">
          @if (!isCollapsed()) {
            <span class="group-title">NAVEGACIÓN</span>
          }

          <button 
            type="button" 
            class="nav-link" 
            [class.active]="currentSection === 'dashboard' && !projectService.filter().onlyFavorites"
            (click)="selectSection('dashboard')"
            title="Todos los Sistemas">
            <svg viewBox="0 0 24 24" class="sidebar-icon" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
            @if (!isCollapsed()) {
              <span class="item-text">Todos los Sistemas</span>
              <span class="count-tag">{{ projectService.totalFilteredCount() }}</span>
            }
          </button>

          <button 
            type="button" 
            class="nav-link" 
            [class.active]="projectService.filter().onlyFavorites"
            (click)="selectFavorites()"
            title="Mis Favoritos">
            <svg viewBox="0 0 24 24" class="sidebar-icon star" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            @if (!isCollapsed()) {
              <span class="item-text">Mis Favoritos</span>
              <span class="count-tag favorite">{{ projectService.favoritesCount() }}</span>
            }
          </button>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Categories Filter from Sidebar -->
        <div class="nav-group">
          @if (!isCollapsed()) {
            <span class="group-title">CATEGORÍAS</span>
          }

          <button 
            type="button" 
            class="nav-link cat-link" 
            [class.active]="projectService.filter().category === 'corporativo'"
            (click)="filterCategory('corporativo')"
            title="Corporativo">
            <span class="cat-dot dot-blue"></span>
            @if (!isCollapsed()) {
              <span class="item-text">Corporativo</span>
            }
          </button>

          <button 
            type="button" 
            class="nav-link cat-link" 
            [class.active]="projectService.filter().category === 'web'"
            (click)="filterCategory('web')"
            title="Portales Web">
            <span class="cat-dot dot-sky"></span>
            @if (!isCollapsed()) {
              <span class="item-text">Portales Web</span>
            }
          </button>

          <button 
            type="button" 
            class="nav-link cat-link" 
            [class.active]="projectService.filter().category === 'api'"
            (click)="filterCategory('api')"
            title="APIs & Servicios">
            <span class="cat-dot dot-purple"></span>
            @if (!isCollapsed()) {
              <span class="item-text">APIs & Backend</span>
            }
          </button>

          <button 
            type="button" 
            class="nav-link cat-link" 
            [class.active]="projectService.filter().category === 'finanzas'"
            (click)="filterCategory('finanzas')"
            title="Finanzas y Cobranzas">
            <span class="cat-dot dot-emerald"></span>
            @if (!isCollapsed()) {
              <span class="item-text">Finanzas & Ventas</span>
            }
          </button>

          <button 
            type="button" 
            class="nav-link cat-link" 
            [class.active]="projectService.filter().category === 'operaciones'"
            (click)="filterCategory('operaciones')"
            title="Operaciones">
            <span class="cat-dot dot-amber"></span>
            @if (!isCollapsed()) {
              <span class="item-text">Operaciones & Tablet</span>
            }
          </button>

          <button 
            type="button" 
            class="nav-link cat-link" 
            [class.active]="projectService.filter().category === 'seguridad'"
            (click)="filterCategory('seguridad')"
            title="Seguridad y Accesos">
            <span class="cat-dot dot-rose"></span>
            @if (!isCollapsed()) {
              <span class="item-text">Seguridad & SSO</span>
            }
          </button>
        </div>

        <!-- Management Tools (Solo visible para ADMIN) -->
        @if (authService.isAdmin()) {
          <div class="sidebar-divider"></div>

          <div class="nav-group">
            @if (!isCollapsed()) {
              <span class="group-title">ADMINISTRACIÓN</span>
            }

            <button 
              type="button" 
              class="nav-link" 
              (click)="openNewProject.emit()"
              title="Registrar Nuevo Sistema">
              <svg viewBox="0 0 24 24" class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              @if (!isCollapsed()) {
                <span class="item-text">Alta de Sistemas</span>
              }
            </button>

            <button 
              type="button" 
              class="nav-link" 
              (click)="openUsersModal.emit()"
              title="Gestión y Administración de Usuarios & Empresas">
              <svg viewBox="0 0 24 24" class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              @if (!isCollapsed()) {
                <span class="item-text">Gestión de Usuarios</span>
              }
            </button>

            <button 
              type="button" 
              class="nav-link" 
              (click)="openRolesModal.emit()"
              title="Gestión y Administración de Roles">
              <svg viewBox="0 0 24 24" class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <circle cx="12" cy="11" r="3"/>
                <path d="M12 14v3"/>
              </svg>
              @if (!isCollapsed()) {
                <span class="item-text">Gestión de Roles</span>
              }
            </button>

            <button 
              type="button" 
              class="nav-link" 
              (click)="openHealthModal.emit()"
              title="Monitoreo de Infraestructura">
              <svg viewBox="0 0 24 24" class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              @if (!isCollapsed()) {
                <span class="item-text">Salud & Telemetría</span>
              }
            </button>
          </div>
        }
      </div>

      <!-- Collapsed user info footer -->
      <div class="sidebar-footer">
        @if (!isCollapsed()) {
          <div class="footer-user-card">
            <div class="user-avatar-small">{{ getUserInitials() }}</div>
            <div class="user-details">
              <span class="user-name">{{ authService.displayName() }}</span>
              <span class="user-status">En línea (SSO)</span>
            </div>
          </div>
        } @else {
          <div class="user-avatar-small centered" [title]="authService.displayName()">{{ getUserInitials() }}</div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      width: 250px;
      background: #ffffff;
      border-right: 1px solid #edf2f7;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      min-height: calc(100vh - 68px);
    }

    .sidebar-container.collapsed {
      width: 68px;
    }

    .sidebar-content {
      padding: 1.25rem 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .sidebar-section {
      margin-bottom: 0.5rem;
    }

    .sidebar-search-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      color: #0284c7;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .sidebar-search-item:hover {
      background: #f0f9ff;
      border-color: #38bdf8;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.1);
    }

    .badge-quick {
      margin-left: auto;
      font-size: 0.65rem;
      font-weight: 700;
      background: #e2e8f0;
      color: #64748b;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .sidebar-divider {
      height: 1px;
      background: #f1f5f9;
      margin: 0.75rem 0;
    }

    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .group-title {
      font-size: 0.68rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.05em;
      padding: 0 10px 6px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 12px;
      border-radius: 10px;
      color: #475569;
      font-size: 0.88rem;
      font-weight: 500;
      width: 100%;
      text-align: left;
      transition: all 0.15s ease;
    }

    .nav-link:hover {
      background: #f1f5f9;
      color: #0284c7;
    }

    .nav-link.active {
      background: #e0f2fe;
      color: #0284c7;
      font-weight: 600;
    }

    .sidebar-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .sidebar-icon.star {
      color: #f59e0b;
    }

    .item-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .count-tag {
      font-size: 0.72rem;
      background: #f1f5f9;
      color: #64748b;
      padding: 2px 7px;
      border-radius: 999px;
      font-weight: 600;
    }

    .count-tag.favorite {
      background: #fef3c7;
      color: #b45309;
    }

    .cat-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .dot-blue { background: #0284c7; }
    .dot-sky { background: #38bdf8; }
    .dot-purple { background: #8b5cf6; }
    .dot-emerald { background: #10b981; }
    .dot-amber { background: #f59e0b; }
    .dot-rose { background: #f43f5e; }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #edf2f7;
    }

    .footer-user-card {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar-small {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #00508f);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.78rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar-small.centered {
      margin: 0 auto;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-status {
      font-size: 0.7rem;
      color: #10b981;
    }

    @media (max-width: 992px) {
      .sidebar-container {
        position: fixed;
        left: 0;
        top: 68px;
        bottom: 0;
        z-index: 90;
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
      }
      .sidebar-container.collapsed {
        transform: translateX(-100%);
      }
    }
  `]
})
export class SidebarComponent {
  protected readonly projectService = inject(ProjectService);
  protected readonly authService = inject(AuthService);

  readonly isCollapsed = input<boolean>(false);

  @Output() quickAction = new EventEmitter<string>();
  @Output() openNewProject = new EventEmitter<void>();
  @Output() openHealthModal = new EventEmitter<void>();
  @Output() openRolesModal = new EventEmitter<void>();
  @Output() openUsersModal = new EventEmitter<void>();

  currentSection = 'dashboard';

  getUserInitials(): string {
    const name = this.authService.displayName();
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  selectSection(section: string): void {
    this.currentSection = section;
    this.projectService.setOnlyFavorites(false);
    this.projectService.setCategory('todos');
  }

  selectFavorites(): void {
    this.projectService.setOnlyFavorites(true);
  }

  filterCategory(category: any): void {
    this.projectService.setOnlyFavorites(false);
    this.projectService.setCategory(category);
  }

  onSelectQuickAction(action: string): void {
    this.quickAction.emit(action);
  }
}
