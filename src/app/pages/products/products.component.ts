import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { WebPageService } from "../../services/webPage.service";
import { Header } from "../layout/header/header.component";
import { Products } from "../home/components/products/products.component";

@Component({
  selector: 'app-products-layout',
  standalone: true,
  imports: [CommonModule, Header, Products],
  templateUrl: './products.component.html',
})

export class ProductsComponent {
  productService = inject(WebPageService).productsSignal;
}