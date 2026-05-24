import {
  AlertTriangle,
  Package,
  TrendingDown,
  Inbox,
  SendHorizonal,
  Warehouse,
} from 'lucide-react';
import { STOCK_ITEMS, PURCHASE_ORDERS, MOVEMENTS } from '@/lib/mock-data';
import { isDueToday } from '@/lib/dates';
import { useAlertsStore } from '@/store/alerts.store';
import { KPICard } from '@/components/features/dashboard/KPICard';
import { AlertsPanel } from '@/components/features/dashboard/AlertsPanel';
import { InboundPanel } from '@/components/features/dashboard/InboundPanel';
import { MovementsPanel } from '@/components/features/dashboard/MovementsPanel';
import { LowStockPanel } from '@/components/features/dashboard/LowStockPanel';

// Static metrics (mock data never changes at runtime)
const lowStockCount   = STOCK_ITEMS.filter((i) => i.status === 'critical' || i.status === 'low').length;
const inboundToday    = PURCHASE_ORDERS.filter((po) => isDueToday(po.expectedDelivery) && ['confirmed', 'partial', 'sent'].includes(po.status)).length;
const outboundToday   = MOVEMENTS.filter((m) => m.type === 'issue' && isDueToday(m.timestamp)).length;
const stockoutRisk    = STOCK_ITEMS.filter((i) => i.currentQty < i.minQty * 0.6).length;
const totalCurrent    = STOCK_ITEMS.reduce((s, i) => s + i.currentQty, 0);
const totalMax        = STOCK_ITEMS.reduce((s, i) => s + i.maxQty, 0);
const capacityPct     = Math.round((totalCurrent / totalMax) * 100);

export function DashboardPage() {
  // Reactive — updates when alerts are acknowledged
  const criticalAlerts = useAlertsStore(
    (s) => s.alerts.filter((a) => a.severity === 'critical' && !a.isAcknowledged).length
  );

  return (
    <div className="flex flex-col gap-6">

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <KPICard
          label="Critical Alerts"
          value={criticalAlerts}
          subtext="Unacknowledged — require action"
          severity={criticalAlerts > 0 ? 'critical' : 'ok'}
          icon={AlertTriangle}
        />
        <KPICard
          label="Low / Critical Stock"
          value={lowStockCount}
          subtext="SKUs below reorder threshold"
          severity={lowStockCount > 6 ? 'critical' : lowStockCount > 2 ? 'warning' : 'ok'}
          icon={Package}
        />
        <KPICard
          label="Pending Inbound"
          value={inboundToday}
          subtext="POs arriving or due today"
          severity="neutral"
          icon={Inbox}
        />
        <KPICard
          label="Outbound Today"
          value={outboundToday}
          subtext="Issue movements recorded"
          severity="neutral"
          icon={SendHorizonal}
        />
        <KPICard
          label="Stockout Risk"
          value={stockoutRisk}
          subtext="SKUs at risk within 7 days"
          severity={stockoutRisk > 3 ? 'warning' : 'neutral'}
          icon={TrendingDown}
        />
        <KPICard
          label="Warehouse Capacity"
          value={`${capacityPct}%`}
          subtext={`${totalCurrent.toLocaleString()} of ${totalMax.toLocaleString()} units`}
          severity={capacityPct > 90 ? 'warning' : 'neutral'}
          icon={Warehouse}
        />
      </div>

      {/* Panels — 3-col grid, wide left + narrow right */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <AlertsPanel />
        </div>
        <div>
          <InboundPanel />
        </div>
        <div className="col-span-2">
          <MovementsPanel />
        </div>
        <div>
          <LowStockPanel />
        </div>
      </div>

    </div>
  );
}
