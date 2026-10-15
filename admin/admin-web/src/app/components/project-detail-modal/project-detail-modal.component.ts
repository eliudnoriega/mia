import { Component, EventEmitter, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectIconComponent } from '../project-icon/project-icon.component';

@Component({
  selector: 'app-project-detail-modal',
  standalone: true,
  imports: [CommonModule, ProjectIconComponent],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-dialog animate-scale" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-main">
            <app-project-icon 
              [icon]="project().icon" 
              [bgColor]="project().iconBgColor"
              [size]="60">
            </app-project-icon>
            <div class="header-texts">
              <div class="title-badge-row">
                <h2 class="title">{{ project().title }}</h2>
                <span class="badge" [class]="'badge-' + project().environment.toLowerCase()">
                  {{ project().environment }}
                </span>
                <span class="badge badge-active">{{ project().status }}</span>
              </div>
              <p class="subtitle">{{ project().subtitle }}</p>
            </div>
          </div>
          <button type="button" class="close-btn" (click)="onClose()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Content Body -->
        <div class="modal-body">
          <!-- Overview Description -->
          <div class="detail-section">
            <h4 class="section-title">Descripción Operativa</h4>
            <p class="desc-text">{{ project().description }}</p>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-label">Disponibilidad (SLA)</span>
              <strong class="metric-value text-success">{{ project().uptime }}</strong>
              <small class="metric-sub">Últimos 30 días</small>
            </div>

            <div class="metric-card">
              <span class="metric-label">Accesos Registrados</span>
              <strong class="metric-value text-blue">{{ project().accessCount | number }}</strong>
              <small class="metric-sub">Consultas este mes</small>
            </div>

            <div class="metric-card">
              <span class="metric-label">Versión Activa</span>
              <strong class="metric-value">{{ project().version }}</strong>
              <small class="metric-sub">Release estable</small>
            </div>

            <div class="metric-card">
              <span class="metric-label">Último Despliegue</span>
              <strong class="metric-value">{{ project().lastDeploy }}</strong>
              <small class="metric-sub">CI/CD Pipeline</small>
            </div>
          </div>

          <!-- Technical Specs -->
          <div class="tech-table">
            <div class="table-row">
              <span class="tbl-label">Categoría:</span>
              <span class="tbl-val">{{ project().categoryLabel }}</span>
            </div>
            <div class="table-row">
              <span class="tbl-label">Equipo Responsable:</span>
              <span class="tbl-val">{{ project().team }}</span>
            </div>
            <div class="table-row">
              <span class="tbl-label">Endpoint / URL:</span>
              <a [href]="project().url" target="_blank" class="tbl-val link">
                {{ project().url }}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn-secondary" (click)="onEdit()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar Configuración
          </button>
          
          <button type="button" class="btn-primary" (click)="onLaunch()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Ingresar al Sistema
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-dialog {
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    .modal-header {
      padding: 1.5rem 1.75rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      background: #fcfdfe;
    }

    .header-main {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .title-badge-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .title {
      font-size: 1.25rem;
      color: #0f2744;
      margin: 0;
    }

    .subtitle {
      font-size: 0.85rem;
      color: #64748b;
      margin: 2px 0 0 0;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .modal-body {
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .section-title {
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #94a3b8;
      margin-bottom: 0.4rem;
    }

    .desc-text {
      font-size: 0.92rem;
      color: #334155;
      line-height: 1.55;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.85rem;
    }

    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 0.9rem 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-label {
      font-size: 0.74rem;
      color: #64748b;
      font-weight: 500;
    }

    .metric-value {
      font-size: 1.25rem;
      color: #0f2744;
      font-weight: 800;
    }

    .metric-sub {
      font-size: 0.7rem;
      color: #94a3b8;
    }

    .text-success { color: #10b981; }
    .text-blue { color: #0284c7; }

    .tech-table {
      background: #f8fafc;
      border-radius: 12px;
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: column;
    }

    .table-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.84rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .tbl-label {
      color: #64748b;
      font-weight: 500;
    }

    .tbl-val {
      color: #1e293b;
      font-weight: 600;
    }

    .tbl-val.link {
      color: #0284c7;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .tbl-val.link:hover {
      text-decoration: underline;
    }

    .modal-footer {
      padding: 1.25rem 1.75rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      background: #fcfdfe;
    }
  `]
})
export class ProjectDetailModalComponent {
  readonly project = input.required<Project>();

  @Output() close = new EventEmitter<void>();
  @Output() launch = new EventEmitter<Project>();
  @Output() edit = new EventEmitter<Project>();

  onClose(): void {
    this.close.emit();
  }

  onLaunch(): void {
    this.launch.emit(this.project());
  }

  onEdit(): void {
    this.edit.emit(this.project());
  }
}
