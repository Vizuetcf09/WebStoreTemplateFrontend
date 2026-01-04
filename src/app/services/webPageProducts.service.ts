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

  // se usa ".suscribe" en la función "loadWebPageProducts()", ya que el canal entre la api y el backend debe estar abierto a posibles cambios
  loadWebPageProducts() {
    this.http
      .get<WebPageProductsResponseInterface[]>(`${this.webPageProductsUrl}`)
      .subscribe((resp) => {
        const products = ProductMapper.mapProductsItemsToProductArray(resp);
        this.productsSignal.set(products);
        this.loadingProductSignal.set(false);
      });
  } // TODO: mannejo de errores

}
