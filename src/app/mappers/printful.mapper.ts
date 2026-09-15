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
      isIgnored: item.is_ignored,
      syncStatus: item.syncStatus ?? 'not_synced',
      localProductId: item.localProductId ?? null,
      localPrice: item.localPrice ?? null,
      localCostPrice: item.localCostPrice ?? null
    };
  }

  static mapPrintfulItemsToProductArray(items: WebPagePrintfulResponseInterface[]): PrintfulProductInterface[] {
    if (!Array.isArray(items)) return [];
    return items.map(item => this.mapPrintfulItemToProduct(item));
  }
}
