import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-dialog animate-scale" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="header-texts">
            <h2 class="title">Monitoreo y Salud de Infraestructura</h2>
            <p class="subtitle">Estado operativo de microservicios, APIs y enlaces en tiempo real</p>
          </div>
          <button type="button" class="close-btn" (click)="onClose()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="status-summary-bar">
            <div class="badge-online">
              <span class="dot"></span> Todos los sistemas centrales operativos
            </div>
            <span class="refresh-time">Actualizado: hace 12s</span>
          </div>

          <div class="service-list">
            <div class="service-item">
              <div class="svc-info">
                <strong>Autenticación SSO & Uniaccess</strong>
                <small>https://auth.mia.com.gt</small>
              </div>
              <span class="latency">34ms</span>
              <span class="status-tag ok">100% Uptime</span>
            </div>

            <div class="service-item">
              <div class="svc-info">
                <strong>MIA Core Gateway API</strong>
                <small>https://api.mia.com.gt</small>
              </div>
              <span class="latency">48ms</span>
              <span class="status-tag ok">99.99% Uptime</span>
            </div>

            <div class="service-item">
              <div class="svc-info">
                <strong>Base de Datos Transaccional PostgreSQL</strong>
                <small>Cluster Azure Primary-Replica</small>
              </div>
              <span class="latency">12ms</span>
              <span class="status-tag ok">99.98% Uptime</span>
            </div>

            <div class="service-item">
              <div class="svc-info">
                <strong>Servidor DTE & SAT Enlace</strong>
                <small>WebService Fiscal Certificado</small>
              </div>
              <span class="latency">112ms</span>
              <span class="status-tag ok">99.95% Uptime</span>
            </div>

            <div class="service-item">
              <div class="svc-info">
                <strong>Campus Virtual y Capacitación</strong>
                <small>https://campus.mia.com.gt</small>
              </div>
              <span class="latency">--</span>
              <span class="status-tag maint">Mantenimiento</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-primary" (click)="onClose()">
            Entendido
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
    }
    .modal-header {
      padding: 1.5rem 1.75rem 1rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
    }
    .title { font-size: 1.25rem; color: #0f2744; margin: 0; }
    .subtitle { font-size: 0.82rem; color: #64748b; margin: 3px 0 0; }
    .close-btn { width: 32px; height: 32px; border-radius: 8px; color: #94a3b8; display: flex; align-items: center; justify-content: center; }
    .modal-body { padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1rem; }
    .status-summary-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ecfdf5;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 1px solid #a7f3d0;
    }
    .badge-online { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 700; color: #065f46; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; }
    .refresh-time { font-size: 0.75rem; color: #047857; }
    .service-list { display: flex; flex-direction: column; gap: 8px; }
    .service-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }
    .svc-info { display: flex; flex-direction: column; }
    .svc-info strong { font-size: 0.86rem; color: #0f172a; }
    .svc-info small { font-size: 0.74rem; color: #64748b; }
    .latency { font-size: 0.8rem; color: #64748b; font-weight: 600; }
    .status-tag { font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
    .status-tag.ok { background: #dcfce7; color: #16a34a; }
    .status-tag.maint { background: #fef3c7; color: #d97706; }
    .modal-footer { padding: 1rem 1.75rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
  `]
})
export class HealthModalComponent {
  @Output() close = new EventEmitter<void>();
  onClose(): void { this.close.emit(); }
}
