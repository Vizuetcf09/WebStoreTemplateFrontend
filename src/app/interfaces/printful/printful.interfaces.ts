// Forma limpia que usa el resto de la app (post-mapeo)
export interface PrintfulProductInterface {
    id: number;
    externalId: string;
    name: string;
    variantsCount: number;
    syncedCount: number;
    thumbnailUrl: string;
    isIgnored: boolean;
}