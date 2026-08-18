import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { WebPageProductsService } from "../../services/webPageProducts.service";
import { Header } from "../layout/header/header.component";
import { ProductStoreComponet } from "./components/Products.component";

@Component({
  selector: 'app-store-page',
  standalone: true,
  imports: [CommonModule, Header, ProductStoreComponet],
  templateUrl: './store.component.html',
})
export default class StoreComponent {
  id = input.required<string>();

  private webPageService = inject(WebPageProductsService);

  get productService() {
    const allProducts = this.webPageService.productsSignal();
    const currentId = this.id();
    const found = allProducts.find(product => product.id === currentId);
    return found ? [found] : [];
  }

  product = computed(() => {
    const allProducts = this.webPageService.productsSignal();
    const currentId = this.id();
    return allProducts.find(product => product.id === currentId);
  });
}