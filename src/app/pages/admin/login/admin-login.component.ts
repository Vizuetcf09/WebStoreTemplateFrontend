import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  mode: 'login' | 'register' = 'login';
  loading = false;
  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Completa el correo y la contraseña');
      return;
    }

    this.loading = true;
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      this.toast.success('Sesión iniciada');
      await this.router.navigate(['/']);
    } catch (error) {
      const message = error instanceof HttpErrorResponse
        ? (error.error?.message || 'Credenciales inválidas o error de red')
        : 'No se pudo iniciar sesión';
      this.toast.error(message);
    } finally {
      this.loading = false;
    }
  }

  async register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.error('Completa nombre, correo y contraseña');
      return;
    }

    this.loading = true;
    try {
      const { name, email, password } = this.registerForm.getRawValue();
      await this.auth.register(name.trim(), email.trim(), password);
      this.toast.success('Registro completado. Ya puedes iniciar sesión.');
      this.mode = 'login';
      this.form.patchValue({ email, password: '' });
      this.registerForm.reset({ name: '', email: '', password: '' });
    } catch (error) {
      const message = error instanceof HttpErrorResponse
        ? (error.error?.message || 'No se pudo completar el registro')
        : 'No se pudo completar el registro';
      this.toast.error(message);
    } finally {
      this.loading = false;
    }
  }
}
