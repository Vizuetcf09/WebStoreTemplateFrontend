import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

  constructor() {
    this.loadWebPagePrintfulProducts();
  }

  loadWebPagePrintfulProducts() {
    this.loadingPrintfulProductsSignal.set(true);
    this.http
      .get<WebPagePrintfulApiWrapper>(`${this.webPagePrintfulUrl}/products`)
      .subscribe({
        next: (resp) => {
          const products = resp?.data
            ? PrintfulMapper.mapPrintfulItemsToProductArray(resp.data)
            : [];
          this.printfulProductsSignal.set(products);
          this.loadingPrintfulProductsSignal.set(false);
        },
        error: (err) => {
          console.error('Error cargando productos de Printful:', err);
          this.printfulProductsSignal.set([]);
          this.loadingPrintfulProductsSignal.set(false);
        }
      });
  }
}