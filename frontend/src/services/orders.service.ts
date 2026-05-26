import { apiClient } from './api';

export interface ApiPOLine {
  id:          string;
  sku:         string;
  productName: string | null;
  orderedQty:  number;
  receivedQty: number;
  unitCost:    number;
}

export interface ApiPurchaseOrder {
  id:               string;
  supplierName:     string;
  status:           'draft' | 'confirmed' | 'partial' | 'received';
  expectedDelivery: string;
  createdAt:        string;
  totalValue:       number;
  lines:            ApiPOLine[];
}

export interface OrdersResponse {
  data:       ApiPurchaseOrder[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

interface ListParams {
  status?: string;
  page?:   number;
  limit?:  number;
}

interface ReceiveLine {
  lineId:    string;
  actualQty: number;
  note?:     string;
}

export const ordersApi = {
  list(params?: ListParams) {
    return apiClient.get<OrdersResponse>('/orders', { params });
  },
  get(id: string) {
    return apiClient.get<ApiPurchaseOrder>(`/orders/${id}`);
  },
  receive(id: string, lines: ReceiveLine[]) {
    return apiClient.patch<ApiPurchaseOrder>(`/orders/${id}/receive`, { lines });
  },
};
