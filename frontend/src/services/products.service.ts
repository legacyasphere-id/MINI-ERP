import { apiClient } from './api';
import type { StockStatus } from '@/types/inventory.types';

export interface ApiProduct {
  id:           string;
  sku:          string;
  name:         string;
  currentQty:   number;
  minQty:       number;
  maxQty:       number;
  unit:         string;
  locationZone: string;
  locationRack: string;
  locationBin:  string;
  status:       StockStatus;
  updatedAt:    string;
  category:     { id: string; name: string } | null;
}

export interface ProductsResponse {
  data:       ApiProduct[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface ProductsParams {
  page?:     number;
  limit?:    number;
  search?:   string;
  category?: string;
  status?:   StockStatus | 'all';
  sortKey?:  string;
  sortDir?:  'asc' | 'desc';
}

export const productsApi = {
  list(params?: ProductsParams) {
    const clean = Object.fromEntries(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== 'all' && v !== '')
    );
    return apiClient.get<ProductsResponse>('/products', { params: clean });
  },
};
