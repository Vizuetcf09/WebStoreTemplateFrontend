import { WebPagePrintfulResponseInterface } from "../interfaces/printful/webPagePrintfulResponse.interface";
import { PrintfulProductInterface } from "../interfaces/printful/printful.interfaces";

export class PrintfulMapper {
  static mapPrintfulItemToProduct(item: WebPagePrintfulResponseInterface): PrintfulProductInterface {
    return {
      id: item.id,
      externalId: item.external_id,
      name: item.name,
      variantsCount: item.variants,
      syncedCount: item.synced,
      thumbnailUrl: item.thumbnail_url,
      isIgnored: item.is_ignored
    };
  }

  static mapPrintfulItemsToProductArray(items: WebPagePrintfulResponseInterface[]): PrintfulProductInterface[] {
    return items.map(this.mapPrintfulItemToProduct);
  }
}