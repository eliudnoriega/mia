import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { AppLauncherModalComponent } from './components/app-launcher-modal/app-launcher-modal.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { HealthModalComponent } from './components/health-modal/health-modal.component';
import { PolicyModalComponent } from './components/policy-modal/policy-modal.component';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { RolesModalComponent } from './components/roles-modal/roles-modal.component';
import { UsersModalComponent } from './components/users-modal/users-modal.component';
import { ProjectService } from './services/project.service';
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { Project } from './models/project.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    ToastContainerComponent,
    AppLauncherModalComponent,
    ProfileModalComponent,
    HealthModalComponent,
    PolicyModalComponent,
    ProjectModalComponent,
    RolesModalComponent,
    UsersModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly projectService = inject(ProjectService);
  protected readonly toastService = inject(ToastService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  sidebarCollapsed = signal(false);
  isLauncherOpen = signal(false);
  isProfileOpen = signal(false);
  isHealthOpen = signal(false);
  isPolicyOpen = signal(false);
  isNewProjectOpen = signal(false);
  isRolesOpen = signal(false);
  isUsersOpen = signal(false);

  currentUrl = signal<string>(typeof window !== 'undefined' ? window.location.pathname : '');

  // Determina si se debe mostrar el layout limpio de login o el dashboard completo
  isLoginRoute = computed(() => {
    return this.currentUrl().includes('/login') || !this.authService.isSessionActive();
  });

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentUrl.set(event.urlAfterRedirects || event.url);
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(val => !val);
  }

  handleSidebarQuickAction(action: string): void {
    if (action === 'consulta-poliza') {
      this.isPolicyOpen.set(true);
    }
  }

  handleSaveNewProject(data: Omit<Project, 'id' | 'accessCount' | 'uptime' | 'lastDeploy'>): void {
    this.projectService.addProject(data);
    this.toastService.success(`Sistema "${data.title}" registrado exitosamente`);
    this.isNewProjectOpen.set(false);
  }
}
