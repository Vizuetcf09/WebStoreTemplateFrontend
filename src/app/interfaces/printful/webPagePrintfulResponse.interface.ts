export interface WebPagePrintfulResponseInterface {
    id: number;
    external_id: string;
    name: string;
    variants: number;
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
    syncStatus?: 'synced' | 'not_synced' | 'local-deleted';
    localProductId?: string | null;
    localPrice?: number | null;
    localCostPrice?: number | null;
}

export interface WebPagePrintfulApiWrapper {
    success: boolean;
    data: WebPagePrintfulResponseInterface[];
}
