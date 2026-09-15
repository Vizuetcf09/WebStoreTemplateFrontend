import { WebPageProductsResponseInterface } from "../interfaces/products/webPageProductsRespoonse.interface";
import { ProductInterface } from "../interfaces/products/products.interfaces";

export class ProductMapper {

  static mapProductsItemsToProduct(item: WebPageProductsResponseInterface): ProductInterface {
    return {
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      costPrice: item.costPrice ?? 0,
      category: item.category,
      stock: item.stock,
      imageUrl: item.imageUrl,
      images: item.images?.length ? item.images : item.imageUrl ? [item.imageUrl] : [],
      status: item.status ?? 'active',
      source: item.source ?? (item.printfulId ? 'printful' : 'local'),
      printfulId: item.printfulId,
      variants: item.variants ?? [],
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
    };
  }

  static mapProductsItemsToProductArray(items: WebPageProductsResponseInterface[]): ProductInterface[] {
    if (!Array.isArray(items)) return [];
    return items.map(item => this.mapProductsItemsToProduct(item));
  }
}
