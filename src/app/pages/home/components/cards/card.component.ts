import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { ProductInterface } from "../../../../interfaces/products/products.interfaces";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'Card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
})

export class Card {
  product = input.required<ProductInterface>();
}
