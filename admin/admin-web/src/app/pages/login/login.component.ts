import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Campos del formulario
  usernameOrEmail = '';
  password = '';
  rememberMe = true;
  showPassword = false;

  // Estados de carga y error
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  sessionExpiredNotice = signal(false);

  ngOnInit(): void {
    // Si viene redirigido con expired=true, mostrar mensaje de sesión expirada
    this.route.queryParams.subscribe(params => {
      if (params['expired'] === 'true') {
        this.sessionExpiredNotice.set(true);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.usernameOrEmail.trim() || !this.password) {
      this.errorMessage.set('Por favor ingresa tu usuario o correo y tu contraseña.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.sessionExpiredNotice.set(false);

    this.authService.login(this.usernameOrEmail, this.password, this.rememberMe).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastService.success(`¡Bienvenido de nuevo, ${res.fullName || res.username}!`);

        // Cargar los proyectos correspondientes según el rol del usuario (Admin: todos, Otro rol: asignados)
        this.projectService.loadProjectsForCurrentUser();
        this.projectService.loadCompanies();

        // Redirigir a la URL que intentaba acceder o al dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('[Login] Error de autenticación:', err);

        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Usuario o contraseña incorrectos. Verifica tus credenciales.');
        } else if (err.status === 0 || err.status === 504) {
          this.errorMessage.set(`No se pudo conectar con el servicio admin-api en ${environment.apiUrl}. Verifica que el backend esté activo.`);
        } else {
          this.errorMessage.set(
            err?.error?.message || 'Error al iniciar sesión en el servidor. Intenta nuevamente.'
          );
        }
      }
    });
  }
}
