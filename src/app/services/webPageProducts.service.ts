import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProductInterface } from '../interfaces/products/products.interfaces';
import { environment } from '../../environments/environment';
import { ProductMapper } from '../mappers/product.mapper';
import { WebPageProductsResponseInterface } from '../interfaces/products/webPageProductsRespoonse.interface';

@Injectable({ providedIn: 'root' })
export class WebPageProductsService {

  private http = inject(HttpClient);
  private webPageProductsUrl = environment.webPageProductsUrl;

  productsSignal = signal<ProductInterface[]>([]);
  loadingProductSignal = signal(true);

  constructor() {
    this.loadWebPageProducts()
  }

  loadWebPageProducts() {
    this.loadingProductSignal.set(true);
    this.http
      .get<WebPageProductsResponseInterface[]>(`${this.webPageProductsUrl}`)
      .subscribe({
        next: (resp) => {
          const products = Array.isArray(resp)
            ? ProductMapper.mapProductsItemsToProductArray(resp)
            : [];
          this.productsSignal.set(products);
          this.loadingProductSignal.set(false);
        },
        error: (err) => {
          console.error('Error cargando productos de Web Page:', err);
          this.productsSignal.set([]);
          this.loadingProductSignal.set(false);
        }
      });
  }
}

