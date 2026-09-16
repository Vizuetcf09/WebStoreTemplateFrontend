import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'Header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class Header {
  auth = inject(AuthService);
  cart = inject(CartService);
  private toast = inject(ToastService);
  isMenuOpen = false;

  menuItems = [
    { label: 'Home', link: '/' },
    { label: 'Products', link: '/products' },
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.isMenuOpen = false;
    this.toast.success('Sesión cerrada');
  }
}
