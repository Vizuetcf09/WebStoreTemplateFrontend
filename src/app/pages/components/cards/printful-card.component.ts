import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { PrintfulProductInterface } from "../../../interfaces/printful/printful.interfaces";

@Component({
    selector: 'PrintfulCard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './printful-card.component.html',
    host: {
        class: 'h-full flex flex-col'
    }
})
export class PrintfulCard {
    product = input.required<PrintfulProductInterface>();
}