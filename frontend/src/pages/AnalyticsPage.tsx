import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend,
} from 'recharts';
import { analyticsApi, type AnalyticsStats } from '@/services/analytics.service';
import { cn } from '@/lib/cn';

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string | number;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded border border-stroke bg-surface-card px-4 py-4">
      <p className="label-caps text-ink-muted">{label}</p>
      <p className={cn('mt-1.5 text-2xl font-semibold tabular-nums', valueClass ?? 'text-ink')}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name?: string; fill?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-stroke bg-surface-card px-3 py-2 shadow-lg">
      {label && <p className="label-caps text-ink-muted mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-xs tabular-nums" style={{ color: p.fill ?? '#E5E7EB' }}>
          {p.name ? `${p.name}: ` : ''}{p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AnalyticsPage() {
  const [stats,   setStats]   = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sc = stats?.stockStatusCounts;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading">Analytics</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Inventory health, movement trends, and order status.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Total SKUs"
          value={loading ? '…' : stats!.totalSKUs}
          sub={loading ? '' : `${stats!.categoryBreakdown.length} categories`}
        />
        <KpiCard
          label="Critical / Low"
          value={loading ? '…' : `${sc!.critical} / ${sc!.low}`}
          sub="items need attention"
          valueClass={!loading && sc!.critical > 0 ? 'text-status-error' : 'text-status-warning'}
        />
        <KpiCard
          label="Open POs"
          value={loading ? '…' : stats!.openPOs}
          sub={loading ? '' : stats!.overduePOs > 0 ? `${stats!.overduePOs} overdue` : 'All on schedule'}
          valueClass={!loading && stats!.overduePOs > 0 ? 'text-status-warning' : 'text-ink'}
        />
        <KpiCard
          label="Total Movements"
          value={loading ? '…' : stats!.totalMovements}
          sub="in activity log"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Daily movements line chart */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">Daily Movements (last 30 days)</p>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-ink-muted">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats!.dailyMovements} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4A7FA7"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#4A7FA7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* SKUs by category bar chart */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">SKUs by Category</p>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-ink-muted">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats!.categoryBreakdown} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} fill="#4A7FA7" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Movement type pie */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">Movement Breakdown (last 30 days)</p>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-ink-muted">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats!.movementTypeBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {stats!.movementTypeBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: '#9CA3AF', fontSize: 11 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stock status distribution */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">Stock Status Distribution</p>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-ink-muted">Loading…</div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              {(
                [
                  ['OK',        sc!.ok,        'bg-status-ok',      'text-status-ok'      ],
                  ['Low',       sc!.low,        'bg-status-warning', 'text-status-warning' ],
                  ['Critical',  sc!.critical,   'bg-status-error',   'text-status-error'   ],
                  ['Overstock', sc!.overstock,  'bg-accent-gold',    'text-accent-gold'    ],
                ] as [string, number, string, string][]
              ).map(([label, count, barCls, textCls]) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink-muted">{label}</span>
                    <span className={cn('text-xs font-semibold tabular-nums', textCls)}>
                      {count} SKU{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-hover">
                    <div
                      className={cn('h-1.5 rounded-full', barCls)}
                      style={{ width: `${stats!.totalSKUs > 0 ? (count / stats!.totalSKUs) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top SKUs by velocity */}
      <div className="rounded border border-stroke bg-surface-card">
        <div className="border-b border-stroke bg-surface-sidebar px-5 py-2">
          <span className="label-caps">Top SKUs by Movement Volume (all time)</span>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-center text-sm text-ink-muted">Loading…</div>
        ) : stats!.topSKUs.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-ink-muted">No movements recorded yet.</div>
        ) : (
          <div className="divide-y divide-stroke">
            {stats!.topSKUs.map((item, idx) => {
              const max = stats!.topSKUs[0]?.count ?? 1;
              return (
                <div key={item.sku} className={cn('flex items-center gap-4 px-5 py-3', idx % 2 === 1 ? 'bg-surface-hover/20' : '')}>
                  <span className="w-6 text-xs text-ink-muted tabular-nums text-right">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="sku text-xs">{item.sku}</span>
                      <span className="text-xs text-ink-muted truncate">{item.name}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-surface-hover">
                      <div
                        className="h-1 rounded-full bg-accent-blue"
                        style={{ width: `${(item.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-ink w-16 text-right">
                    {item.count} moves
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
