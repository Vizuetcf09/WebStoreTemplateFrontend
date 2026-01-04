import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ProductInterface } from "../../../../interfaces/products.interfaces";

@Component({
  selector: 'Card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
})

export class Card {
  @Input() product!: ProductInterface;
}
