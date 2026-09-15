import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { PrintfulProductInterface } from '../interfaces/printful/printful.interfaces';
import { WebPagePrintfulApiWrapper } from '../interfaces/printful/webPagePrintfulResponse.interface';
import { PrintfulMapper } from '../mappers/printful.mapper';

@Injectable({ providedIn: 'root' })
export class WebPagePrintfulService {
  private http = inject(HttpClient);
  private webPagePrintfulUrl = environment.webPagePrintfulUrl;

  printfulProductsSignal = signal<PrintfulProductInterface[]>([]);
  loadingPrintfulProductsSignal = signal(true);
  printfulErrorSignal = signal<string | null>(null);

  constructor() {
    this.loadWebPagePrintfulProducts();
  }

  loadWebPagePrintfulProducts() {
    this.loadingPrintfulProductsSignal.set(true);
    this.printfulErrorSignal.set(null);
    this.http
      .get<WebPagePrintfulApiWrapper | any[]>(`${this.webPagePrintfulUrl}/products`)
      .subscribe({
        next: (resp) => {
          const rawItems = Array.isArray(resp) ? resp : resp?.data;
          const products = rawItems
            ? PrintfulMapper.mapPrintfulItemsToProductArray(rawItems)
            : [];
          this.printfulProductsSignal.set(products);
          this.loadingPrintfulProductsSignal.set(false);
        },
        error: (err) => {
          console.error('Error cargando productos de Printful:', err);
          this.printfulProductsSignal.set([]);
          this.printfulErrorSignal.set(
            err?.error?.message || err?.error?.error || 'No se pudo cargar el catálogo de Printful'
          );
          this.loadingPrintfulProductsSignal.set(false);
        }
      });
  }

  getStatus() {
    return firstValueFrom(
      this.http.get<{ success: boolean; data: { configured: boolean; storeIdConfigured: boolean } }>(
        `${this.webPagePrintfulUrl}/status`
      )
    );
  }

  getProductDetail(id: number) {
    return firstValueFrom(
      this.http.get<{ success: boolean; data: any }>(`${this.webPagePrintfulUrl}/products/${id}`)
    );
  }

  syncProduct(id: number, payload: { category?: string; markupPercent?: number } = {}) {
    return firstValueFrom(
      this.http.post<{ success: boolean; message: string; data: unknown }>(
        `${this.webPagePrintfulUrl}/products/${id}/sync`,
        payload
      )
    );
  }

  syncAll(payload: { category?: string; markupPercent?: number; ids?: number[] } = {}) {
    return firstValueFrom(
      this.http.post<{ success: boolean; message: string; data: unknown[] }>(
        `${this.webPagePrintfulUrl}/products/sync-all`,
        payload
      )
    );
  }

  importSelected(ids: number[], payload: { category?: string; markupPercent?: number } = {}) {
    return firstValueFrom(
      this.http.post<{ success: boolean; message: string; data: unknown[] }>(
        `${this.webPagePrintfulUrl}/products/import`,
        { ...payload, ids }
      )
    );
  }
}
