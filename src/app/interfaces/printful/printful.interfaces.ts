export type PrintfulSyncStatus = 'synced' | 'not_synced' | 'local-deleted';

export interface PrintfulProductInterface {
    id: number;
    externalId: string;
    name: string;
    variantsCount: number;
    syncedCount: number;
    thumbnailUrl: string;
    isIgnored: boolean;
    syncStatus?: PrintfulSyncStatus;
    localProductId?: string | null;
    localPrice?: number | null;
    localCostPrice?: number | null;
}

export interface PrintfulVariantInterface {
    id: number;
    name: string;
    retailPrice: number;
    costPrice?: number;
    salePrice?: number;
    color?: string;
    size?: string;
    previewUrl?: string;
    isIgnored?: boolean;
}
