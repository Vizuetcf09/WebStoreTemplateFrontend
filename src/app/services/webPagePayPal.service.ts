import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductInterface } from '../interfaces/products/products.interfaces';
import { WebPagePaypalRequestInterface } from '../interfaces/paypal/webPagePaypalRequest.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebPagePayPalService {

  private http = inject(HttpClient);
  private paypalApiUrl = environment.webPagePayPalUrl;

  payingPaypalSignal = signal<boolean>(false);
  loadingPayingPayPalSignal = signal(true);

  // se usa "async/await" (y no ".suscribe") en la función "checkoutWithPaypal()" ya que el canal entre la api y el froinden se debe s¿cerrar despues de recibir los datos enviados por la api.
  async checkoutWithPaypal(product: ProductInterface) {
    if (this.payingPaypalSignal()) return; // 

    this.loadingPayingPayPalSignal.set(true)

    try {
      const body = {
        productID: product.id,
        productName: product.name,
        price: product.price
      }

      // "lastValueFrom" convierte las peticiones de angular (observable: canal abierto con ".suscribe") en promesa
      const response = await lastValueFrom(
        this.http
          .post<WebPagePaypalRequestInterface>(`${this.paypalApiUrl}/pay`, body)
      );

      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error(`Checkout error: ${error}`);
      this.payingPaypalSignal.set(false)
    }
  };

}
