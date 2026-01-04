import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ProductInterface } from "../../../interfaces/products.interfaces";

@Component({
  selector: 'Products-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Products.component.html',
})
export class ProductStoreComponet {
  @Input() products: ProductInterface[] = [];
}