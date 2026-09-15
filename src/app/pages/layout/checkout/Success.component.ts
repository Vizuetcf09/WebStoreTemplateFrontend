import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../header/header.component';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  template: `

    <Header></Header>
    <div class="min-h-[60vh] flex items-center justify-center p-4 sm:p-6 bg-brand-gray/40">
      <div class="max-w-md w-full bg-white rounded-[1.75rem] shadow-[0_24px_70px_rgba(32,36,44,0.12)] p-6 sm:p-8 text-center ring-1 ring-black/5">
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-3xl font-black text-brand-ink mb-2">¡Pago Completado!</h1>
        <p class="text-gray-600 mb-6">Gracias por tu compra. Hemos recibido tu pago correctamente y estamos procesando tu pedido.</p>
        
        <div class="bg-brand-gray/60 rounded-xl p-4 mb-8">
          <span class="text-xs uppercase tracking-wider text-gray-500 font-semibold">ID de Transacción</span>
          <p class="text-sm font-mono font-bold text-gray-800 break-all">{{ orderId }}</p>
        </div>

        <div class="space-y-3">
          <button routerLink="/products" 
            class="w-full bg-brand-green text-brand-dark font-bold py-3 rounded-xl hover:-translate-y-0.5 transition-transform shadow-md">
            Volver a la tienda
          </button>
          <p class="text-xs text-gray-400">Se ha enviado un recibo a tu correo electrónico.</p>
        </div>
      </div>
    </div>
  `
})

export class SuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  orderId: string | null = '';

  ngOnInit() {
    // Obtenemos el token/orderID que el backend puso en la redirección
    // Ejemplo: /checkout/success?token=1MU33209LY348811Y
    this.orderId = this.route.snapshot.queryParamMap.get('token') ||
      this.route.snapshot.queryParamMap.get('orderID');
  }
}