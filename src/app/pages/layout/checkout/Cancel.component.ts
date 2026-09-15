import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header.component';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  template: `

    <Header></Header>
    <div class="min-h-[60vh] flex items-center justify-center p-4 sm:p-6 bg-brand-gray/40">
      <div class="max-w-md w-full bg-white rounded-[1.75rem] shadow-[0_24px_70px_rgba(32,36,44,0.12)] p-6 sm:p-8 text-center ring-1 ring-black/5">
        <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 class="text-3xl font-black text-brand-ink mb-2">Pago Cancelado</h1>
        <p class="text-gray-600 mb-8">La transacción ha sido cancelada. No se ha realizado ningún cargo a tu cuenta de PayPal.</p>
        
        <div class="flex flex-col gap-3">
          <button routerLink="/products" 
            class="w-full bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-md">
            Intentar de nuevo
          </button>
          <button routerLink="/" 
            class="w-full bg-transparent text-gray-500 font-semibold py-2 hover:text-gray-800 transition-colors">
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  `
})
export class CancelComponent { }