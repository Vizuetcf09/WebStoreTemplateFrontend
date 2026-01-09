export interface ProductInterface {
    id: string;
    name: string;
    description: string;
    price: number; // TODO: cambiar a string en db
    category: string;
    stock: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
} 