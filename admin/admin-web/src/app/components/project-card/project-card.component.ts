import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectIconComponent } from '../project-icon/project-icon.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, ProjectIconComponent],
  template: `
    <div class="project-card" [class.is-favorite]="project().isFavorite">
      <!-- Card Top: Icon, Title & Quick Actions -->
      <div class="card-header">
        <div class="icon-and-title">
          <app-project-icon 
            [icon]="project().icon" 
            [bgColor]="project().iconBgColor"
            [size]="54">
          </app-project-icon>
          
          <div class="title-container">
            <h3 class="project-title" [title]="project().title">{{ project().title }}</h3>
            <div class="meta-badges">
              <span class="env-badge" [class]="'env-' + project().environment.toLowerCase()">
                {{ project().environment }}
              </span>
              <span class="status-indicator" [class]="project().status" [title]="'Estado: ' + project().status"></span>
            </div>
          </div>
        </div>

        <div class="top-actions">
          <!-- Favorite Star Toggle -->
          <button 
            type="button" 
            class="action-btn star-btn" 
            [class.starred]="project().isFavorite"
            (click)="onToggleFavorite($event)"
            title="Marcar como favorito">
            <svg viewBox="0 0 24 24" class="star-icon" fill="currentColor">
              @if (project().isFavorite) {
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              } @else {
                <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
              }
            </svg>
          </button>

          <!-- More Options Menu Button (Solo visible para ADMIN) -->
          @if (authService.isAdmin()) {
            <div class="menu-container">
              <button 
                type="button" 
                class="action-btn dots-btn" 
                (click)="toggleMenu($event)"
                title="Opciones de administración">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>

              @if (menuOpen) {
                <div class="dropdown-menu animate-scale" (click)="$event.stopPropagation()">
                  <button type="button" class="menu-item" (click)="onLaunch()">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Abrir sistema
                  </button>
                  <button type="button" class="menu-item" (click)="onViewDetails()">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    Detalles y Métricas
                  </button>
                  <button type="button" class="menu-item" (click)="onEdit()">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar proyecto
                  </button>
                  <div class="divider"></div>
                  <button type="button" class="menu-item danger" (click)="onDelete()">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Eliminar
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Card Bottom: Subtitle/Description & Launch Button -->
      <div class="card-footer">
        <p class="project-subtitle" [title]="project().subtitle">
          {{ project().subtitle }}
        </p>

        <button 
          type="button" 
          class="launch-circle-btn" 
          (click)="onLaunch()"
          [title]="'Ingresar a ' + project().title">
          <svg viewBox="0 0 24 24" class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .project-card {
      position: relative;
      background: #ffffff;
      border-radius: 18px;
      padding: 1.15rem 1.25rem;
      border: 1px solid #eef3f8;
      box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 140px;
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 28px -6px rgba(2, 132, 199, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05);
      border-color: #dbeafe;
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .icon-and-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 0;
    }

    .title-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }

    .project-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f2744;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }

    .meta-badges {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .env-badge {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      letter-spacing: 0.02em;
    }

    .env-prod {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }

    .env-stage {
      background: #fffbeb;
      color: #d97706;
      border: 1px solid #fde68a;
    }

    .env-dev {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }

    .status-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
    }

    .status-indicator.active {
      background-color: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .status-indicator.maintenance {
      background-color: #f59e0b;
      box-shadow: 0 0 6px #f59e0b;
    }

    .status-indicator.offline {
      background-color: #ef4444;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      position: relative;
    }

    .action-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: #94a3b8;
      transition: all 0.15s ease;
    }

    .action-btn:hover {
      background: #f1f5f9;
      color: #475569;
    }

    .star-btn {
      color: #cbd5e1;
    }

    .star-btn:hover {
      color: #f59e0b;
    }

    .star-btn.starred {
      color: #f59e0b;
    }

    .star-icon {
      width: 19px;
      height: 19px;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 0.6rem;
    }

    .project-subtitle {
      font-size: 0.85rem;
      color: #64748b;
      line-height: 1.35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      margin: 0;
    }

    .launch-circle-btn {
      width: 36px;
      height: 36px;
      min-width: 36px;
      border-radius: 50%;
      background: #e1f0fa;
      color: #0284c7;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .arrow-icon {
      width: 17px;
      height: 17px;
      transition: transform 0.2s ease;
    }

    .project-card:hover .launch-circle-btn {
      background: #0284c7;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
      transform: scale(1.06);
    }

    .project-card:hover .launch-circle-btn .arrow-icon {
      transform: translateX(2px);
    }

    /* Dropdown Menu */
    .menu-container {
      position: relative;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 6px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);
      width: 170px;
      z-index: 50;
      padding: 6px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 7px 10px;
      font-size: 0.84rem;
      color: #334155;
      border-radius: 6px;
      text-align: left;
    }

    .menu-item:hover {
      background: #f1f5f9;
      color: #0284c7;
    }

    .menu-item.danger {
      color: #ef4444;
    }

    .menu-item.danger:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .divider {
      height: 1px;
      background: #f1f5f9;
      margin: 4px 0;
    }
  `]
})
export class ProjectCardComponent {
  protected readonly authService = inject(AuthService);
  readonly project = input.required<Project>();

  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() launch = new EventEmitter<Project>();
  @Output() viewDetails = new EventEmitter<Project>();
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  menuOpen = false;

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.project().id);
  }

  onLaunch(): void {
    this.menuOpen = false;
    this.launch.emit(this.project());
  }

  onViewDetails(): void {
    this.menuOpen = false;
    this.viewDetails.emit(this.project());
  }

  onEdit(): void {
    this.menuOpen = false;
    this.edit.emit(this.project());
  }

  onDelete(): void {
    this.menuOpen = false;
    this.delete.emit(this.project());
  }
}
