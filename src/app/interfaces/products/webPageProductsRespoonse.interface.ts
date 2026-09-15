export interface WebPageProductVariantResponse {
    variantId: number;
    externalId?: string;
    name?: string;
    size?: string;
    color?: string;
    price: number;
    costPrice?: number;
    inStock: boolean;
    previewUrl?: string;
}

export interface WebPageProductsResponseInterface {
    _id: string;
    name: string;
    description: string;
    price: number;
    costPrice?: number;
    category: string;
    stock: number;
    imageUrl: string;
    images?: string[];
    status?: 'active' | 'inactive' | 'deleted';
    source?: 'local' | 'printful';
    printfulId?: number;
    variants?: WebPageProductVariantResponse[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface WebPageProductsManageResponse {
    success: boolean;
    items: WebPageProductsResponseInterface[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    categories: string[];
}
