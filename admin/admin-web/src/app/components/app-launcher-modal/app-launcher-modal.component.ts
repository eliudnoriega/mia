import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { ProjectIconComponent } from '../project-icon/project-icon.component';

@Component({
  selector: 'app-app-launcher-modal',
  standalone: true,
  imports: [CommonModule, ProjectIconComponent],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="launcher-dialog animate-scale" (click)="$event.stopPropagation()">
        <div class="launcher-header">
          <span class="launcher-title">Lanzador Rápido de Sistemas</span>
          <button type="button" class="close-btn" (click)="onClose()">&times;</button>
        </div>

        <div class="launcher-grid">
          @for (proj of projectService.filteredProjects().slice(0, 12); track proj.id) {
            <a [href]="proj.url" target="_blank" class="launcher-item" (click)="onSelect(proj)">
              <app-project-icon [icon]="proj.icon" [bgColor]="proj.iconBgColor" [size]="44"></app-project-icon>
              <span class="item-name" [title]="proj.title">{{ proj.title }}</span>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .launcher-dialog {
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      border: 1px solid #e2e8f0;
      padding: 1.25rem;
    }
    .launcher-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .launcher-title {
      font-weight: 700;
      color: #0f2744;
      font-size: 0.95rem;
    }
    .close-btn {
      font-size: 1.4rem;
      color: #94a3b8;
      line-height: 1;
    }
    .launcher-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      max-height: 400px;
      overflow-y: auto;
    }
    .launcher-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0.75rem 0.5rem;
      border-radius: 12px;
      transition: all 0.15s ease;
      color: #1e293b;
    }
    .launcher-item:hover {
      background: #f0f9ff;
      transform: translateY(-2px);
    }
    .item-name {
      font-size: 0.78rem;
      font-weight: 600;
      margin-top: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  `]
})
export class AppLauncherModalComponent {
  protected readonly projectService = inject(ProjectService);
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSelect(proj: Project): void {
    this.onClose();
  }
}
