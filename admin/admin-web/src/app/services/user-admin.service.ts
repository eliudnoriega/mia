import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { UserDetail, CreateUserRequest, UpdateUserData } from '../models/user.model';
import { Company } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = environment.services.users;
  private readonly companiesUrl = environment.services.companies;
  private readonly registerUrl = `${environment.services.auth}/register`;

  // Estado reactivo con Signals
  readonly users = signal<UserDetail[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Carga la lista completa de usuarios desde admin-api
   */
  loadUsers(): Observable<UserDetail[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<UserDetail[]>(this.usersUrl).pipe(
      tap(users => {
        this.users.set(users || []);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Error al cargar usuarios desde admin-api';
        this.error.set(msg);
        return throwError(() => err);
      })
    );
  }

  /**
   * Carga todas las empresas registradas desde admin-api
   */
  loadCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.companiesUrl).pipe(
      tap(companies => {
        this.companies.set(companies || []);
      }),
      catchError(err => {
        console.warn('[UserAdminService] No se pudieron cargar empresas:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Asocia o cambia la empresa (Company) asignada a un usuario
   */
  assignCompany(userId: number, companyId: number | null): Observable<UserDetail> {
    this.isLoading.set(true);

    let req$: Observable<UserDetail>;
    if (companyId) {
      req$ = this.http.put<UserDetail>(`${this.usersUrl}/${userId}/company/${companyId}`, {});
    } else {
      req$ = this.http.delete<UserDetail>(`${this.usersUrl}/${userId}/company`);
    }

    return req$.pipe(
      tap(updatedUser => {
        this.users.update(current =>
          current.map(u => u.id === userId ? updatedUser : u)
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
   * Asigna roles a un usuario
   */
  assignRoles(userId: number, roles: string[]): Observable<UserDetail> {
    return this.http.put<UserDetail>(`${this.usersUrl}/${userId}/roles`, roles).pipe(
      tap(updatedUser => {
        this.users.update(current =>
          current.map(u => u.id === userId ? updatedUser : u)
        );
      })
    );
  }

  /**
   * Asigna o reemplaza los proyectos (sistemas) asignados a un usuario
   */
  assignProjects(userId: number, projectIds: string[]): Observable<UserDetail> {
    return this.http.put<UserDetail>(`${this.usersUrl}/${userId}/projects`, projectIds).pipe(
      tap(updatedUser => {
        this.users.update(current =>
          current.map(u => u.id === userId ? { ...u, ...updatedUser, projectIds } : u)
        );
      })
    );
  }

  /**
   * Agrega un sistema específico a un usuario
   */
  addProjectToUser(userId: number, projectId: string): Observable<UserDetail> {
    return this.http.post<UserDetail>(`${this.usersUrl}/${userId}/projects/${projectId}`, {}).pipe(
      tap(updatedUser => {
        this.users.update(current =>
          current.map(u => u.id === userId ? { ...u, ...updatedUser } : u)
        );
      })
    );
  }

  /**
   * Remueve un sistema específico de un usuario
   */
  removeProjectFromUser(userId: number, projectId: string): Observable<UserDetail> {
    return this.http.delete<UserDetail>(`${this.usersUrl}/${userId}/projects/${projectId}`).pipe(
      tap(updatedUser => {
        this.users.update(current =>
          current.map(u => u.id === userId ? { ...u, ...updatedUser } : u)
        );
      })
    );
  }

  /**
   * Actualiza los datos de un usuario existente (nombre, correo, empresa, roles y sistemas/proyectos)
   */
  updateUser(userId: number, data: UpdateUserData): Observable<UserDetail> {
    this.isLoading.set(true);

    const updatePayload = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      companyId: data.companyId,
      roles: data.roles,
      projectIds: data.projectIds || []
    };

    // 1. Ejecutar PUT /users/{id}
    const updateProfile$: Observable<UserDetail> = this.http.put<UserDetail>(`${this.usersUrl}/${userId}`, updatePayload).pipe(
      catchError(() => {
        // Fallback orquestado usando endpoints modulares del backend
        const comp$ = this.assignCompany(userId, data.companyId);
        const roles$ = this.assignRoles(userId, data.roles);

        return forkJoin({ comp: comp$, roles: roles$ }).pipe(
          map(({ comp }) => {
            const userInStore = this.users().find(u => u.id === userId);
            const fallbackUser: UserDetail = {
              id: userId,
              username: userInStore?.username || '',
              fullName: data.fullName.trim(),
              email: data.email.trim(),
              roles: data.roles,
              company: comp.company,
              projectIds: data.projectIds || userInStore?.projectIds || []
            };
            return fallbackUser;
          })
        );
      })
    );

    // 2. Si se especificaron proyectos, sincronizar mediante PUT /users/{id}/projects
    return updateProfile$.pipe(
      switchMap((profileUser: UserDetail) => {
        if (data.projectIds !== undefined) {
          return this.assignProjects(userId, data.projectIds).pipe(
            map((projUser: UserDetail) => ({
              ...profileUser,
              ...projUser,
              projectIds: data.projectIds
            }))
          );
        }
        return of(profileUser);
      }),
      tap((updatedUser: UserDetail) => {
        this.users.update(current =>
          current.map(u => u.id === userId ? {
            ...u,
            ...updatedUser,
            projectIds: data.projectIds !== undefined ? data.projectIds : u.projectIds
          } : u)
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
   * Registra un nuevo usuario y le asocia la empresa y proyectos seleccionados
   */
  createUser(req: CreateUserRequest): Observable<UserDetail> {
    this.isLoading.set(true);

    const registerBody = {
      username: req.username.trim(),
      email: req.email.trim(),
      password: req.password,
      fullName: req.fullName.trim(),
      roles: req.roles && req.roles.length > 0 ? req.roles : ['ROLE_USER'],
      projectIds: req.projectIds || []
    };

    return this.http.post<any>(this.registerUrl, registerBody).pipe(
      switchMap(authRes => {
        const newUserId = authRes.id;
        const comp$ = req.companyId ? this.assignCompany(newUserId, req.companyId) : of(null);
        const projs$ = (req.projectIds && req.projectIds.length > 0) ? this.assignProjects(newUserId, req.projectIds) : of(null);

        return forkJoin([comp$, projs$]).pipe(
          switchMap(() => this.loadUsers())
        );
      }),
      map(users => users.find(u => u.username === req.username) as UserDetail),
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }
}
