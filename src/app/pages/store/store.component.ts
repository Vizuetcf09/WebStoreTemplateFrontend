import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { WebPageProductsService } from "../../services/webPageProducts.service";
import { Header } from "../layout/header/header.component";
import { ProductStoreComponet } from "./components/Products.component";

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, Header, ProductStoreComponet],
  templateUrl: './store.component.html',
})
export class StoreComponent {
  productService = inject(WebPageProductsService).productsSignal;
}