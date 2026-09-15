import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductInterface } from '../interfaces/products/products.interfaces';
import { environment } from '../../environments/environment';
import { ProductMapper } from '../mappers/product.mapper';
import {
  WebPageProductsManageResponse,
  WebPageProductsResponseInterface
} from '../interfaces/products/webPageProductsRespoonse.interface';

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  images?: string[];
  status?: 'active' | 'inactive';
  costPrice?: number;
}

export interface ManagedProductsResult {
  items: ProductInterface[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  categories: string[];
}

@Injectable({ providedIn: 'root' })
export class WebPageProductsService {

  private http = inject(HttpClient);
  private webPageProductsUrl = environment.webPageProductsUrl;

  productsSignal = signal<ProductInterface[]>([]);
  loadingProductSignal = signal(true);

  constructor() {
    this.loadWebPageProducts();
  }

  loadWebPageProducts() {
    this.loadingProductSignal.set(true);
    this.http
      .get<WebPageProductsResponseInterface[]>(`${this.webPageProductsUrl}`)
      .subscribe({
        next: (resp) => {
          const products = Array.isArray(resp)
            ? ProductMapper.mapProductsItemsToProductArray(resp)
            : [];
          this.productsSignal.set(products);
          this.loadingProductSignal.set(false);
        },
        error: (err) => {
          console.error('Error cargando productos de Web Page:', err);
          this.productsSignal.set([]);
          this.loadingProductSignal.set(false);
        }
      });
  }

  getManagedProducts(filters: {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return firstValueFrom(
      this.http.get<WebPageProductsManageResponse>(`${this.webPageProductsUrl}/manage`, { params })
    ).then((resp) => ({
      items: ProductMapper.mapProductsItemsToProductArray(resp.items || []),
      total: resp.total,
      page: resp.page,
      limit: resp.limit,
      pages: resp.pages,
      categories: resp.categories || []
    } satisfies ManagedProductsResult));
  }

  createProduct(payload: ProductPayload) {
    return firstValueFrom(
      this.http.post<{ success: boolean; data: WebPageProductsResponseInterface }>(
        this.webPageProductsUrl,
        payload
      )
    );
  }

  updateProduct(id: string, payload: Partial<ProductPayload>) {
    return firstValueFrom(
      this.http.put<{ success: boolean; data: WebPageProductsResponseInterface }>(
        `${this.webPageProductsUrl}/${id}`,
        payload
      )
    );
  }

  deleteProduct(id: string, hard = false) {
    const params = hard ? new HttpParams().set('hard', 'true') : undefined;
    return firstValueFrom(
      this.http.delete<{ success: boolean; message: string }>(
        `${this.webPageProductsUrl}/${id}`,
        { params }
      )
    );
  }
}
