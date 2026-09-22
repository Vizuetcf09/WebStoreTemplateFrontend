import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-80 flex w-[min(92vw,360px)] flex-col gap-3 sm:bottom-6 sm:right-6">
      @for (toast of toastService.messages(); track toast.id) {
        <div
          class="rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg"
          [class.animate-fade-in]="!toast.exiting"
          [class.animate-fade-out]="toast.exiting"
          [ngClass]="{
            'bg-brand-green text-brand-dark': toast.type === 'success',
            'bg-red-500 text-white': toast.type === 'error',
            'bg-brand-dark text-white': toast.type === 'info'
          }"
        >
          <p>{{ toast.text }}</p>
          @if (toast.action) {
            <div class="mt-3 flex justify-end gap-2">
              <button type="button" (click)="toastService.dismiss(toast.id)"
                class="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold hover:bg-white/25">
                Cancelar
              </button>
              <button type="button" (click)="toast.action.callback()"
                class="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-brand-green">
                {{ toast.action.label }}
              </button>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
