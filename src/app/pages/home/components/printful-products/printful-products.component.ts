import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { PrintfulProductInterface } from "../../../../interfaces/printful/printful.interfaces";
import { PrintfulCard } from "../../../components/cards/printful-card.component";

@Component({
    selector: 'PrintfulProducts-component',
    standalone: true,
    imports: [CommonModule, PrintfulCard],
    templateUrl: 'printful-products.component.html'
})
export class PrintfulProductsComponent {
    @Input() products: PrintfulProductInterface[] = [];
}