import { apiClient } from './api';

export interface AppSettings {
  warehouseName:    string;
  warehouseCode:    string;
  timezone:         string;
  currency:         string;
  lowStockPct:      number;
  overstockPct:     number;
  movementLogLimit: number;
}

export const settingsApi = {
  get() {
    return apiClient.get<AppSettings>('/settings');
  },
  update(data: Partial<AppSettings>) {
    return apiClient.patch<AppSettings>('/settings', data);
  },
};
