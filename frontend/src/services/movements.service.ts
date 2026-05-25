import { apiClient } from './api';
import type { MovementType } from '@/types/inventory.types';

export interface ApiMovement {
  id: string;
  type: MovementType;
  qty: number;
  fromLocation: string | null;
  toLocation: string | null;
  referenceId: string;
  note: string | null;
  timestamp: string;
  operatorId: string | null;
  product: { id: string; sku: string; name: string };
  operator: { id: string; name: string } | null;
}

export interface MovementsResponse {
  data: ApiMovement[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateMovementPayload {
  type: MovementType;
  productId: string;
  qty: number;
  fromLocation?: string | null;
  toLocation?: string | null;
  referenceId?: string;
  note?: string | null;
}

export const movementsApi = {
  list(params?: { productId?: string; limit?: number; offset?: number }) {
    return apiClient.get<MovementsResponse>('/movements', { params });
  },

  create(payload: CreateMovementPayload) {
    return apiClient.post<ApiMovement>('/movements', payload);
  },

  listForProduct(productId: string, params?: { limit?: number; offset?: number }) {
    return apiClient.get<MovementsResponse>(`/products/${productId}/movements`, { params });
  },
};
