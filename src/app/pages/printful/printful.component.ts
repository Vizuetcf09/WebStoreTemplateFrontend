import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { WebPagePrintfulService } from "../../services/webPagePrintful.service";
import { Header } from "../layout/header/header.component";
import { PrintfulProductsComponent } from "../home/components/printful-products/printful-products.component";

@Component({
  selector: 'app-printful-layout',
  standalone: true,
  imports: [CommonModule, Header, PrintfulProductsComponent],
  templateUrl: './printful.component.html',
})
export class PrintfulLayoutComponent {
  printfulService = inject(WebPagePrintfulService).printfulProductsSignal;
}