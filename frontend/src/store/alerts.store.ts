import { create } from 'zustand';
import type { Alert } from '@/types/inventory.types';
import { alertsApi, apiAlertToAlert } from '@/services/alerts.service';

interface AlertsState {
  alerts:   Alert[];
  hydrated: boolean;
  hydrate:  () => Promise<void>;
  acknowledge: (id: string, operatorId: string) => void;
  unacknowledgedCount: () => number;
  topCritical: () => Alert | null;
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts:   [],
  hydrated: false,

  hydrate: async () => {
    try {
      const res = await alertsApi.getActive();
      // Preserve any existing acknowledgments by merging
      const existing = Object.fromEntries(get().alerts.map((a) => [a.id, a]));
      const merged = res.data.map((raw) => {
        const mapped = apiAlertToAlert(raw);
        const prev   = existing[mapped.id];
        return prev?.isAcknowledged ? prev : mapped;
      });
      set({ alerts: merged, hydrated: true });
    } catch {
      // Backend unreachable — keep whatever is in store
      set({ hydrated: true });
    }
  },

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
      unacked.find((a) => a.severity === 'warning')  ??
      unacked[0] ??
      null
    );
  },
}));
