import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductInterface } from '../interfaces/products/products.interfaces';
import { WebPagePaypalRequestInterface } from '../interfaces/paypal/webPagePaypalRequest.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebPagePayPalService {

  private http = inject(HttpClient);
  private paypalApiUrl = environment.webPagePayPalLocalUrl;

  loadingPayingPaypalSignal = signal(false);

  // se usa "async/await" (y no ".suscribe") en la función "checkoutWithPaypal()" ya que el canal entre la api y el froinden se debe s¿cerrar despues de recibir los datos enviados por la api.
  async checkoutWithPaypal(product: ProductInterface) {
    if (this.loadingPayingPaypalSignal()) return; // 

    this.loadingPayingPaypalSignal.set(true)

    try {
      const body = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price
      }

      // "lastValueFrom" convierte las peticiones de angular (observable: canal abierto con ".suscribe") en promesa
      const response = await lastValueFrom(
        this.http
          .post<WebPagePaypalRequestInterface>(`${this.paypalApiUrl}/create-order`, body)
      );

      if (response?.success && response.data?.approveLink) {
        window.location.href = response.data.approveLink;
      }
      // console.log(response.data)
    } catch (error) {
      console.error(`Checkout error: ${error}`);
      this.loadingPayingPaypalSignal.set(false)
    }
  };

}
