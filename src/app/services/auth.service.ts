import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'webstore_admin_token';
const USER_KEY = 'webstore_admin_user';
const ROLE_KEY = 'webstore_user_role';

export type UserRole = 'user' | 'admin';

interface LoginResponse {
  message: string;
  userId: string;
  name: string;
  email: string;
  role?: UserRole;
  isAdmin?: boolean;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  token = signal<string | null>(this.readStorage(TOKEN_KEY));
  userName = signal<string | null>(this.readStorage(USER_KEY));
  role = signal<UserRole>(this.readStorage(ROLE_KEY) === 'admin' ? 'admin' : 'user');
  isAuthenticated = computed(() => Boolean(this.token()));
  isAdmin = computed(() => this.role() === 'admin');

  private readStorage(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async login(email: string, password: string) {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.webPageUserUrl}/login`, { email, password })
    );

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, response.name);
    const role: UserRole = response.isAdmin || response.role === 'admin' ? 'admin' : 'user';
    localStorage.setItem(ROLE_KEY, role);
    this.token.set(response.token);
    this.userName.set(response.name);
    this.role.set(role);
    return response;
  }

  async register(name: string, email: string, password: string) {
    return firstValueFrom(
      this.http.post<{ message: string; userId: string; name: string; email: string }>(
        `${environment.webPageUserUrl}/register`,
        { name, email, password }
      )
    );
  }

  logout(redirect = true) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.token.set(null);
    this.userName.set(null);
    this.role.set('user');
    if (redirect) this.router.navigate(['/']);
  }
}
