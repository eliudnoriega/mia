import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-dialog animate-scale" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-texts">
            <h2 class="title">Mesa de Ayuda & Soporte Técnico</h2>
            <p class="subtitle">Atención centralizada a colaboradores y administradores de sistemas</p>
          </div>
          <button type="button" class="close-btn" (click)="onClose()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="channels-grid">
            <div class="channel-card">
              <div class="channel-icon icon-phone">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="channel-info">
                <strong>Extensión Corporativa</strong>
                <span>Ext. 4000 / PBX: +502 2435-0000</span>
              </div>
            </div>

            <div class="channel-card">
              <div class="channel-icon icon-mail">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="channel-info">
                <strong>Correo Mesa de Ayuda</strong>
                <span>soporte&#64;mia.com.gt</span>
              </div>
            </div>
          </div>

          <!-- Quick Ticket Form -->
          <div class="ticket-section">
            <h4 class="section-title">Generar Ticket Inmediato (Uni-ticket)</h4>
            
            <div class="form-group">
              <label>Sistema Afectado</label>
              <select class="form-control" [(ngModel)]="ticketSystem">
                <option value="Acceso General SSO">Acceso General SSO / Uniaccess</option>
                <option value="Public Web">Public Web</option>
                <option value="Sgd">Sgd (Gestión Documental)</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Consulta Póliza">Consulta Póliza</option>
                <option value="Otro">Otro Sistema</option>
              </select>
            </div>

            <div class="form-group">
              <label>Detalle de la Incidencia</label>
              <textarea 
                rows="3" 
                class="form-control" 
                [(ngModel)]="ticketDescription" 
                placeholder="Describe brevemente el error o solicitud de permiso..."></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn-secondary" (click)="onClose()">
            Cerrar
          </button>
          <button type="button" class="btn-primary" (click)="sendTicket()" [disabled]="!ticketDescription">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Enviar a Mesa de Servicio
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
      max-width: 540px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      border: 1px solid #e2e8f0;
    }

    .modal-header {
      padding: 1.5rem 1.75rem 1rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
    }

    .title {
      font-size: 1.25rem;
      color: #0f2744;
      margin: 0;
    }

    .subtitle {
      font-size: 0.84rem;
      color: #64748b;
      margin: 3px 0 0;
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

    .channels-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .channel-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }

    .channel-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-phone { background: #e0f2fe; color: #0284c7; }
    .icon-mail { background: #dcfce7; color: #16a34a; }

    .channel-info {
      display: flex;
      flex-direction: column;
    }

    .channel-info strong {
      font-size: 0.88rem;
      color: #0f172a;
    }

    .channel-info span {
      font-size: 0.8rem;
      color: #64748b;
    }

    .ticket-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 0.5rem;
    }

    .section-title {
      font-size: 0.86rem;
      color: #0f2744;
      font-weight: 700;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.88rem;
      background: #ffffff;
      color: #1e293b;
    }

    .form-control:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
    }

    .modal-footer {
      padding: 1.25rem 1.75rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class SupportModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() ticketCreated = new EventEmitter<string>();

  ticketSystem = 'Acceso General SSO';
  ticketDescription = '';

  onClose(): void {
    this.close.emit();
  }

  sendTicket(): void {
    if (!this.ticketDescription) return;
    this.ticketCreated.emit(`Ticket generado para ${this.ticketSystem}`);
    this.onClose();
  }
}
