import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Role, RoleRequest, UserSummary } from '../models/role.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly rolesUrl = environment.services.roles;
  private readonly usersUrl = environment.services.users;

  // Reactividad con Signals
  readonly roles = signal<Role[]>([]);
  readonly users = signal<UserSummary[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Carga la lista completa de roles desde admin-api
   */
  loadRoles(): Observable<Role[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<Role[]>(this.rolesUrl).pipe(
      tap(roles => {
        this.roles.set(roles || []);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Error al cargar el catálogo de roles';
        this.error.set(msg);
        return throwError(() => err);
      })
    );
  }

  /**
   * Carga los usuarios registrados para consultar asignaciones de roles
   */
  loadUsers(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(this.usersUrl).pipe(
      tap(users => {
        this.users.set(users || []);
      }),
      catchError(err => {
        console.warn('[RoleService] No se pudieron cargar usuarios:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Crea un nuevo rol en admin-api
   */
  createRole(request: RoleRequest): Observable<Role> {
    this.isLoading.set(true);
    return this.http.post<Role>(this.rolesUrl, request).pipe(
      tap(newRole => {
        this.roles.update(current => [...current, newRole]);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Modifica un rol existente en admin-api
   */
  updateRole(id: number, request: RoleRequest): Observable<Role> {
    this.isLoading.set(true);
    return this.http.put<Role>(`${this.rolesUrl}/${id}`, request).pipe(
      tap(updatedRole => {
        this.roles.update(current => 
          current.map(r => r.id === id ? updatedRole : r)
        );
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Elimina un rol por su ID en admin-api
   */
  deleteRole(id: number): Observable<void> {
    this.isLoading.set(true);
    return this.http.delete<void>(`${this.rolesUrl}/${id}`).pipe(
      tap(() => {
        this.roles.update(current => current.filter(r => r.id !== id));
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Actualiza el conjunto de roles de un usuario específico
   */
  assignUserRoles(userId: number, roleNames: string[]): Observable<UserSummary> {
    return this.http.put<UserSummary>(`${this.usersUrl}/${userId}/roles`, roleNames).pipe(
      tap(updatedUser => {
        this.users.update(current =>
          current.map(u => u.id === userId ? { ...u, roles: roleNames } : u)
        );
      })
    );
  }

  /**
   * Obtiene la cantidad de usuarios asignados a un rol
   */
  getUserCountForRole(roleName: string): number {
    return this.users().filter(u => u.roles?.includes(roleName)).length;
  }

  /**
   * Obtiene la lista de usuarios con un rol dado
   */
  getUsersForRole(roleName: string): UserSummary[] {
    return this.users().filter(u => u.roles?.includes(roleName));
  }
}
