import { effect, inject, Injectable, computed, signal } from '@angular/core';
import { ProductInterface, ProductVariantInterface } from '../interfaces/products/products.interfaces';
import { AuthService } from './auth.service';

export interface CartItem {
    product: ProductInterface;
    quantity: number;
    variant?: ProductVariantInterface;
}

@Injectable({ providedIn: 'root' })
export class CartService {
    private readonly storageKey = 'web-store-cart';
    private readonly auth = inject(AuthService);
    private activeUserId = this.auth.userId();
    items = signal<CartItem[]>(this.loadItems(this.activeUserId));
    totalItems = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
    total = computed(() => this.items().reduce((sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity, 0));

    constructor() {
        effect(() => {
            const userId = this.auth.userId();
            if (userId === this.activeUserId) return;

            this.activeUserId = userId;
            this.items.set(this.loadItems(userId));
        });
    }

    addToCart(product: ProductInterface, quantity: number, variant?: ProductVariantInterface) {
        const key = `${product.id}:${variant?.variantId ?? 'default'}`;
        this.updateItems(items => {
            const existing = items.find(item => `${item.product.id}:${item.variant?.variantId ?? 'default'}` === key);
            if (existing) {
                return items.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...items, { product, quantity, variant }];
        });
    }

    remove(item: CartItem) {
        this.updateItems(items => items.filter(current => current !== item));
    }

    increment(item: CartItem) {
        const stock = item.product.stock;
        this.updateItems(items => items.map(current =>
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

        this.updateItems(items => items.map(current =>
            current === item ? { ...current, quantity: current.quantity - 1 } : current
        ));
    }

    private updateItems(update: (items: CartItem[]) => CartItem[]) {
        this.syncUserItems();
        this.items.update(items => {
            const updatedItems = update(items);
            this.saveItems(updatedItems);
            return updatedItems;
        });
    }

    private syncUserItems() {
        const userId = this.auth.userId();
        if (userId === this.activeUserId) return;

        this.activeUserId = userId;
        this.items.set(this.loadItems(userId));
    }

    private getStorageKey(userId: string | null) {
        return userId ? `${this.storageKey}:${userId}` : this.storageKey;
    }

    private loadItems(userId: string | null): CartItem[] {
        if (typeof localStorage === 'undefined') return [];

        try {
            const storedItems = localStorage.getItem(this.getStorageKey(userId));
            if (!storedItems) return [];

            const parsedItems: unknown = JSON.parse(storedItems);
            return Array.isArray(parsedItems) ? parsedItems as CartItem[] : [];
        } catch {
            return [];
        }
    }

    private saveItems(items: CartItem[]) {
        if (typeof localStorage === 'undefined') return;

        try {
            localStorage.setItem(this.getStorageKey(this.activeUserId), JSON.stringify(items));
        } catch {
        }
    }
}