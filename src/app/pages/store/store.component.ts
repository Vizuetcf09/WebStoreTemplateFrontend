import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { Router } from '@angular/router';
import { WebPageProductsService } from "../../services/webPageProducts.service";
import { Header } from "../layout/header/header.component";
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-store-page',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './store.component.html',
})
export default class StoreComponent {
  id = input.required<string>();

  private webPageService = inject(WebPageProductsService);
  private router = inject(Router);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  private initializedProductId: string | null = null;

  constructor() {
    effect(() => {
      const currentProduct = this.product();
      if (currentProduct && currentProduct.id !== this.initializedProductId) {
        this.initializedProductId = currentProduct.id;
        const firstVariant = currentProduct.variants?.[0];
        if (firstVariant) {
          this.selectColor(firstVariant.color || 'Único');
        }
      }
      if (currentProduct) {
        queueMicrotask(() => window.scrollTo({ top: 0, behavior: 'auto' }));
      }
    });
  }

  product = computed(() => {
    const allProducts = this.webPageService.productsSignal();
    const currentId = this.id();
    return allProducts.find(product => product.id === currentId);
  });

  selectedColor = signal<string | null>(null);
  selectedSize = signal<string | null>(null);
  quantity = signal(1);

  variants = computed(() => this.product()?.variants ?? []);
  colorOptions = computed(() => Array.from(new Set(
    this.variants().map(variant => variant.color || 'Único')
  )));
  sizeOptions = computed(() => {
    return Array.from(new Set(
      this.variants()
        .map(variant => variant.size || 'Única')
    ));
  });
  selectedVariant = computed(() =>
    this.variants().find(variant =>
      (variant.color || 'Único') === this.selectedColor() &&
      (variant.size || 'Única') === this.selectedSize()
    )
  );
  activeImage = computed(() => this.selectedVariant()?.previewUrl || this.product()?.imageUrl || '');
  activePrice = computed(() => this.selectedVariant()?.price ?? this.product()?.price ?? 0);
  previousProduct = computed(() => {
    const products = this.webPageService.productsSignal();
    const index = products.findIndex(item => item.id === this.id());
    return index > 0 ? products[index - 1] : undefined;
  });
  nextProduct = computed(() => {
    const products = this.webPageService.productsSignal();
    const index = products.findIndex(item => item.id === this.id());
    return index >= 0 ? products[index + 1] : undefined;
  });

  selectColor(color: string) {
    this.selectedColor.set(color);
    this.quantity.set(1);
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
    this.quantity.set(1);
  }

  isSizeAvailable(size: string) {
    return this.variants().some(variant =>
      (variant.color || 'Único') === this.selectedColor() &&
      (variant.size || 'Única') === size
    );
  }

  increaseQuantity() {
    const stock = this.product()?.stock ?? 1;
    if (this.quantity() < stock) this.quantity.update(value => value + 1);
  }

  decreaseQuantity() {
    if (this.quantity() > 1) this.quantity.update(value => value - 1);
  }

  addToCart(goToCart = false) {
    const product = this.product();
    if (!product) return;
    this.cart.addToCart(product, this.quantity(), this.selectedVariant());
    this.toast.success(`${product.name} se agregó al carrito`);
    if (goToCart) this.router.navigate(['/carrito']);
  }

  navigateToProduct(productId: string | undefined) {
    if (productId) this.router.navigate(['/products', productId]);
  }
}