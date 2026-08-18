import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { ProductInterface } from "../../../interfaces/products/products.interfaces";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'Card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
  host: {
    class: 'h-full flex flex-col'
  }
})

export class Card {
  product = input.required<ProductInterface>();
  link = input<string | any[]>();
}
