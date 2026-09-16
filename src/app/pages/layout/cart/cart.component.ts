import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { WebPagePayPalService } from '../../../services/webPagePayPal.service';
import { ToastService } from '../../../services/toast.service';
import { Header } from '../header/header.component';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, RouterLink, Header],
    template: `
    <Header></Header>
    <main class="mx-auto min-h-screen max-w-4xl p-6">
      <a routerLink="/products" class="text-sm font-bold text-brand-purple">&larr; Seguir comprando</a>
      <h1 class="mt-6 text-4xl font-black text-brand-dark">Tu carrito</h1>
      @for (item of cart.items(); track item.product.id + ':' + (item.variant?.variantId || 'default')) {
      <article [routerLink]="['/products', item.product.id]"
        class="mt-4 flex cursor-pointer flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-lg">
        <div class="flex items-center gap-4">
          <img [src]="item.variant?.previewUrl || item.product.imageUrl" [alt]="item.product.name" class="h-20 w-20 object-contain">
          <div class="flex-1"><h2 class="font-bold">{{ item.product.name }}</h2><p>{{ item.quantity }} x {{ (item.variant?.price || item.product.price) | currency }}</p></div>
          <div class="flex items-center gap-2" (click)="$event.stopPropagation()">
            <button type="button" (click)="cart.decrement(item)" class="h-8 w-8 rounded-lg bg-brand-gray font-bold">-</button>
            <span class="min-w-6 text-center font-bold">{{ item.quantity }}</span>
            <button type="button" [disabled]="item.quantity >= item.product.stock" (click)="cart.increment(item)" class="h-8 w-8 rounded-lg bg-brand-gray font-bold disabled:opacity-30">+</button>
          </div>
          <button type="button" (click)="cart.remove(item); $event.stopPropagation()" class="text-sm font-bold text-red-600">Eliminar</button>
        </div>
      </article>
      } @empty { <p class="mt-8 text-gray-500">Tu carrito está vacío.</p> }
      @if (cart.items().length) {
      <div class="mt-5 flex justify-end">
        <a routerLink="/products"
          class="rounded-lg bg-brand-green px-4 py-2 text-sm font-bold text-brand-dark transition-opacity hover:opacity-80">
          Agregar más productos
        </a>
      </div>
      }
      <div class="mt-8 flex items-center justify-between border-t pt-5"><span class="font-bold">Total</span><strong class="text-2xl">{{ cart.total() | currency }}</strong></div>
      <button type="button" [disabled]="!cart.items().length || paypal.loadingPayingPaypalSignal()" (click)="pay()"
        class="mt-5 w-full rounded-xl bg-brand-purple px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
        {{ paypal.loadingPayingPaypalSignal() ? 'Procesando pago...' : 'Pagar con PayPal' }}
      </button>
    </main>
  `
})
export class CartComponent {
    cart = inject(CartService);
    paypal = inject(WebPagePayPalService);
    private toast = inject(ToastService);

    async pay() {
        if (!this.cart.items().length) return;
        try {
            await this.paypal.checkoutCart(this.cart.items(), this.cart.total());
        } catch {
            this.toast.error('No se pudo iniciar el pago. Inténtalo de nuevo.');
        }
    }
}