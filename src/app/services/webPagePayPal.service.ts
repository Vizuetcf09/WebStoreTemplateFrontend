import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/products.interfaces';
import { environment } from '../../environments/environment';
// import { PayPalMapper } from '../mapper/product.mapper';
// import { WebPagePayPalResponse } from '../interfaces/webPageApi.interface';

@Injectable({ providedIn: 'root' })
export class WebPagePayPalService {

  private http = inject(HttpClient);

  paypalSignal = signal<Product[]>([]);
  loadingPayPalSignal = signal(true);

  constructor() {
    this.loadWebPagePayPalProducts()
  }

  loadWebPagePayPalProducts() {
    this.http.post<WebPagePayPalResponse[]>(`${environment.webPagePayPalUrl}`, )
      .subscribe((resp) => {
  const products = PayPalMapper.mapProductsItemsToProductArray(resp);
  this.paypalSignal.set(products);
  this.loadingPayPalSignal.set(false);
});
  }

}
