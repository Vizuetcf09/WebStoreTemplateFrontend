import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { WebPageProductsService } from "../../services/webPageProducts.service";
import { Header } from "../layout/header/header.component";
import { ProductsComponent } from "../home/components/products/products.component";

@Component({
  selector: 'app-products-layout',
  standalone: true,
  imports: [CommonModule, Header, ProductsComponent],
  templateUrl: './products.component.html',
})

export class ProductsLayoutComponent {
  productService = inject(WebPageProductsService).productsSignal;
}