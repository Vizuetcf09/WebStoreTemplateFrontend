import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Card } from "../cards/card.component";
import { Product } from "../../../../interfaces/products.interfaces";

@Component({
  selector: 'Products',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './products.component.html'
})
export class Products {
  @Input() products: Product[] = [];
}