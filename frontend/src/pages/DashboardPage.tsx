import { useState, useEffect } from 'react';
import {
  AlertTriangle, Package, TrendingDown,
  Inbox, SendHorizonal, DollarSign,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useAlertsStore } from '@/store/alerts.store';
import { dashboardApi, type DashboardStats } from '@/services/dashboard.service';
import { formatCurrency } from '@/lib/formatters';
import { KPICard } from '@/components/features/dashboard/KPICard';
import { SkeletonKPICard, Skeleton } from '@/components/SkeletonLoader';
import { AlertsPanel } from '@/components/features/dashboard/AlertsPanel';
import { InboundPanel } from '@/components/features/dashboard/InboundPanel';
import { MovementsPanel } from '@/components/features/dashboard/MovementsPanel';
import { LowStockPanel } from '@/components/features/dashboard/LowStockPanel';

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-stroke bg-surface-card px-3 py-2 shadow-lg text-xs">
      <p className="text-ink-muted mb-0.5">{label}</p>
      <p className="tabular-nums font-semibold text-status-ok">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function DashboardPage() {
  const criticalAlerts = useAlertsStore(
    (s) => s.alerts.filter((a) => a.severity === 'critical' && !a.isAcknowledged).length
  );

  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [statsLoading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const lowCriticalCount = (stats?.criticalCount ?? 0) + (stats?.lowCount ?? 0);

  return (
    <div className="flex flex-col gap-6">

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonKPICard key={i} />)
        ) : (
          <>
            <KPICard
              label="Critical Alerts"
              value={criticalAlerts}
              subtext="Unacknowledged — require action"
              severity={criticalAlerts > 0 ? 'critical' : 'ok'}
              icon={AlertTriangle}
            />
            <KPICard
              label="Low / Critical Stock"
              value={lowCriticalCount}
              subtext="SKUs below reorder threshold"
              severity={lowCriticalCount > 6 ? 'critical' : lowCriticalCount > 2 ? 'warning' : 'ok'}
              icon={Package}
            />
            <KPICard
              label="Stock Value"
              value={formatCurrency(stats?.totalStockValue ?? 0)}
              subtext="Current on-hand cost value"
              severity="neutral"
              icon={DollarSign}
            />
            <KPICard
              label="Pending Inbound"
              value={stats?.inboundToday ?? 0}
              subtext="POs due today awaiting receipt"
              severity="neutral"
              icon={Inbox}
            />
            <KPICard
              label="Outbound Today"
              value={stats?.outboundToday ?? 0}
              subtext="Issue movements recorded today"
              severity="neutral"
              icon={SendHorizonal}
            />
            <KPICard
              label="Stockout Risk"
              value={stats?.criticalCount ?? 0}
              subtext="SKUs at critical threshold"
              severity={(stats?.criticalCount ?? 0) > 3 ? 'warning' : 'neutral'}
              icon={TrendingDown}
            />
          </>
        )}
      </div>

      {/* Stock value trend chart */}
      <div className="rounded border border-stroke bg-surface-card px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="label-caps text-ink-muted">Daily Inbound Value</p>
            <p className="text-xs text-ink-muted mt-0.5">Value of stock received per day (last 30 days)</p>
          </div>
          {stats && (
            <div className="text-right">
              <p className="text-xs text-ink-muted label-caps">Total Stock Value</p>
              <p className="text-lg font-semibold tabular-nums text-ink mt-0.5">
                {formatCurrency(stats.totalStockValue)}
              </p>
            </div>
          )}
        </div>
        {statsLoading ? (
          <Skeleton className="h-[160px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={stats?.dailyInboundValue ?? []} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false} tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => v === 0 ? '0' : `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone" dataKey="value"
                stroke="#10B981" strokeWidth={2}
                dot={false} activeDot={{ r: 4, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><AlertsPanel /></div>
        <div><InboundPanel /></div>
        <div className="col-span-2"><MovementsPanel /></div>
        <div><LowStockPanel /></div>
      </div>

    </div>
  );
}
