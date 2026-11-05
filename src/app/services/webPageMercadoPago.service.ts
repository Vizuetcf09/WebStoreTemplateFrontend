import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductInterface } from '../interfaces/products/products.interfaces';
import {
    MercadoPagoPaymentResponseInterface,
    MercadoPagoPreferenceResponseInterface
} from '../interfaces/mercadopago/mercadoPagoResponse.interface';
import { CartItem } from './cart.service';

@Injectable({ providedIn: 'root' })
export class WebPageMercadoPagoService {
    private http = inject(HttpClient);
    private apiUrl = environment.webPageMercadoPagoUrl;

    loadingPayingSignal = signal(false);

    async checkoutWithMercadoPago(product: ProductInterface) {
        return this.checkout({ items: [{ productId: product.id, quantity: 1 }] });
    }

    async checkoutCart(items: CartItem[]) {
        if (!items.length) return;

        return this.checkout({
            items: items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                ...(item.variant && { variantId: item.variant.variantId })
            }))
        });
    }

    async getPaymentStatus(paymentId: string): Promise<'approved' | 'pending' | 'rejected'> {
        const response = await lastValueFrom(
            this.http.get<MercadoPagoPaymentResponseInterface>(`${this.apiUrl}/payment/${paymentId}`)
        );

        if (response.data.status === 'approved') return 'approved';
        if (['pending', 'in_process', 'authorized'].includes(response.data.status)) return 'pending';
        return 'rejected';
    }

    private async checkout(body: { items: { productId: string; quantity: number; variantId?: number }[] }) {
        if (this.loadingPayingSignal()) return;

        this.loadingPayingSignal.set(true);
        try {
            const response = await lastValueFrom(
                this.http.post<MercadoPagoPreferenceResponseInterface>(
                    `${this.apiUrl}/create-preference`,
                    body
                )
            );

            if (!response.success || !response.data?.checkoutUrl) {
                throw new Error('La respuesta de Mercado Pago no contiene el enlace de pago.');
            }

            window.location.href = response.data.checkoutUrl;
        } catch (error) {
            this.loadingPayingSignal.set(false);
            throw error;
        }
    }
}