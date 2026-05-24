import { apiClient } from './api';
import type { Product, CreateProductInput, UpdateProductInput } from '@/types/product.types';
import type { PaginatedResponse, PaginationParams } from '@/types/common.types';

export const productsApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Product>>('/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (data: CreateProductInput) =>
    apiClient.post<Product>('/products', data).then((r) => r.data),

  update: (id: string, data: UpdateProductInput) =>
    apiClient.patch<Product>(`/products/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),
};
