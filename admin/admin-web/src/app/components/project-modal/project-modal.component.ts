import { Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectCategory, ProjectEnvironment, ProjectStatus } from '../../models/project.model';
import { ProjectIconComponent } from '../project-icon/project-icon.component';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectIconComponent],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-dialog animate-scale" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-titles">
            <h2 class="modal-title">
              {{ projectToEdit() ? 'Editar Sistema / Proyecto' : 'Registrar Nuevo Sistema' }}
            </h2>
            <p class="modal-subtitle">
              Administración de plataformas y herramientas corporativas para el portal centralizado
            </p>
          </div>
          <button type="button" class="close-btn" (click)="onCancel()" title="Cerrar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form (ngSubmit)="onSubmit()" class="modal-form">
          <div class="form-grid">
            <!-- Project Title -->
            <div class="form-group col-span-2">
              <label for="p-title">Nombre del Sistema <span class="req">*</span></label>
              <input 
                id="p-title" 
                type="text" 
                class="form-control" 
                [(ngModel)]="formData.title" 
                name="title" 
                placeholder="Ej. Sistema Gestión De Cartera" 
                required>
            </div>

            <!-- Subtitle / Tagline -->
            <div class="form-group col-span-2">
              <label for="p-subtitle">Subtítulo / Identificador Corto <span class="req">*</span></label>
              <input 
                id="p-subtitle" 
                type="text" 
                class="form-control" 
                [(ngModel)]="formData.subtitle" 
                name="subtitle" 
                placeholder="Ej. Api Para Sgd o App Ejecutivos" 
                required>
            </div>

            <!-- Description -->
            <div class="form-group col-span-2">
              <label for="p-desc">Descripción Operativa</label>
              <textarea 
                id="p-desc" 
                rows="2" 
                class="form-control" 
                [(ngModel)]="formData.description" 
                name="description" 
                placeholder="Detalle de funciones principales y usuarios objetivo"></textarea>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label for="p-cat">Categoría <span class="req">*</span></label>
              <select id="p-cat" class="form-control select" [(ngModel)]="formData.category" name="category" (change)="onCategoryChange()">
                <option value="corporativo">Corporativo</option>
                <option value="web">Portales Web</option>
                <option value="api">APIs & Backend</option>
                <option value="rrhh">Recursos Humanos</option>
                <option value="operaciones">Operaciones & Tablet</option>
                <option value="finanzas">Finanzas & Ventas</option>
                <option value="seguridad">Seguridad & SSO</option>
                <option value="soporte">Mesa de Ayuda TI</option>
              </select>
            </div>

            <!-- Environment -->
            <div class="form-group">
              <label for="p-env">Entorno de Despliegue</label>
              <select id="p-env" class="form-control select" [(ngModel)]="formData.environment" name="environment">
                <option value="PROD">Producción (PROD)</option>
                <option value="STAGE">Pruebas / Staging (STAGE)</option>
                <option value="DEV">Desarrollo (DEV)</option>
              </select>
            </div>

            <!-- URL -->
            <div class="form-group col-span-2">
              <label for="p-url">URL de Acceso Directo <span class="req">*</span></label>
              <input 
                id="p-url" 
                type="url" 
                class="form-control" 
                [(ngModel)]="formData.url" 
                name="url" 
                placeholder="https://sistema.mia.com.gt" 
                required>
            </div>

            <!-- Team / Responsable & Version -->
            <div class="form-group">
              <label for="p-team">Equipo Responsable</label>
              <input 
                id="p-team" 
                type="text" 
                class="form-control" 
                [(ngModel)]="formData.team" 
                name="team" 
                placeholder="Ej. Core Architecture">
            </div>

            <div class="form-group">
              <label for="p-ver">Versión</label>
              <input 
                id="p-ver" 
                type="text" 
                class="form-control" 
                [(ngModel)]="formData.version" 
                name="version" 
                placeholder="v1.0.0">
            </div>

            <!-- Icon Selector -->
            <div class="form-group col-span-2">
              <label>Icono Representativo</label>
              <div class="icon-picker">
                @for (ic of availableIcons; track ic) {
                  <button 
                    type="button" 
                    class="icon-option" 
                    [class.selected]="formData.icon === ic"
                    (click)="formData.icon = ic">
                    <app-project-icon [icon]="ic" [size]="36"></app-project-icon>
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="onCancel()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" [disabled]="!formData.title || !formData.url">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>{{ projectToEdit() ? 'Actualizar Sistema' : 'Guardar y Publicar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-dialog {
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 1.5rem 1.75rem 1rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
    }

    .modal-title {
      font-size: 1.28rem;
      color: #0f2744;
      margin: 0;
    }

    .modal-subtitle {
      font-size: 0.82rem;
      color: #64748b;
      margin-top: 4px;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .close-btn:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .modal-form {
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .col-span-2 {
      grid-column: span 2;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #334155;
    }

    .req {
      color: #ef4444;
    }

    .form-control {
      width: 100%;
      padding: 9px 12px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #1e293b;
      background: #ffffff;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .form-control:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
    }

    .form-control.select {
      cursor: pointer;
    }

    .icon-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }

    .icon-option {
      padding: 4px;
      border-radius: 10px;
      border: 2px solid transparent;
      background: transparent;
      transition: all 0.15s ease;
    }

    .icon-option:hover {
      transform: scale(1.08);
      background: #ffffff;
    }

    .icon-option.selected {
      border-color: #0284c7;
      background: #e0f2fe;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.2);
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .col-span-2 {
        grid-column: span 1;
      }
    }
  `]
})
export class ProjectModalComponent implements OnInit {
  readonly projectToEdit = input<Project | null>(null);

  @Output() save = new EventEmitter<Omit<Project, 'id' | 'accessCount' | 'uptime' | 'lastDeploy'>>();
  @Output() cancel = new EventEmitter<void>();

  availableIcons = [
    'cloud-web',
    'handshake',
    'browser-www',
    'tablet-check',
    'wallet-user',
    'security-lock',
    'ticket-support',
    'sales-growth',
    'shield-check',
    'invoice',
    'chart-bar'
  ];

  formData: {
    title: string;
    subtitle: string;
    description: string;
    category: ProjectCategory;
    categoryLabel: string;
    icon: string;
    iconBgColor: string;
    url: string;
    environment: ProjectEnvironment;
    status: ProjectStatus;
    team: string;
    version: string;
  } = {
    title: '',
    subtitle: '',
    description: '',
    category: 'web',
    categoryLabel: 'Portal Web',
    icon: 'browser-www',
    iconBgColor: '#e0f2fe',
    url: 'https://',
    environment: 'PROD',
    status: 'active',
    team: 'Equipo TI Corporativo',
    version: 'v1.0.0'
  };

  ngOnInit(): void {
    const edit = this.projectToEdit();
    if (edit) {
      this.formData = {
        title: edit.title,
        subtitle: edit.subtitle,
        description: edit.description,
        category: edit.category,
        categoryLabel: edit.categoryLabel,
        icon: edit.icon,
        iconBgColor: edit.iconBgColor || '#e0f2fe',
        url: edit.url,
        environment: edit.environment,
        status: edit.status,
        team: edit.team || '',
        version: edit.version || 'v1.0.0'
      };
    }
  }

  onCategoryChange(): void {
    const labels: Record<string, string> = {
      corporativo: 'Corporativo',
      web: 'Portal Web',
      api: 'Infraestructura API',
      rrhh: 'Recursos Humanos',
      operaciones: 'Operaciones',
      finanzas: 'Finanzas & Ventas',
      seguridad: 'Seguridad e Identidad',
      soporte: 'Mesa de Ayuda'
    };
    this.formData.categoryLabel = labels[this.formData.category] || 'General';
  }

  onSubmit(): void {
    if (!this.formData.title || !this.formData.url) return;
    this.onCategoryChange();
    this.save.emit({
      title: this.formData.title,
      subtitle: this.formData.subtitle || this.formData.title,
      description: this.formData.description || this.formData.subtitle,
      category: this.formData.category,
      categoryLabel: this.formData.categoryLabel,
      icon: this.formData.icon,
      iconBgColor: this.formData.iconBgColor,
      url: this.formData.url,
      environment: this.formData.environment,
      status: this.formData.status,
      team: this.formData.team,
      version: this.formData.version,
      isFavorite: this.projectToEdit()?.isFavorite ?? false
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
