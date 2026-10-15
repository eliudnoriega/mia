import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-policy-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-dialog animate-scale" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-texts">
            <div class="badge-tag">Módulo Corporativo</div>
            <h2 class="title">Consulta Rápida de Póliza</h2>
            <p class="subtitle">Búsqueda directa en el sistema central de emisión y vigencias</p>
          </div>
          <button type="button" class="close-btn" (click)="onClose()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="modal-body">
          <div class="search-box">
            <div class="input-wrapper">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                class="search-input" 
                [(ngModel)]="searchQuery" 
                (keyup.enter)="searchPolicy()"
                placeholder="Ingresa número de póliza, certificado o DPI (ej. POL-98421)...">
            </div>
            <button type="button" class="btn-primary" (click)="searchPolicy()">
              Buscar Póliza
            </button>
          </div>

          <!-- Result Area -->
          @if (hasSearched) {
            <div class="result-card animate-scale">
              <div class="result-header">
                <div class="policy-number-block">
                  <span class="lbl">No. Póliza:</span>
                  <strong class="num">POL-2026-98421</strong>
                </div>
                <span class="status-pill active">Vigente y Al Día</span>
              </div>

              <div class="result-grid">
                <div class="grid-item">
                  <span class="g-lbl">Asegurado Titular:</span>
                  <span class="g-val">{{ authService.displayName() }}</span>
                </div>
                <div class="grid-item">
                  <span class="g-lbl">Ramo / Producto:</span>
                  <span class="g-val">Seguro Médico Vitalis Premium</span>
                </div>
                <div class="grid-item">
                  <span class="g-lbl">Vigencia:</span>
                  <span class="g-val">01/01/2026 al 31/12/2026</span>
                </div>
                <div class="grid-item">
                  <span class="g-lbl">Suma Asegurada:</span>
                  <span class="g-val text-success">Q 1,000,000.00</span>
                </div>
              </div>

              <div class="quick-actions-bar">
                <button type="button" class="btn-secondary" (click)="downloadCert()">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Descargar Certificado PDF
                </button>
                <button type="button" class="btn-outline-blue" (click)="goToSystem()">
                  Abrir en Módulo de Emisión
                </button>
              </div>
            </div>
          } @else {
            <div class="empty-hint">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#cbd5e1" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <p>Escribe el número de póliza o presiona "Buscar Póliza" para una demostración instantánea</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-dialog {
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 620px;
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

    .badge-tag {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      color: #0284c7;
      background: #e0f2fe;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
    }

    .title {
      font-size: 1.3rem;
      color: #0f2744;
      margin: 0;
    }

    .subtitle {
      font-size: 0.85rem;
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

    .search-box {
      display: flex;
      gap: 0.75rem;
    }

    .input-wrapper {
      position: relative;
      flex: 1;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .search-input {
      width: 100%;
      padding: 10px 14px 10px 38px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.9rem;
    }

    .search-input:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
    }

    .empty-hint {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2.5rem 1rem;
      color: #94a3b8;
      gap: 0.75rem;
      font-size: 0.88rem;
    }

    .result-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.75rem;
    }

    .policy-number-block {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .lbl { font-size: 0.84rem; color: #64748b; }
    .num { font-size: 1.1rem; color: #0284c7; font-weight: 800; }

    .status-pill {
      font-size: 0.76rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
    }

    .status-pill.active {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }

    .result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }

    .grid-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .g-lbl { font-size: 0.75rem; color: #64748b; }
    .g-val { font-size: 0.88rem; color: #1e293b; font-weight: 600; }
    .text-success { color: #059669; font-weight: 700; }

    .quick-actions-bar {
      display: flex;
      gap: 0.75rem;
      padding-top: 0.5rem;
    }

    @media (max-width: 600px) {
      .search-box {
        flex-direction: column;
      }
      .result-grid {
        grid-template-columns: 1fr;
      }
      .quick-actions-bar {
        flex-direction: column;
      }
    }
  `]
})
export class PolicyModalComponent {
  @Output() close = new EventEmitter<void>();
  protected authService = inject(AuthService);

  searchQuery = 'POL-2026-98421';
  hasSearched = true;

  searchPolicy(): void {
    this.hasSearched = true;
  }

  downloadCert(): void {
    alert('Descargando Certificado Oficial de Póliza POL-2026-98421 (PDF)...');
  }

  goToSystem(): void {
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }
}
