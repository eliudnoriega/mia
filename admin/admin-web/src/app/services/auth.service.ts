import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles?: string[];
  role?: string;
  projectIds?: string[];
  expiresIn?: number;
}

export interface DecodedJwt {
  sub?: string;
  userId?: number;
  fullName?: string;
  roles?: string[];
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

const TOKEN_KEY = 'admin_api_token';
const USER_KEY = 'admin_api_user';
const EXP_KEY = 'admin_api_token_exp';
const REMEMBER_KEY = 'admin_api_remember';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Endpoint base de autenticación en admin-api configurado desde environment
  private readonly baseUrl = environment.services.auth;

  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<AuthResponse | null>(this.getStoredUser());
  readonly currentUserId = signal<number>(this.getStoredUser()?.id ?? 1);
  readonly sessionExpiry = signal<number | null>(this.getStoredExpiration());

  // Señal computada para verificar si la sesión está activa y vigente
  readonly isSessionActive = computed(() => {
    const t = this.token();
    if (!t) return false;
    return !this.isTokenExpired();
  });

  // Señal computada para verificar si el usuario autenticado tiene permisos de Administrador
  readonly isAdmin = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    if (user.role && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN')) return true;
    if (user.roles && user.roles.some(r => r === 'ROLE_ADMIN' || r === 'ADMIN')) return true;
    return false;
  });

  // Nombre para mostrar del usuario activo
  readonly displayName = computed(() => {
    const user = this.currentUser();
    return user?.fullName || user?.username || 'Usuario';
  });

  // Temporizador para vigilar expiración en tiempo real
  private sessionCheckTimer: any = null;

  constructor() {
    this.startSessionWatcher();
  }

  /**
   * Obtiene el token guardado en localStorage o sessionStorage
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Obtiene la información del usuario autenticado
   */
  private getStoredUser(): AuthResponse | null {
    try {
      const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Obtiene la marca de tiempo (milisegundos) en la que expira la sesión
   */
  private getStoredExpiration(): number | null {
    try {
      const exp = localStorage.getItem(EXP_KEY) || sessionStorage.getItem(EXP_KEY);
      if (exp) return parseInt(exp, 10);

      // Si no existe fecha guardada, intentar decodificarla desde el JWT
      const token = this.getStoredToken();
      if (token) {
        const decoded = this.decodeJwt(token);
        if (decoded?.exp) {
          return decoded.exp * 1000;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Decodifica de forma segura la carga útil (payload) de un token JWT
   */
  decodeJwt(token: string): DecodedJwt | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.warn('[AuthService] Error al decodificar JWT:', e);
      return null;
    }
  }

  /**
   * Verifica si el token actual ya expiró
   */
  isTokenExpired(): boolean {
    const currentToken = this.token() || this.getStoredToken();
    if (!currentToken) return true;

    // 1. Revisar claim 'exp' del JWT
    const decoded = this.decodeJwt(currentToken);
    if (decoded && decoded.exp) {
      const expMs = decoded.exp * 1000;
      if (Date.now() >= expMs) {
        return true;
      }
      return false;
    }

    // 2. Revisar marca de tiempo guardada
    const expTime = this.sessionExpiry() || this.getStoredExpiration();
    if (expTime) {
      return Date.now() >= expTime;
    }

    return false;
  }

  /**
   * Indica si la sesión actual es válida y vigente
   */
  isSessionValid(): boolean {
    const t = this.getToken();
    return !!t && !this.isTokenExpired();
  }

  /**
   * Indica si hubo una sesión previa registrada (para distinguir entre usuario nuevo y sesión vencida)
   */
  hadPreviousSession(): boolean {
    return !!(this.getStoredToken() || this.getStoredUser());
  }

  /**
   * Retorna el token activo si es válido, o null si ya expiró
   */
  getToken(): string | null {
    const t = this.token() || this.getStoredToken();
    if (!t) return null;

    if (this.isTokenExpired()) {
      this.logout({ expired: true, redirect: true });
      return null;
    }

    return t;
  }

  /**
   * Inicia sesión contra el backend admin-api (POST /admin-api/api/auth/login)
   */
  login(usernameOrEmail: string, password: string, rememberMe = true): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, {
      usernameOrEmail: usernameOrEmail.trim(),
      password
    }).pipe(
      tap(res => {
        if (res && res.token) {
          // Determinar tiempo de expiración
          let expirationMs: number;
          const decoded = this.decodeJwt(res.token);
          if (decoded?.exp) {
            expirationMs = decoded.exp * 1000;
          } else if (res.expiresIn) {
            expirationMs = Date.now() + res.expiresIn;
          } else {
            // Valor por defecto: 24 horas
            expirationMs = Date.now() + 86400000;
          }

          // Normalizar roles
          if (!res.roles && res.role) {
            res.roles = [res.role];
          }

          const storage = rememberMe ? localStorage : sessionStorage;
          try {
            // Limpiar ambos antes de guardar
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(EXP_KEY);
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
            sessionStorage.removeItem(EXP_KEY);

            storage.setItem(TOKEN_KEY, res.token);
            storage.setItem(USER_KEY, JSON.stringify(res));
            storage.setItem(EXP_KEY, expirationMs.toString());
            localStorage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false');
          } catch (e) {
            console.warn('[AuthService] No se pudo guardar en almacenamiento local:', e);
          }

          // Actualizar señales reactivas
          this.token.set(res.token);
          this.currentUser.set(res);
          this.currentUserId.set(res.id);
          this.sessionExpiry.set(expirationMs);
        }
      })
    );
  }

  /**
   * Cierra la sesión activa y opcionalmente redirige a la pantalla de login
   */
  logout(options?: { expired?: boolean; redirect?: boolean }): void {
    const expired = options?.expired ?? false;
    const redirect = options?.redirect ?? true;

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(EXP_KEY);
      localStorage.removeItem('mia_admin_projects_v1');
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(EXP_KEY);
    } catch (e) {
      console.warn('[AuthService] Error al limpiar almacenamiento:', e);
    }

    this.token.set(null);
    this.currentUser.set(null);
    this.sessionExpiry.set(null);

    if (redirect) {
      const queryParams = expired ? { expired: 'true' } : {};
      this.router.navigate(['/login'], { queryParams });
    }
  }

  /**
   * Vigilante en segundo plano que comprueba periódicamente si la sesión expiró
   */
  private startSessionWatcher(): void {
    if (typeof window === 'undefined') return;

    if (this.sessionCheckTimer) {
      clearInterval(this.sessionCheckTimer);
    }

    // Comprobación cada 10 segundos
    this.sessionCheckTimer = setInterval(() => {
      const activeToken = this.token() || this.getStoredToken();
      if (activeToken && this.isTokenExpired()) {
        console.warn('[AuthService] La sesión JWT ha vencido. Redirigiendo a pantalla de login...');
        this.logout({ expired: true, redirect: true });
      }
    }, 10000);
  }
}
