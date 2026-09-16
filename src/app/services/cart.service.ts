import { Injectable, computed, signal } from '@angular/core';
import { ProductInterface, ProductVariantInterface } from '../interfaces/products/products.interfaces';

export interface CartItem {
    product: ProductInterface;
    quantity: number;
    variant?: ProductVariantInterface;
}

@Injectable({ providedIn: 'root' })
export class CartService {
    items = signal<CartItem[]>([]);
    totalItems = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
    total = computed(() => this.items().reduce((sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity, 0));

    addToCart(product: ProductInterface, quantity: number, variant?: ProductVariantInterface) {
        const key = `${product.id}:${variant?.variantId ?? 'default'}`;
        this.items.update(items => {
            const existing = items.find(item => `${item.product.id}:${item.variant?.variantId ?? 'default'}` === key);
            if (existing) {
                return items.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...items, { product, quantity, variant }];
        });
    }

    remove(item: CartItem) {
        this.items.update(items => items.filter(current => current !== item));
    }

    increment(item: CartItem) {
        const stock = item.product.stock;
        this.items.update(items => items.map(current =>
            current === item && current.quantity < stock
                ? { ...current, quantity: current.quantity + 1 }
                : current
        ));
    }

    decrement(item: CartItem) {
        if (item.quantity <= 1) {
            this.remove(item);
            return;
        }

        this.items.update(items => items.map(current =>
            current === item ? { ...current, quantity: current.quantity - 1 } : current
        ));
    }
}