import { Component, input } from '@angular/core';

@Component({
  selector: 'app-project-icon',
  standalone: true,
  template: `
    <div 
      class="icon-wrapper" 
      [style.background]="bgStyle()"
      [style.width.px]="size()"
      [style.height.px]="size()">
      
      @switch (icon()) {
        @case ('cloud-web') {
          <!-- Cloud with pages -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#3b82f6" fill-opacity="0.15"/>
            <path d="M35 27c0-4.4-3.6-8-8-8-1.1 0-2.2.2-3.1.7C22.6 16.5 19.5 15 16 15c-5 0-9 4-9 9 0 .5 0 1 .1 1.5C5.7 27.2 4 29.4 4 32c0 3.9 3.1 7 7 7h24c3.9 0 7-3.1 7-7 0-2.5-1.3-4.6-3.3-5.8" fill="#60a5fa"/>
            <rect x="17" y="24" width="14" height="15" rx="3" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
            <rect x="20" y="27" width="8" height="2" rx="1" fill="#93c5fd"/>
            <rect x="20" y="31" width="8" height="2" rx="1" fill="#bfdbfe"/>
            <rect x="14" y="27" width="13" height="13" rx="2" fill="#dbeafe" opacity="0.8"/>
          </svg>
        }
        @case ('handshake') {
          <!-- Handshake with checkmark -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#10b981" fill-opacity="0.15"/>
            <circle cx="24" cy="24" r="17" fill="#0284c7" />
            <!-- Two hands shaking -->
            <path d="M14 26l6-4 4 3-2 3-5 3-3-5z" fill="#fbcfe8"/>
            <path d="M34 26l-6-4-4 3 2 3 5 3 3-5z" fill="#fed7aa"/>
            <path d="M12 28l5 4h6l-3-4h-8z" fill="#38bdf8"/>
            <path d="M36 28l-5 4h-6l3-4h8z" fill="#f97316"/>
            <!-- Checkmark badge -->
            <circle cx="24" cy="15" r="5" fill="#10b981"/>
            <path d="M21.5 15l2 2 3.5-3.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
        @case ('browser-www') {
          <!-- Browser window with WWW and mouse cursor -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#0284c7" fill-opacity="0.15"/>
            <!-- Browser window -->
            <rect x="9" y="11" width="30" height="26" rx="4" fill="#38bdf8" />
            <rect x="9" y="11" width="30" height="7" rx="4" fill="#0284c7"/>
            <circle cx="14" cy="14.5" r="1.5" fill="#f87171"/>
            <circle cx="19" cy="14.5" r="1.5" fill="#facc15"/>
            <circle cx="24" cy="14.5" r="1.5" fill="#4ade80"/>
            <!-- Inner area -->
            <rect x="12" y="21" width="24" height="13" rx="2" fill="#ffffff"/>
            <text x="24" y="29.5" fill="#0369a1" font-size="7" font-weight="800" text-anchor="middle" font-family="sans-serif">WWW</text>
            <!-- Pointer cursor -->
            <path d="M29 27l6 6-2 1-1 3-2-5-3 2 2-7z" fill="#0f172a" stroke="#ffffff" stroke-width="0.8"/>
          </svg>
        }
        @case ('tablet-check') {
          <!-- Tablet with dollar sign -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#f59e0b" fill-opacity="0.15"/>
            <rect x="12" y="9" width="24" height="30" rx="5" fill="#0f172a"/>
            <rect x="15" y="13" width="18" height="21" rx="2" fill="#0369a1"/>
            <!-- Home button -->
            <circle cx="24" cy="36.5" r="1.2" fill="#94a3b8"/>
            <!-- Screen dollar badge -->
            <rect x="18" y="17" width="12" height="13" rx="3" fill="#f59e0b"/>
            <text x="24" y="26.5" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="sans-serif">$</text>
          </svg>
        }
        @case ('wallet-user') {
          <!-- Avatar / ID Card with wallet -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#6366f1" fill-opacity="0.15"/>
            <!-- Character circle badge -->
            <circle cx="24" cy="24" r="17" fill="#0ea5e9"/>
            <circle cx="24" cy="19" r="6" fill="#fde047"/>
            <path d="M20 18c0 1 .5 2 1.5 2s1.5-1 1.5-2" stroke="#0f172a" stroke-width="1.2"/>
            <path d="M25 18c0 1 .5 2 1.5 2s1.5-1 1.5-2" stroke="#0f172a" stroke-width="1.2"/>
            <!-- Hair -->
            <path d="M17 17c1-5 13-5 14 0-2-3-11-3-14 0z" fill="#334155"/>
            <!-- Torso / Suit -->
            <path d="M14 36c1-6 6-9 10-9s9 3 10 9H14z" fill="#1e293b"/>
            <!-- ID Card in hand / card badge -->
            <rect x="25" y="27" width="11" height="8" rx="2" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8"/>
            <circle cx="28" cy="31" r="1.5" fill="#60a5fa"/>
            <line x1="31" y1="30" x2="34" y2="30" stroke="#cbd5e1" stroke-width="1"/>
            <line x1="31" y1="32" x2="34" y2="32" stroke="#cbd5e1" stroke-width="1"/>
          </svg>
        }
        @case ('security-lock') {
          <!-- Monitor with padlock and key -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#14b8a6" fill-opacity="0.15"/>
            <rect x="10" y="11" width="28" height="20" rx="3" fill="#0284c7"/>
            <rect x="12" y="13" width="24" height="15" rx="1.5" fill="#ffffff"/>
            <!-- Monitor stand -->
            <path d="M21 31h6l2 4H19l2-4z" fill="#64748b"/>
            <!-- Padlock -->
            <rect x="16" y="18" width="10" height="8" rx="2" fill="#f59e0b"/>
            <path d="M18 18v-2.5a3 3 0 0 1 6 0V18" stroke="#f59e0b" stroke-width="2" fill="none"/>
            <circle cx="21" cy="22" r="1" fill="#78350f"/>
            <!-- Key -->
            <path d="M27 24l4-3 1 1-1 1 1 1-2 2-3-2z" fill="#10b981"/>
          </svg>
        }
        @case ('ticket-support') {
          <!-- Cloud with support ticket -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#0284c7" fill-opacity="0.15"/>
            <!-- Cloud -->
            <path d="M35 25c0-4-3-7-7-7-1 0-2 .2-2.8.6C23.6 15.5 20.8 14 17.5 14c-4.5 0-8 3.5-8 8 0 .5.1 1 .2 1.4C7.5 24.5 6 26.5 6 29c0 3.5 2.8 6.3 6.3 6.3h22.4c3.5 0 6.3-2.8 6.3-6.3 0-2.3-1.2-4.2-3-5.2" fill="#38bdf8"/>
            <!-- Golden Ticket -->
            <rect x="19" y="21" width="12" height="16" rx="2" fill="#fde047" stroke="#eab308" stroke-width="1" transform="rotate(-6 19 21)"/>
            <line x1="21" y1="26" x2="27" y2="25" stroke="#ca8a04" stroke-width="1.2" stroke-dasharray="2 1"/>
            <text x="24" y="32" fill="#a16207" font-size="5" font-weight="bold">#TI</text>
          </svg>
        }
        @case ('sales-growth') {
          <!-- Sales executive with graph -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#22c55e" fill-opacity="0.15"/>
            <circle cx="24" cy="24" r="17" fill="#0284c7"/>
            <circle cx="24" cy="18" r="6" fill="#fed7aa"/>
            <!-- Cap or hair -->
            <path d="M18 16c2-4 10-4 12 0-2-2-9-2-12 0z" fill="#1e3a8a"/>
            <!-- Happy face -->
            <circle cx="22" cy="18" r="1" fill="#0f172a"/>
            <circle cx="26" cy="18" r="1" fill="#0f172a"/>
            <path d="M22 21c1 1 3 1 4 0" stroke="#0f172a" stroke-width="1" stroke-linecap="round"/>
            <!-- Suit with green badge -->
            <path d="M15 36c1-6 5-9 9-9s8 3 9 9H15z" fill="#0f172a"/>
            <!-- Thumbs up badge -->
            <circle cx="16" cy="16" r="4.5" fill="#22c55e"/>
            <path d="M14.5 16l1.2 1.2 2.3-2.4" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        }
        @case ('shield-check') {
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#0ea5e9" fill-opacity="0.15"/>
            <path d="M24 8l14 5v11c0 9.5-6.5 17.5-14 20-7.5-2.5-14-10.5-14-20V13l14-5z" fill="#0284c7"/>
            <path d="M24 11l11 4v9c0 7.5-5 14-11 16-6-2-11-8.5-11-16v-9l11-4z" fill="#38bdf8"/>
            <path d="M19 24l4 4 7-8" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
        @case ('invoice') {
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#10b981" fill-opacity="0.15"/>
            <path d="M13 10h22v28l-3.5-2-3.5 2-4-2-4 2-3.5-2-3.5 2V10z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <rect x="17" y="16" width="14" height="2.5" rx="1" fill="#10b981"/>
            <rect x="17" y="21" width="10" height="2" rx="1" fill="#94a3b8"/>
            <rect x="17" y="25" width="14" height="2" rx="1" fill="#cbd5e1"/>
            <rect x="17" y="29" width="8" height="2" rx="1" fill="#cbd5e1"/>
          </svg>
        }
        @case ('chart-bar') {
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#f97316" fill-opacity="0.15"/>
            <circle cx="24" cy="24" r="16" fill="#ffedd5"/>
            <rect x="15" y="24" width="4" height="10" rx="1.5" fill="#f97316"/>
            <rect x="22" y="17" width="4" height="17" rx="1.5" fill="#ea580c"/>
            <rect x="29" y="13" width="4" height="21" rx="1.5" fill="#c2410c"/>
            <path d="M14 20l8-6 8 4 6-5" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
          </svg>
        }
        @default {
          <!-- Generic modern app grid icon -->
          <svg viewBox="0 0 48 48" fill="none" class="svg-icon">
            <rect width="48" height="48" rx="14" fill="#0284c7" fill-opacity="0.15"/>
            <rect x="13" y="13" width="9" height="9" rx="3" fill="#0284c7"/>
            <rect x="26" y="13" width="9" height="9" rx="3" fill="#38bdf8"/>
            <rect x="13" y="26" width="9" height="9" rx="3" fill="#38bdf8"/>
            <rect x="26" y="26" width="9" height="9" rx="3" fill="#0284c7"/>
          </svg>
        }
      }
    </div>
  `,
  styles: [`
    .icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .svg-icon {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class ProjectIconComponent {
  readonly icon = input<string>('cloud-web');
  readonly bgColor = input<string | undefined>('');
  readonly size = input<number>(56);

  bgStyle(): string {
    return this.bgColor() || '#f8fafc';
  }
}
