import { describe, expect, it } from 'vitest';
import { ProductMapper } from './product.mapper';
import { WebPageProductsResponseInterface } from '../interfaces/products/webPageProductsRespoonse.interface';

describe('ProductMapper', () => {
  it('mapea un producto local con campos de inventario', () => {
    const item = {
      _id: 'abc123',
      name: 'Hoodie',
      description: 'Algodón',
      price: 29.5,
      costPrice: 12,
      category: 'Ropa',
      stock: 8,
      imageUrl: 'https://cdn.example/hoodie.jpg',
      images: ['https://cdn.example/hoodie.jpg'],
      status: 'active',
      source: 'local',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-02'),
      __v: 0
    } as WebPageProductsResponseInterface;

    const product = ProductMapper.mapProductsItemsToProduct(item);

    expect(product.id).toBe('abc123');
    expect(product.price).toBe(29.5);
    expect(product.costPrice).toBe(12);
    expect(product.status).toBe('active');
    expect(product.images).toEqual(['https://cdn.example/hoodie.jpg']);
  });
});
