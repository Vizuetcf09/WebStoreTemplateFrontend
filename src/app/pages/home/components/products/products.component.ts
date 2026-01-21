import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ProductInterface } from "../../../../interfaces/products/products.interfaces";
import { Card } from "../../../components/cards/card.component";

@Component({
  selector: 'Products-component',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: 'products.component.html'
})
export class ProductsComponent {
  @Input() products: ProductInterface[] = [];
}