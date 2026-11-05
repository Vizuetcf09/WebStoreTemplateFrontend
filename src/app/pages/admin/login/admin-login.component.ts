import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

export const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'outlook.es',
  'hotmail.com',
  'hotmail.es',
  'live.com',
  'live.com.mx',
  'msn.com',
  'yahoo.com',
  'yahoo.es',
  'yahoo.com.mx',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'zoho.com'
];

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function emailProviderValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    if (!raw) return null;

    const value = String(raw).trim().toLowerCase();

    // 1. Debe cumplir el formato usuario@dominio.extension (ej. usuario@gmail.com, rechaza 'holamundo@holamundo')
    if (!EMAIL_PATTERN.test(value)) {
      return { invalidEmailFormat: true };
    }

    const parts = value.split('@');
    if (parts.length !== 2) {
      return { invalidEmailFormat: true };
    }

    // 2. Solo se aceptan proveedores reconocidos (gmail, outlook, hotmail, yahoo, etc.)
    const domain = parts[1];
    if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
      return { invalidEmailDomain: true };
    }

    return null;
  };
}

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
  resendLoading = false;
  verificationEmail = '';
  verificationMessage = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, emailProviderValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, emailProviderValidator()]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });

  setMode(newMode: 'login' | 'register') {
    this.mode = newMode;
  }

  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return Boolean(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(form: FormGroup, controlName: string): string | null {
    const control = form.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'Este campo es obligatorio';
    }
    if (errors['emailExists']) {
      return 'Este correo electrónico ya está registrado';
    }
    if (errors['emailNotFound']) {
      return 'No existe una cuenta registrada con este correo';
    }
    if (errors['invalidEmailFormat']) {
      return 'Ingresa un correo electrónico completo y válido (ej. usuario@gmail.com)';
    }
    if (errors['invalidEmailDomain']) {
      return 'Solo se permiten correos de proveedores válidos (Gmail, Outlook, Hotmail, Yahoo o iCloud)';
    }
    if (errors['email'] || errors['pattern']) {
      return 'Formato de correo no válido';
    }
    if (errors['minlength']) {
      return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `No puede exceder los ${errors['maxlength'].requiredLength} caracteres`;
    }
    return 'Dato inválido';
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const loginEmail = this.form.getRawValue().email.trim().toLowerCase();
    try {
      const { password } = this.form.getRawValue();
      await this.auth.login(loginEmail, password);
      this.verificationMessage = '';
      this.toast.success('Sesión iniciada con éxito');
      await this.router.navigate(['/']);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        const raw = String(error.error?.message || error.error || error.message || '');
        const lower = raw.toLowerCase();

        if (error.status === 403 && error.error?.requiresVerification) {
          this.verificationEmail = String(error.error.email || loginEmail).trim().toLowerCase();
          this.verificationMessage = 'Tu correo electrónico no está verificado. Revisa tu bandeja de entrada o solicita un nuevo enlace.';
          return;
        }

        if (lower.includes('does not exist') || lower.includes('no existe')) {
          const emailCtrl = this.form.get('email');
          emailCtrl?.setErrors({ emailNotFound: true });
          emailCtrl?.markAsTouched();
        } else {
          this.toast.error('Correo o contraseña incorrectos. Verifica tus datos.');
        }
      } else {
        this.toast.error('No se pudo iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      this.loading = false;
    }
  }

  async register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const { name, email, password } = this.registerForm.getRawValue();
      await this.auth.register(name.trim(), email.trim().toLowerCase(), password);
      this.verificationEmail = email.trim().toLowerCase();
      this.verificationMessage = 'Cuenta creada. Revisa tu correo y confirma tu dirección antes de iniciar sesión.';
      this.toast.success('Cuenta creada. Te enviamos un enlace de verificación.');
      this.mode = 'login';
      this.form.patchValue({ email: email.trim().toLowerCase(), password: '' });
      this.form.markAsUntouched();
      this.registerForm.reset({ name: '', email: '', password: '' });
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        const raw = String(error.error?.message || error.error || error.message || '');
        const lower = raw.toLowerCase();

        // Si el correo ya existe (409, 400, o mensaje de clave duplicada / exists)
        if (error.status === 409 || lower.includes('already exists') || lower.includes('registrado') ||
          lower.includes('ya existe') || lower.includes('duplicate key')) {
          const emailCtrl = this.registerForm.get('email');
          emailCtrl?.setErrors({ emailExists: true });
          emailCtrl?.markAsTouched();
        } else if (error.error?.field && error.error.field !== 'email') {
          this.toast.error(raw || 'Revisa los datos del registro.');
        } else {
          this.toast.error(raw || 'No se pudo completar el registro.');
        }
      } else {
        this.toast.error('No se pudo completar el registro. Inténtalo de nuevo.');
      }
    } finally {
      this.loading = false;
    }
  }

  async resendVerification() {
    if (!this.verificationEmail || this.resendLoading) return;

    this.resendLoading = true;
    try {
      const response = await this.auth.resendVerification(this.verificationEmail);
      this.verificationMessage = response.message;
      this.toast.success('Enlace de verificación enviado');
    } catch (error) {
      const message = error instanceof HttpErrorResponse
        ? String(error.error?.message || 'No pudimos reenviar el correo. Inténtalo más tarde.')
        : 'No pudimos reenviar el correo. Inténtalo más tarde.';
      this.verificationMessage = message;
      this.toast.error(message);
    } finally {
      this.resendLoading = false;
    }
  }
}
