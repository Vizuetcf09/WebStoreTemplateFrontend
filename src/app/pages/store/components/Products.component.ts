import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { ProductInterface } from "../../../interfaces/products/products.interfaces";
import { WebPagePayPalService } from "../../../services/webPagePayPal.service";
import { WebPageMercadoPagoService } from "../../../services/webPageMercadoPago.service";
import { ToastService } from "../../../services/toast.service";

@Component({
    selector: 'Products-store',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './Products.component.html',
})
export class ProductStoreComponet {
    @Input() products: ProductInterface[] = [];
    paypalService = inject(WebPagePayPalService)
    mercadoPagoService = inject(WebPageMercadoPagoService)
    private toast = inject(ToastService)
    isPaying = this.paypalService.loadingPayingPaypalSignal;

    onPurchase(product: ProductInterface) {
        console.log('Botón presionado para:', product.name);
        this.paypalService.checkoutWithPaypal(product)
    }

    async onMercadoPagoPurchase(product: ProductInterface) {
        try {
            await this.mercadoPagoService.checkoutWithMercadoPago(product);
        } catch {
            this.toast.error('No se pudo iniciar el pago con Mercado Pago. Inténtalo de nuevo.');
        }
    }
}