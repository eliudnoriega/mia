import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Iniciar Sesión | Portal MIA'
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    title: 'Dashboard de Control | MIA'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
