import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from "./components/hero/hero.componet";
import { WebPageProductsService } from "../../services/webPageProducts.service";
import { Products } from './components/products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, Products],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  productService = inject(WebPageProductsService).productsSignal;
}
