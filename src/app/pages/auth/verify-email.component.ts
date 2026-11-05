import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="min-h-screen bg-brand-gray/70 flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-[1.75rem] bg-white p-8 text-center shadow-[0_24px_70px_rgba(32,36,44,0.14)]">
        <p class="text-sm font-bold uppercase tracking-[0.22em] text-brand-purple">Web Store</p>
        <h1 class="mt-3 text-3xl font-black">{{ title }}</h1>
        <p class="mt-3 text-black/60">{{ message }}</p>
        @if (loading) {
          <div class="mt-6 text-sm font-semibold text-black/60">Validando tu correo...</div>
        } @else {
          <a routerLink="/auth" class="mt-6 inline-block rounded-2xl bg-brand-dark px-6 py-3 font-bold text-white">
            Ir al inicio de sesión
          </a>
        }
      </div>
    </section>
  `
})
export class VerifyEmailComponent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  loading = true;
  title = 'Verificando correo';
  message = 'Estamos validando tu enlace de verificación.';

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.finish(false, 'El enlace de verificación está incompleto.');
      return;
    }

    this.auth.verifyEmail(token)
      .then((response) => this.finish(true, response.message))
      .catch((error) => this.finish(false, error?.error?.message || 'El enlace no es válido o ha expirado.'));
  }

  private finish(success: boolean, message: string) {
    this.loading = false;
    this.title = success ? '¡Correo verificado!' : 'No pudimos verificar tu correo';
    this.message = message;
  }
}
