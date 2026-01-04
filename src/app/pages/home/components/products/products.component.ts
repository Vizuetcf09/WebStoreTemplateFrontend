import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Card } from "../cards/card.component";
import { ProductInterface } from "../../../../interfaces/products.interfaces";

@Component({
  selector: 'Products-component',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: 'products.component.html'
})
export class ProductsComponent {
  @Input() products: ProductInterface[] = [];
}