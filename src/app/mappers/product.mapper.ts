import { WebPageProductsResponseInterface } from "../interfaces/products/webPageProductsRespoonse.interface";
import { ProductInterface } from "../interfaces/products/products.interfaces";

export class ProductMapper {

  static mapProductsItemsToProduct(item: WebPageProductsResponseInterface): ProductInterface {
    return {
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price, // TODO : cambiar a string en db
      category: item.category,
      stock: item.stock,
      imageUrl: item.imageUrl,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    };
  }

  static mapProductsItemsToProductArray(items: WebPageProductsResponseInterface[]): ProductInterface[] {
    return items.map(this.mapProductsItemsToProduct);
  }

}