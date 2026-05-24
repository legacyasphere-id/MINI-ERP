import { create } from 'zustand';
import type { Alert } from '@/types/inventory.types';
import { ALERTS } from '@/lib/mock-data';

interface AlertsState {
  alerts: Alert[];
  acknowledge: (id: string, operatorId: string) => void;
  unacknowledgedCount: () => number;
  topCritical: () => Alert | null;
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: ALERTS,

  acknowledge: (id, operatorId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? { ...a, isAcknowledged: true, acknowledgedBy: operatorId, acknowledgedAt: new Date().toISOString() }
          : a
      ),
    })),

  unacknowledgedCount: () =>
    get().alerts.filter((a) => !a.isAcknowledged).length,

  topCritical: () => {
    const unacked = get().alerts.filter((a) => !a.isAcknowledged);
    return (
      unacked.find((a) => a.severity === 'critical') ??
      unacked.find((a) => a.severity === 'warning') ??
      unacked[0] ??
      null
    );
  },
}));
