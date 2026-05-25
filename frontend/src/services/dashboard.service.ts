import { apiClient } from './api';

export interface DashboardStats {
  totalStockValue:   number;
  criticalCount:     number;
  lowCount:          number;
  dailyInboundValue: { date: string; value: number }[];
}

export const dashboardApi = {
  getStats() {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },
};
