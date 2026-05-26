import { apiClient } from './api';
import type { Alert, AlertSeverity } from '@/types/inventory.types';

interface ApiAlert {
  id:         string;
  severity:   AlertSeverity;
  type:       'low_stock';
  message:    string;
  productId:  string;
  sku:        string;
  name:       string;
  currentQty: number;
  minQty:     number;
  timestamp:  string;
}

export function apiAlertToAlert(a: ApiAlert): Alert {
  return {
    id:               a.id,
    severity:         a.severity,
    type:             a.type,
    message:          a.message,
    skuId:            a.productId,
    sku:              a.sku,
    skuName:          a.name,
    currentQty:       a.currentQty,
    minQty:           a.minQty,
    poId:             null,
    timestamp:        a.timestamp,
    isAcknowledged:   false,
    acknowledgedBy:   null,
    acknowledgedAt:   null,
  };
}

export const alertsApi = {
  getActive() {
    return apiClient.get<ApiAlert[]>('/dashboard/alerts');
  },
};
