import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAdminService } from '../../services/user-admin.service';
import { RoleService } from '../../services/role.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { UserDetail, CreateUserRequest, UpdateUserData } from '../../models/user.model';
import { Company, Project } from '../../models/project.model';

@Component({
  selector: 'app-users-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-modal.component.html',
  styleUrl: './users-modal.component.css'
})
export class UsersModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  protected readonly userAdminService = inject(UserAdminService);
  protected readonly roleService = inject(RoleService);
  protected readonly projectService = inject(ProjectService);
  protected readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  // Catálogo completo de sistemas disponibles para asignación
  availableProjects = signal<Project[]>([]);

  // Filtros de usuarios
  searchQuery = signal<string>('');
  selectedCompanyFilter = signal<string>('all');

  // Estado creación de usuario
  isCreatingUser = signal<boolean>(false);
  newFullName = '';
  newUsername = '';
  newEmail = '';
  newPassword = '';
  newCompanyId: number | null = null;
  selectedRolesForNewUser = signal<Set<string>>(new Set(['ROLE_USER']));
  selectedProjectsForNewUser = signal<Set<string>>(new Set());
  isSavingUser = signal<boolean>(false);
  formError = signal<string | null>(null);

  // Estado edición de usuario
  editingUser = signal<UserDetail | null>(null);
  editFullName = '';
  editEmail = '';
  editCompanyId: number | null = null;
  selectedRolesForEditUser = signal<Set<string>>(new Set());
  selectedProjectsForEditUser = signal<Set<string>>(new Set());
  projectSearchTerm = signal<string>('');
  projectCategoryFilter = signal<string>('todos');
  projectScopeFilter = signal<'all' | 'assigned' | 'unassigned'>('all');
  isUpdatingUser = signal<boolean>(false);
  editError = signal<string | null>(null);

  // Estado para modal / drawer de cambio rápido de empresa
  userForCompanyChange = signal<UserDetail | null>(null);
  targetCompanyId = signal<number | null>(null);
  isAssigningCompany = signal<boolean>(false);

  // Lista filtrada de usuarios
  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const compFilter = this.selectedCompanyFilter();
    let list = this.userAdminService.users();

    if (compFilter !== 'all') {
      if (compFilter === 'none') {
        list = list.filter(u => !u.company);
      } else {
        const cId = Number(compFilter);
        list = list.filter(u => u.company?.id === cId);
      }
    }

    if (!q) return list;

    return list.filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.company?.name && u.company.name.toLowerCase().includes(q))
    );
  });

  // Proyectos filtrados para el selector de edición
  filteredProjectsForEdit = computed(() => {
    const list = this.availableProjects();
    const q = this.projectSearchTerm().toLowerCase().trim();
    const cat = this.projectCategoryFilter();
    const scope = this.projectScopeFilter();
    const selected = this.selectedProjectsForEditUser();

    return list.filter(p => {
      if (q) {
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSub = p.subtitle.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.categoryLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchDesc && !matchCat) return false;
      }

      if (cat !== 'todos' && p.category !== cat) return false;

      const isSelected = selected.has(p.id);
      if (scope === 'assigned' && !isSelected) return false;
      if (scope === 'unassigned' && isSelected) return false;

      return true;
    });
  });

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.toast.error('Acceso restringido: Se requieren credenciales de Administrador.');
      this.close.emit();
      return;
    }

    this.userAdminService.loadUsers().subscribe();
    this.userAdminService.loadCompanies().subscribe();
    this.roleService.loadRoles().subscribe();

    // Cargar todo el catálogo de proyectos/sistemas para asignación
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        if (projects && projects.length > 0) {
          this.availableProjects.set(projects);
        }
      }
    });
  }

  // --- EDICIÓN DE USUARIO Y ASIGNACIÓN DE SISTEMAS ---

  openEditUser(user: UserDetail): void {
    this.editingUser.set(user);
    this.editFullName = user.fullName || '';
    this.editEmail = user.email || '';
    this.editCompanyId = user.company?.id ?? null;
    this.selectedRolesForEditUser.set(new Set(user.roles || []));

    // Inicializar proyectos asignados con los que ya tiene el usuario
    const initialProjects = new Set(user.projectIds || (user.projects ? user.projects.map(p => p.id) : []));
    this.selectedProjectsForEditUser.set(initialProjects);
    this.projectSearchTerm.set('');
    this.projectCategoryFilter.set('todos');
    this.projectScopeFilter.set('all');
    this.editError.set(null);
    this.isCreatingUser.set(false);

    // Obtener proyectos más recientes asignados al usuario desde admin-api
    this.projectService.getUserProjects(user.id).subscribe({
      next: (userProjects) => {
        if (userProjects && userProjects.length > 0) {
          const ids = userProjects.map(p => p.id);
          this.selectedProjectsForEditUser.set(new Set(ids));
        }
      }
    });
  }

  cancelEditUser(): void {
    this.editingUser.set(null);
    this.editError.set(null);
  }

  toggleRoleForEditUser(roleName: string): void {
    const current = new Set(this.selectedRolesForEditUser());
    if (current.has(roleName)) {
      if (this.editingUser()?.username === 'admin' && roleName === 'ROLE_ADMIN') {
        this.toast.warning('El usuario maestro admin debe conservar el rol ROLE_ADMIN.');
        return;
      }
      current.delete(roleName);
    } else {
      current.add(roleName);
    }
    this.selectedRolesForEditUser.set(current);
  }

  toggleProjectForEditUser(projectId: string): void {
    const current = new Set(this.selectedProjectsForEditUser());
    if (current.has(projectId)) {
      current.delete(projectId);
    } else {
      current.add(projectId);
    }
    this.selectedProjectsForEditUser.set(current);
  }

  selectAllProjectsForEdit(): void {
    const allIds = this.availableProjects().map(p => p.id);
    this.selectedProjectsForEditUser.set(new Set(allIds));
    this.toast.info('Se han seleccionado todos los sistemas.');
  }

  clearAllProjectsForEdit(): void {
    this.selectedProjectsForEditUser.set(new Set());
    this.toast.info('Se han desmarcado todos los sistemas.');
  }

  toggleProjectForNewUser(projectId: string): void {
    const current = new Set(this.selectedProjectsForNewUser());
    if (current.has(projectId)) {
      current.delete(projectId);
    } else {
      current.add(projectId);
    }
    this.selectedProjectsForNewUser.set(current);
  }

  selectAllProjectsForNewUser(): void {
    const allIds = this.availableProjects().map(p => p.id);
    this.selectedProjectsForNewUser.set(new Set(allIds));
  }

  clearAllProjectsForNewUser(): void {
    this.selectedProjectsForNewUser.set(new Set());
  }

  submitUpdateUser(): void {
    const user = this.editingUser();
    if (!user) return;

    if (!this.editFullName.trim() || !this.editEmail.trim()) {
      this.editError.set('Nombre completo y correo son campos obligatorios');
      return;
    }

    this.isUpdatingUser.set(true);
    this.editError.set(null);

    const projectIdsList = Array.from(this.selectedProjectsForEditUser());

    const data: UpdateUserData = {
      fullName: this.editFullName.trim(),
      email: this.editEmail.trim().toLowerCase(),
      companyId: this.editCompanyId,
      roles: Array.from(this.selectedRolesForEditUser()),
      projectIds: projectIdsList
    };

    this.userAdminService.updateUser(user.id, data).subscribe({
      next: (updated) => {
        this.isUpdatingUser.set(false);
        this.editingUser.set(null);
        this.toast.success(`Usuario "${updated.fullName}" actualizado correctamente con ${projectIdsList.length} sistemas asignados`);

        // Si el usuario modificado es el usuario activo, refrescar su sesión y vista
        if (this.authService.currentUser()?.id === user.id) {
          const curr = this.authService.currentUser()!;
          this.authService.currentUser.set({ ...curr, projectIds: projectIdsList });
          this.projectService.loadProjectsForCurrentUser();
        }
      },
      error: (err) => {
        this.isUpdatingUser.set(false);
        this.editError.set(err.error?.message || 'Error al actualizar usuario en admin-api');
      }
    });
  }

  // --- REGISTRO DE NUEVO USUARIO CON EMPRESA ASOCIADA ---

  openCreateUser(): void {
    this.isCreatingUser.set(true);
    this.editingUser.set(null);
    this.newFullName = '';
    this.newUsername = '';
    this.newEmail = '';
    this.newPassword = '';
    const companies = this.userAdminService.companies();
    this.newCompanyId = companies.length > 0 ? companies[0].id : null;
    this.selectedRolesForNewUser.set(new Set(['ROLE_USER']));
    this.selectedProjectsForNewUser.set(new Set());
    this.formError.set(null);
  }

  cancelCreateUser(): void {
    this.isCreatingUser.set(false);
    this.formError.set(null);
  }

  toggleRoleForNewUser(roleName: string): void {
    const set = new Set(this.selectedRolesForNewUser());
    if (set.has(roleName)) {
      set.delete(roleName);
    } else {
      set.add(roleName);
    }
    this.selectedRolesForNewUser.set(set);
  }

  submitCreateUser(): void {
    if (!this.newFullName.trim() || !this.newUsername.trim() || !this.newEmail.trim() || !this.newPassword) {
      this.formError.set('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    if (this.newPassword.length < 6) {
      this.formError.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const req: CreateUserRequest = {
      fullName: this.newFullName.trim(),
      username: this.newUsername.trim().toLowerCase(),
      email: this.newEmail.trim().toLowerCase(),
      password: this.newPassword,
      roles: Array.from(this.selectedRolesForNewUser()),
      projectIds: Array.from(this.selectedProjectsForNewUser()),
      companyId: this.newCompanyId ? Number(this.newCompanyId) : null
    };

    this.isSavingUser.set(true);
    this.formError.set(null);

    this.userAdminService.createUser(req).subscribe({
      next: () => {
        this.isSavingUser.set(false);
        this.isCreatingUser.set(false);
        this.toast.success(`Usuario "${req.fullName}" registrado y asociado a su empresa con éxito`);
      },
      error: (err) => {
        this.isSavingUser.set(false);
        this.formError.set(err.error?.message || 'Error al registrar usuario en admin-api');
      }
    });
  }

  // --- ASOCIACIÓN Y CAMBIO DE EMPRESA (COMPANY) ---

  openAssignCompanyModal(user: UserDetail): void {
    this.userForCompanyChange.set(user);
    this.targetCompanyId.set(user.company?.id ?? null);
  }

  closeAssignCompanyModal(): void {
    this.userForCompanyChange.set(null);
    this.targetCompanyId.set(null);
  }

  confirmAssignCompany(): void {
    const user = this.userForCompanyChange();
    if (!user) return;

    const companyId = this.targetCompanyId();
    this.isAssigningCompany.set(true);

    this.userAdminService.assignCompany(user.id, companyId).subscribe({
      next: (updatedUser) => {
        this.isAssigningCompany.set(false);
        const compName = updatedUser.company?.name || 'Ninguna (Desasociado)';
        this.toast.success(`Empresa de "${user.fullName}" actualizada a: ${compName}`);
        this.closeAssignCompanyModal();
      },
      error: (err) => {
        this.isAssigningCompany.set(false);
        this.toast.error(err.error?.message || 'Error al actualizar empresa en admin-api');
      }
    });
  }

  // Cambio directo desde el selector rápido de la tarjeta
  quickChangeCompany(user: UserDetail, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const companyId = value === 'none' ? null : Number(value);

    this.userAdminService.assignCompany(user.id, companyId).subscribe({
      next: (updated) => {
        const compName = updated.company?.name || 'Sin empresa';
        this.toast.success(`Empresa de ${user.fullName} cambiada a ${compName}`);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'No se pudo cambiar la empresa');
      }
    });
  }

  // --- HELPERS VISUALES ---

  getUserInitials(name: string): string {
    const parts = (name || '').trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (name || 'US').substring(0, 2).toUpperCase();
  }

  getCleanRole(role: string): string {
    return role.replace(/^ROLE_/, '');
  }

  onClose(): void {
    this.close.emit();
  }
}
