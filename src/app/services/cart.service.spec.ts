import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ProductInterface } from '../interfaces/products/products.interfaces';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

describe('CartService', () => {
    const userId = signal<string | null>('alice');
    let cart: CartService;

    const product: ProductInterface = {
        id: 'book-1',
        name: 'Book',
        description: '',
        price: 10,
        category: 'Books',
        stock: 5,
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        localStorage.clear();
        userId.set('alice');
        TestBed.configureTestingModule({
            providers: [
                CartService,
                { provide: AuthService, useValue: { userId } },
            ],
        });
        cart = TestBed.inject(CartService);
    });

    it('loads and saves a separate cart for each user', () => {
        cart.addToCart(product, 1);
        expect(localStorage.getItem('web-store-cart:alice')).toContain('book-1');

        userId.set('bob');
        TestBed.tick();
        expect(cart.items()).toEqual([]);

        cart.addToCart(product, 2);
        expect(localStorage.getItem('web-store-cart:bob')).toContain('book-1');

        userId.set('alice');
        TestBed.tick();
        expect(cart.items()[0].quantity).toBe(1);
    });
});