export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  status: ProductStatus;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  reorderAt: number;
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'category' | 'createdAt' | 'updatedAt'>;
export type UpdateProductInput = Partial<CreateProductInput>;
