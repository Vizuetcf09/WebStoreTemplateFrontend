import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProductInterface } from '../interfaces/products.interfaces';
import { environment } from '../../environments/environment';
import { ProductMapper } from '../mapper/product.mapper';
import { WebPageProductsResponseInterface } from '../interfaces/webPageApi.interface';

@Injectable({ providedIn: 'root' })
export class WebPageProductsService {

  private http = inject(HttpClient);

  productsSignal = signal<ProductInterface[]>([]);
  loadingProductSignal = signal(true);

  constructor() {
    this.loadWebPageProducts()
  }

  loadWebPageProducts() {
    this.http
      .get<WebPageProductsResponseInterface[]>(`${environment.webPageProductsUrl}`)
      .subscribe((resp) => {
        const products = ProductMapper.mapProductsItemsToProductArray(resp);
        this.productsSignal.set(products);
        this.loadingProductSignal.set(false);
      });
  }

}
