import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item animate-scale" [class]="'toast-' + toast.type">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
              @default {
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
            }
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button type="button" class="toast-close" (click)="toastService.dismiss(toast.id)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }

    .toast-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.2);
      border: 1px solid #e2e8f0;
      font-size: 0.88rem;
      color: #1e293b;
    }

    .toast-success {
      border-left: 4px solid #10b981;
      .toast-icon { color: #10b981; }
    }

    .toast-error {
      border-left: 4px solid #ef4444;
      .toast-icon { color: #ef4444; }
    }

    .toast-warning {
      border-left: 4px solid #f59e0b;
      .toast-icon { color: #f59e0b; }
    }

    .toast-info {
      border-left: 4px solid #0284c7;
      .toast-icon { color: #0284c7; }
    }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-message {
      flex: 1;
      font-weight: 500;
      line-height: 1.35;
    }

    .toast-close {
      font-size: 1.25rem;
      color: #94a3b8;
      line-height: 1;
      padding: 0 4px;
    }

    .toast-close:hover {
      color: #475569;
    }
  `]
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
