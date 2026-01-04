import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from "./components/hero/hero.componet";
import { WebPageProductsService } from "../../services/webPageProducts.service";
import { ProductsComponent } from './components/products/products.component';
import { ProductInterface } from '../../interfaces/products.interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, ProductsComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  productService = inject(WebPageProductsService).productsSignal;
}
