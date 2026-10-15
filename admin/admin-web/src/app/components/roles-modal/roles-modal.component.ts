import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Role, RoleRequest, UserSummary } from '../../models/role.model';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  protected readonly roleService = inject(RoleService);
  protected readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  // Pestaña activa: 'roles' (Catálogo) o 'assignments' (Asignación por usuario)
  activeTab = signal<'roles' | 'assignments'>('roles');

  // Filtro de búsqueda
  searchQuery = signal<string>('');

  // Estado del formulario de creación / edición
  isEditing = signal<boolean>(false);
  editingRoleId = signal<number | null>(null);
  formRoleName = '';
  formRoleDescription = '';
  isSaving = signal<boolean>(false);
  formError = signal<string | null>(null);

  // Estado para confirmación de eliminación
  roleToDelete = signal<Role | null>(null);

  // Estado de asignación de usuarios
  selectedUser = signal<UserSummary | null>(null);
  selectedUserRoleSet = signal<Set<string>>(new Set());
  isSavingAssignment = signal<boolean>(false);

  // Lista de roles filtrados
  filteredRoles = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.roleService.roles();
    if (!q) return list;
    return list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.toast.error('Acceso denegado: Se requieren permisos de Administrador.');
      this.close.emit();
      return;
    }

    this.roleService.loadRoles().subscribe();
    this.roleService.loadUsers().subscribe({
      next: (users) => {
        if (users.length > 0 && !this.selectedUser()) {
          this.selectUserForAssignment(users[0]);
        }
      }
    });
  }

  // --- GESTIÓN DE CATÁLOGO DE ROLES ---

  startCreateRole(): void {
    this.isEditing.set(true);
    this.editingRoleId.set(null);
    this.formRoleName = '';
    this.formRoleDescription = '';
    this.formError.set(null);
  }

  startEditRole(role: Role): void {
    this.isEditing.set(true);
    this.editingRoleId.set(role.id);
    this.formRoleName = role.name.replace(/^ROLE_/, '');
    this.formRoleDescription = role.description || '';
    this.formError.set(null);
  }

  cancelForm(): void {
    this.isEditing.set(false);
    this.editingRoleId.set(null);
    this.formRoleName = '';
    this.formRoleDescription = '';
    this.formError.set(null);
  }

  saveRole(): void {
    const rawName = this.formRoleName.trim();
    if (!rawName) {
      this.formError.set('El nombre del rol es requerido');
      return;
    }

    // Normalizar a formato ROLE_
    const finalName = rawName.toUpperCase().startsWith('ROLE_')
      ? rawName.toUpperCase()
      : `ROLE_${rawName.toUpperCase()}`;

    const request: RoleRequest = {
      name: finalName,
      description: this.formRoleDescription.trim()
    };

    this.isSaving.set(true);
    this.formError.set(null);

    const editId = this.editingRoleId();
    if (editId !== null) {
      this.roleService.updateRole(editId, request).subscribe({
        next: (updated) => {
          this.isSaving.set(false);
          this.isEditing.set(false);
          this.toast.success(`Rol "${updated.name}" actualizado correctamente`);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.formError.set(err.error?.message || 'Error al actualizar el rol en admin-api');
        }
      });
    } else {
      this.roleService.createRole(request).subscribe({
        next: (created) => {
          this.isSaving.set(false);
          this.isEditing.set(false);
          this.toast.success(`Rol "${created.name}" registrado con éxito`);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.formError.set(err.error?.message || 'Error al crear el rol en admin-api');
        }
      });
    }
  }

  promptDeleteRole(role: Role): void {
    if (role.name === 'ROLE_ADMIN') {
      this.toast.warning('No es posible eliminar el rol ROLE_ADMIN por seguridad del sistema.');
      return;
    }
    this.roleToDelete.set(role);
  }

  confirmDeleteRole(): void {
    const role = this.roleToDelete();
    if (!role) return;

    this.roleService.deleteRole(role.id).subscribe({
      next: () => {
        this.toast.success(`Rol "${role.name}" eliminado correctamente`);
        this.roleToDelete.set(null);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al eliminar el rol');
        this.roleToDelete.set(null);
      }
    });
  }

  cancelDelete(): void {
    this.roleToDelete.set(null);
  }

  // --- ASIGNACIÓN DE ROLES A USUARIOS ---

  selectUserForAssignment(user: UserSummary): void {
    this.selectedUser.set(user);
    this.selectedUserRoleSet.set(new Set(user.roles || []));
  }

  toggleRoleForSelectedUser(roleName: string): void {
    const current = new Set(this.selectedUserRoleSet());
    if (current.has(roleName)) {
      // Evitar que el admin principal se quite ROLE_ADMIN a sí mismo
      if (this.selectedUser()?.username === 'admin' && roleName === 'ROLE_ADMIN') {
        this.toast.warning('El usuario maestro admin debe conservar el rol ROLE_ADMIN.');
        return;
      }
      current.delete(roleName);
    } else {
      current.add(roleName);
    }
    this.selectedUserRoleSet.set(current);
  }

  isRoleCheckedForSelectedUser(roleName: string): boolean {
    return this.selectedUserRoleSet().has(roleName);
  }

  saveUserRolesAssignment(): void {
    const user = this.selectedUser();
    if (!user) return;

    const rolesArray = Array.from(this.selectedUserRoleSet());
    this.isSavingAssignment.set(true);

    this.roleService.assignUserRoles(user.id, rolesArray).subscribe({
      next: () => {
        this.isSavingAssignment.set(false);
        this.toast.success(`Roles del usuario "${user.fullName || user.username}" actualizados correctamente`);
      },
      error: (err) => {
        this.isSavingAssignment.set(false);
        this.toast.error(err.error?.message || 'Error al asignar roles en admin-api');
      }
    });
  }

  // --- HELPERS VISUALES ---

  getCleanRoleBadge(name: string): string {
    return name.replace(/^ROLE_/, '');
  }

  getRoleThemeClass(name: string): string {
    const clean = name.replace(/^ROLE_/, '').toLowerCase();
    switch (clean) {
      case 'admin': return 'theme-admin';
      case 'developer': return 'theme-dev';
      case 'manager': return 'theme-mgr';
      case 'auditor': return 'theme-audit';
      case 'user': return 'theme-user';
      default: return 'theme-custom';
    }
  }

  isSystemRole(name: string): boolean {
    return name === 'ROLE_ADMIN' || name === 'ROLE_USER';
  }

  onClose(): void {
    this.close.emit();
  }
}
