import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectCategory } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectListRowComponent } from '../../components/project-list-row/project-list-row.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ProjectDetailModalComponent } from '../../components/project-detail-modal/project-detail-modal.component';
import { SupportModalComponent } from '../../components/support-modal/support-modal.component';
import { PolicyModalComponent } from '../../components/policy-modal/policy-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProjectCardComponent,
    ProjectListRowComponent,
    ProjectModalComponent,
    ProjectDetailModalComponent,
    SupportModalComponent,
    PolicyModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  protected readonly projectService = inject(ProjectService);
  protected readonly toastService = inject(ToastService);
  protected readonly authService = inject(AuthService);

  // User Profile reactivo desde el token autenticado
  readonly userName = computed(() => this.authService.displayName());

  // Dynamic greeting based on time of day
  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días,';
    if (hour < 19) return 'Buenas tardes,';
    return 'Buenas noches,';
  });

  // Search input model
  searchTerm = '';

  // Modals state
  isModalOpen = signal(false);
  isDetailModalOpen = signal(false);
  isSupportModalOpen = signal(false);
  isPolicyModalOpen = signal(false);

  selectedProjectToEdit = signal<Project | null>(null);
  selectedProjectDetail = signal<Project | null>(null);

  // Pagination array helper
  paginationPages = computed(() => {
    const total = this.projectService.totalPages();
    const pages: number[] = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  });

  onSearchChange(): void {
    this.projectService.setSearchTerm(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.projectService.setSearchTerm('');
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.projectService.setCategory(select.value as ProjectCategory);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.projectService.setViewMode(mode);
  }

  goToPage(page: number): void {
    this.projectService.setPage(page);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  }

  prevPage(): void {
    const curr = this.projectService.currentPage();
    if (curr > 1) {
      this.goToPage(curr - 1);
    }
  }

  nextPage(): void {
    const curr = this.projectService.currentPage();
    if (curr < this.projectService.totalPages()) {
      this.goToPage(curr + 1);
    }
  }

  // Favorite toggle
  handleToggleFavorite(id: string): void {
    this.projectService.toggleFavorite(id);
    const proj = this.projectService.paginatedProjects().find(p => p.id === id);
    if (proj?.isFavorite) {
      this.toastService.success(`"${proj.title}" añadido a tus favoritos`);
    } else {
      this.toastService.info(`"${proj?.title || 'Sistema'}" retirado de favoritos`);
    }
  }

  // Sincronización con admin-api puerto 8080
  syncWithApi(): void {
    this.projectService.loadProjectsForCurrentUser();
    this.projectService.loadCompanies();
    this.toastService.info('Sincronizando con admin-api (puerto 8080)...');
  }

  onUserSelect(userId: number): void {
    if (userId === 0) {
      this.projectService.loadAllProjects();
      this.toastService.success('Mostrando catálogo completo de proyectos (Modo Administrador)');
    } else {
      this.projectService.loadUserProjects(userId);
      const userNames: Record<number, string> = {
        1: 'Admin Corporativo (ID 1)',
        2: 'Carlos Ingeniero / Dev (ID 2)',
        3: 'Sofía Consultora / Analyst (ID 3)'
      };
      this.toastService.success(`Filtrando proyectos asignados para ${userNames[userId] || 'Usuario ' + userId}`);
    }
  }

  // Launch project
  handleLaunch(project: Project): void {
    this.toastService.info(`Iniciando conexión con ${project.title}...`, 2000);
    window.open(project.url, '_blank', 'noopener,noreferrer');
  }

  // View details
  handleViewDetails(project: Project): void {
    this.selectedProjectDetail.set(project);
    this.isDetailModalOpen.set(true);
  }

  // Add new
  openCreateModal(): void {
    this.selectedProjectToEdit.set(null);
    this.isModalOpen.set(true);
  }

  // Edit
  handleEdit(project: Project): void {
    this.selectedProjectToEdit.set(project);
    this.isModalOpen.set(true);
  }

  // Save Modal Submit
  handleSaveProject(data: Omit<Project, 'id' | 'accessCount' | 'uptime' | 'lastDeploy'>): void {
    const edit = this.selectedProjectToEdit();
    if (edit) {
      this.projectService.updateProject(edit.id, data);
      this.toastService.success(`Sistema "${data.title}" actualizado con éxito`);
    } else {
      this.projectService.addProject(data);
      this.toastService.success(`Sistema "${data.title}" creado exitosamente`);
    }
    this.isModalOpen.set(false);
    this.selectedProjectToEdit.set(null);
  }

  // Delete
  handleDelete(project: Project): void {
    const confirmed = confirm(`¿Estás seguro de que deseas eliminar el sistema "${project.title}" del directorio?`);
    if (confirmed) {
      this.projectService.deleteProject(project.id);
      this.toastService.warning(`Sistema "${project.title}" eliminado`);
    }
  }

  // Support
  openSupport(): void {
    this.isSupportModalOpen.set(true);
  }

  handleTicketCreated(message: string): void {
    this.toastService.success(message);
  }

  // Quick Action
  openPolicySearch(): void {
    this.isPolicyModalOpen.set(true);
  }
}
