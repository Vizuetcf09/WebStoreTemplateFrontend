import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { ProductInterface } from "../../../interfaces/products/products.interfaces";
import { WebPagePayPalService } from "../../../services/webPagePayPal.service";

@Component({
    selector: 'Products-store',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './Products.component.html',
})
export class ProductStoreComponet {
    @Input() products: ProductInterface[] = [];
    paypalService = inject(WebPagePayPalService)
    isPaying = this.paypalService.loadingPayingPaypalSignal;

    onPurchase(product: ProductInterface) {
        console.log('Botón presionado para:', product.name);
        this.paypalService.checkoutWithPaypal(product)
    }
}