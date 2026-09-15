import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages = signal<ToastMessage[]>([]);
  private nextId = 1;

  show(text: string, type: ToastType = 'info', timeout = 3500) {
    const id = this.nextId++;
    this.messages.update((current) => [...current, { id, type, text }]);
    setTimeout(() => this.dismiss(id), timeout);
  }

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error', 5000);
  }

  dismiss(id: number) {
    this.messages.update((current) => current.filter((item) => item.id !== id));
  }
}
