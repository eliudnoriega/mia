import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  // Verificar si la petición es hacia el backend admin-api configurado en environment
  const isApiTarget = req.url.includes(environment.apiUrl) ||
                      req.url.includes('localhost:8080') ||
                      req.url.includes('admin-api') ||
                      req.url.startsWith('/api');

  // Si la petición es para autenticación (/auth/login), permitir pasar sin token
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  let modifiedReq = req;

  if (isApiTarget && !isAuthEndpoint) {
    // Si la sesión ya venció antes de la petición, abortar y redirigir
    if (authService.isTokenExpired() && authService.token()) {
      toastService.warning('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      authService.logout({ expired: true, redirect: true });
      return throwError(() => new Error('Sesión JWT expirada'));
    }

    const token = authService.getToken();
    if (token) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor devuelve 401 Unauthorized, la sesión venció o el token fue revocado
      if (error.status === 401 && !isAuthEndpoint) {
        console.warn('[authInterceptor] 401 Unauthorized recibido de admin-api. Redirigiendo a login...');
        toastService.warning('Tu sesión ha vencido o no es válida. Por favor inicia sesión nuevamente.');
        authService.logout({ expired: true, redirect: true });
      }

      return throwError(() => error);
    })
  );
};
