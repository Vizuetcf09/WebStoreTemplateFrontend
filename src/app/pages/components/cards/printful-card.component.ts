import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { PrintfulProductInterface } from "../../../interfaces/printful/printful.interfaces";

@Component({
    selector: 'PrintfulCard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './printful-card.component.html',
})
export class PrintfulCard {
    product = input.required<PrintfulProductInterface>();
}