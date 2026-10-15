import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Guard que protege rutas autenticadas.
 * Si la sesión no existe o ya venció, redirige inmediatamente al login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isSessionValid()) {
    return true;
  }

  // Si había una sesión previa pero ya expiró, avisamos al usuario
  if (authService.hadPreviousSession() && authService.isTokenExpired()) {
    toastService.warning('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
    authService.logout({ expired: true, redirect: false });
    return router.createUrlTree(['/login'], {
      queryParams: { expired: 'true', returnUrl: state.url }
    });
  }

  // Redirigir al login guardando la URL a la que intentaba acceder
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * Guard que impide el acceso a /login si el usuario ya tiene una sesión activa y válida.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isSessionValid()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
