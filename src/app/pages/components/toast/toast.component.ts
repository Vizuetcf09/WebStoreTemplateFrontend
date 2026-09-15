import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[80] flex flex-col gap-3 w-[min(92vw,360px)]">
      @for (toast of toastService.messages(); track toast.id) {
        <div
          class="rounded-2xl px-4 py-3 shadow-lg text-sm font-semibold animate-fade-in"
          [ngClass]="{
            'bg-brand-green text-brand-dark': toast.type === 'success',
            'bg-red-500 text-white': toast.type === 'error',
            'bg-brand-dark text-white': toast.type === 'info'
          }"
        >
          {{ toast.text }}
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
