import { apiClient } from './api';

export interface AnalyticsStats {
  totalSKUs:         number;
  categoryBreakdown: { name: string; count: number }[];
  stockStatusCounts: { ok: number; low: number; critical: number; overstock: number };
  openPOs:           number;
  overduePOs:        number;
  totalMovements:    number;
  dailyMovements:    { date: string; count: number }[];
  movementTypeBreakdown: { name: string; value: number; fill: string }[];
  topSKUs:           { sku: string; name: string; count: number }[];
}

export const analyticsApi = {
  getStats() {
    return apiClient.get<AnalyticsStats>('/analytics/stats');
  },
};
