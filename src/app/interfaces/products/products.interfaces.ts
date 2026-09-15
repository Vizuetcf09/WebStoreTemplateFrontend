export type ProductStatus = 'active' | 'inactive' | 'deleted';
export type ProductSource = 'local' | 'printful';

export interface ProductVariantInterface {
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

export interface ProductInterface {
    id: string;
    name: string;
    description: string;
    price: number;
    costPrice?: number;
    category: string;
    stock: number;
    imageUrl: string;
    images?: string[];
    status?: ProductStatus;
    source?: ProductSource;
    printfulId?: number;
    variants?: ProductVariantInterface[];
    createdAt: Date;
    updatedAt: Date;
}
