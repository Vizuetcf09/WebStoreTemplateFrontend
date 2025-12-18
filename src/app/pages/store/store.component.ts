import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { WebPageService } from "../../services/webPage.service";
import { Header } from "../layout/header/header.component";

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './store.component.html',
})
export class StoreComponent {
  private products = inject(WebPageService).productsSignal;

  // Static fallback so the cart looks complete even if the API has not loaded yet
  private readonly defaultProduct = {
    name: 'Lunar',
    description: 'We take pride in every bean we brew. Our coffee is carefully selected from the best coffee-growing regions around the world. Each batch is roasted in-house to highlight its unique flavors and characteristics.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    subtitle: 'Ground coffee, light roast',
  };

  featuredProduct = computed(() => {
    const [product] = this.products();
    return product ?? this.defaultProduct;
  });

  features = [
    { icon: '🚚', label: 'Same day delivery' },
    { icon: '☕', label: 'Quality checked' },
  ];
}