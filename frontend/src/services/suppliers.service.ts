import { apiClient } from './api';

export interface ApiSupplier {
  id:               string;
  name:             string;
  leadTimeDays:     number;
  reliabilityScore: number;
  activeOrders:     number;
  lastDelivery:     string | null;
}

export const suppliersApi = {
  list() {
    return apiClient.get<ApiSupplier[]>('/suppliers');
  },
};
