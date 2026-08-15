// Forma cruda tal como la devuelve el endpoint GET /store/products de Printful (via nuestro backend)
export interface WebPagePrintfulResponseInterface {
    id: number;
    external_id: string;
    name: string;
    variants: number;      // cantidad de variantes (no el array)
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
}

// Wrapper que envía nuestro backend: { success, data: [...] }
export interface WebPagePrintfulApiWrapper {
    success: boolean;
    data: WebPagePrintfulResponseInterface[];
}