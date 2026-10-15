import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-dialog animate-scale" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="title">Perfil de Usuario Autenticado</h2>
          <button type="button" class="close-btn" (click)="onClose()">&times;</button>
        </div>

        <div class="modal-body">
          <div class="profile-banner">
            <div class="avatar-large">
              {{ getUserInitials() }}
            </div>
            <div class="profile-titles">
              <h3>{{ authService.currentUser()?.fullName || 'Usuario Corporativo' }}</h3>
              <span>{{ getRoleTitle() }}</span>
              <small>ID en admin-api: #USR-{{ authService.currentUser()?.id || 1 }} ({{ authService.currentUser()?.username || 'admin' }})</small>
            </div>
          </div>

          <div class="info-list">
            <div class="info-item">
              <span class="label">Correo Electrónico:</span>
              <span class="value">{{ authService.currentUser()?.email || 'usuario@mia.com.gt' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Organización:</span>
              <span class="value">MIA</span>
            </div>
            <div class="info-item">
              <span class="label">Roles Asignados:</span>
              <span class="badge-role">{{ getRoleBadge() }}</span>
            </div>
            <div class="info-item">
              <span class="label">Estado de Sesión:</span>
              <span class="badge-active">JWT Activo en admin-api (8080)</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-primary" (click)="onClose()">Aceptar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-dialog {
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
    }
    .title { font-size: 1.2rem; color: #0f2744; margin: 0; }
    .close-btn { font-size: 1.5rem; color: #94a3b8; }
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .profile-banner {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      background: #f8fafc;
      padding: 1rem 1.25rem;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
    }
    .avatar-large {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #004d88);
      color: #ffffff;
      font-size: 1.3rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .profile-titles h3 { font-size: 1.05rem; margin: 0; color: #0f2744; }
    .profile-titles span { font-size: 0.82rem; color: #0284c7; font-weight: 600; display: block; }
    .profile-titles small { font-size: 0.74rem; color: #94a3b8; }
    .info-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .info-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-bottom: 1px solid #f8fafc; padding-bottom: 0.5rem; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #1e293b; font-weight: 600; }
    .badge-role { background: #e0f2fe; color: #0369a1; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem; }
    .badge-active { background: #ecfdf5; color: #047857; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem; }
    .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
  `]
})
export class ProfileModalComponent {
  protected readonly authService = inject(AuthService);
  @Output() close = new EventEmitter<void>();

  getUserInitials(): string {
    const name = this.authService.currentUser()?.fullName || 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getRoleTitle(): string {
    const roles = this.authService.currentUser()?.roles || [];
    const role = this.authService.currentUser()?.role || roles[0] || 'ROLE_ADMIN';
    if (role.includes('ADMIN')) return 'Administrador Corporativo de Infraestructura';
    if (role.includes('DEVELOPER')) return 'Ingeniero de Software & Microservicios';
    return 'Consultora / Analista de Operaciones';
  }

  getRoleBadge(): string {
    const roles = this.authService.currentUser()?.roles;
    if (roles && roles.length > 0) {
      return roles.map(r => r.replace('ROLE_', '')).join(', ');
    }
    return (this.authService.currentUser()?.role || 'ROLE_ADMIN').replace('ROLE_', '');
  }

  onClose(): void {
    this.close.emit();
  }
}
