import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectIconComponent } from '../project-icon/project-icon.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-list-row',
  standalone: true,
  imports: [CommonModule, ProjectIconComponent],
  template: `
    <div class="list-row" [class.is-favorite]="project().isFavorite">
      <div class="row-left">
        <!-- Favorite Star -->
        <button 
          type="button" 
          class="star-btn" 
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

        <app-project-icon 
          [icon]="project().icon" 
          [bgColor]="project().iconBgColor"
          [size]="42">
        </app-project-icon>

        <div class="info-cell">
          <div class="title-line">
            <span class="project-title">{{ project().title }}</span>
            <span class="env-pill" [class]="'env-' + project().environment.toLowerCase()">{{ project().environment }}</span>
          </div>
          <p class="subtitle-text">{{ project().subtitle }}</p>
        </div>
      </div>

      <div class="row-middle">
        <span class="category-badge">{{ project().categoryLabel }}</span>
        <span class="uptime-stat">Uptime: <strong>{{ project().uptime }}</strong></span>
        <span class="version-stat">{{ project().version }}</span>
      </div>

      <div class="row-right">
        <button type="button" class="action-icon-btn" (click)="onViewDetails()" title="Ver detalles y métricas">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </button>

        @if (authService.isAdmin()) {
          <button type="button" class="action-icon-btn" (click)="onEdit()" title="Editar proyecto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          <button type="button" class="action-icon-btn delete" (click)="onDelete()" title="Eliminar">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        }

        <button type="button" class="launch-btn" (click)="onLaunch()" title="Ingresar">
          <span>Ingresar</span>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .list-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      background: #ffffff;
      border-radius: 14px;
      padding: 0.85rem 1.25rem;
      border: 1px solid #edf2f7;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
    }

    .list-row:hover {
      border-color: #bfdbfe;
      background: #fdfefe;
      box-shadow: 0 8px 18px -4px rgba(2, 132, 199, 0.08);
      transform: translateX(3px);
    }

    .row-left {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      flex: 1.5;
      min-width: 0;
    }

    .star-btn {
      color: #cbd5e1;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .star-btn.starred {
      color: #f59e0b;
    }

    .star-icon {
      width: 18px;
      height: 18px;
    }

    .info-cell {
      min-width: 0;
    }

    .title-line {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .project-title {
      font-weight: 700;
      color: #0f2744;
      font-size: 0.96rem;
    }

    .env-pill {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .env-prod { background: #ecfdf5; color: #059669; }
    .env-stage { background: #fffbeb; color: #d97706; }
    .env-dev { background: #eff6ff; color: #2563eb; }

    .subtitle-text {
      font-size: 0.82rem;
      color: #64748b;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .row-middle {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.84rem;
      color: #64748b;
    }

    .category-badge {
      background: #f1f5f9;
      color: #475569;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 500;
    }

    .row-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s ease;
    }

    .action-icon-btn:hover {
      background: #f1f5f9;
      color: #0284c7;
    }

    .action-icon-btn.delete:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .launch-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #e1f0fa;
      color: #0284c7;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
      margin-left: 0.5rem;
      transition: all 0.2s ease;
    }

    .launch-btn:hover {
      background: #0284c7;
      color: #ffffff;
    }

    @media (max-width: 860px) {
      .row-middle {
        display: none;
      }
    }
  `]
})
export class ProjectListRowComponent {
  protected readonly authService = inject(AuthService);
  readonly project = input.required<Project>();

  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() launch = new EventEmitter<Project>();
  @Output() viewDetails = new EventEmitter<Project>();
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  onToggleFavorite(e: Event): void {
    e.stopPropagation();
    this.toggleFavorite.emit(this.project().id);
  }

  onLaunch(): void {
    this.launch.emit(this.project());
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.project());
  }

  onEdit(): void {
    this.edit.emit(this.project());
  }

  onDelete(): void {
    this.delete.emit(this.project());
  }
}
