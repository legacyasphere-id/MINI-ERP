import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend,
} from 'recharts';
import { format, parseISO, subDays, startOfDay } from 'date-fns';
import { STOCK_ITEMS, MOVEMENTS, PURCHASE_ORDERS } from '@/lib/mock-data';
import { cn } from '@/lib/cn';
import type { StockStatus } from '@/types/inventory.types';

// ─── derived data ─────────────────────────────────────────────────────────────

const STATUS_COUNTS: Record<StockStatus, number> = { ok: 0, low: 0, critical: 0, overstock: 0 };
for (const item of STOCK_ITEMS) STATUS_COUNTS[item.status]++;

const OPEN_POS = PURCHASE_ORDERS.filter(
  (p) => p.status !== 'received' && p.status !== 'draft'
).length;

const OVERDUE_POS = PURCHASE_ORDERS.filter(
  (p) => p.status !== 'received' && p.status !== 'draft' &&
    new Date(p.expectedDelivery) < new Date()
).length;

const TOTAL_MOVEMENTS = MOVEMENTS.length;

// Movements per day (last 7 days from latest entry)
const LATEST_DATE = new Date(
  Math.max(...MOVEMENTS.map((m) => new Date(m.timestamp).getTime()))
);

const DAILY_MOVEMENTS = Array.from({ length: 7 }, (_, i) => {
  const day = startOfDay(subDays(LATEST_DATE, 6 - i));
  const dayStr = format(day, 'yyyy-MM-dd');
  const count = MOVEMENTS.filter(
    (m) => format(parseISO(m.timestamp), 'yyyy-MM-dd') === dayStr
  ).length;
  return { date: format(day, 'MMM d'), count };
});

// Movement type breakdown
const TYPE_COUNTS = MOVEMENTS.reduce(
  (acc, m) => { acc[m.type] = (acc[m.type] ?? 0) + 1; return acc; },
  {} as Record<string, number>
);

const TYPE_PIE = [
  { name: 'Receive',  value: TYPE_COUNTS['receive']  ?? 0, fill: '#10B981' },
  { name: 'Issue',    value: TYPE_COUNTS['issue']    ?? 0, fill: '#9CA3AF' },
  { name: 'Transfer', value: TYPE_COUNTS['transfer'] ?? 0, fill: '#3B82F6' },
  { name: 'Adjust',   value: TYPE_COUNTS['adjust']  ?? 0, fill: '#D6BA73' },
];

// Items by category
const CATEGORY_MAP: Record<string, number> = {};
for (const item of STOCK_ITEMS) {
  CATEGORY_MAP[item.category] = (CATEGORY_MAP[item.category] ?? 0) + 1;
}
const CATEGORY_DATA = Object.entries(CATEGORY_MAP)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

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
          value={STOCK_ITEMS.length}
          sub={`${CATEGORY_DATA.length} categories`}
        />
        <KpiCard
          label="Critical / Low"
          value={`${STATUS_COUNTS.critical} / ${STATUS_COUNTS.low}`}
          sub="items need attention"
          valueClass={STATUS_COUNTS.critical > 0 ? 'text-status-error' : 'text-status-warning'}
        />
        <KpiCard
          label="Open POs"
          value={OPEN_POS}
          sub={OVERDUE_POS > 0 ? `${OVERDUE_POS} overdue` : 'All on schedule'}
          valueClass={OVERDUE_POS > 0 ? 'text-status-warning' : 'text-ink'}
        />
        <KpiCard
          label="Total Movements"
          value={TOTAL_MOVEMENTS}
          sub="in activity log"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Daily movements line chart */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">Daily Movements (last 7 days)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={DAILY_MOVEMENTS} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <XAxis
                dataKey="date"
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4A7FA7"
                strokeWidth={2}
                dot={{ fill: '#4A7FA7', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Items by category bar chart */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">SKUs by Category</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CATEGORY_DATA} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
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
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Movement type pie */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">Movement Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={TYPE_PIE}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                paddingAngle={2}
              >
                {TYPE_PIE.map((entry) => (
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
        </div>

        {/* Stock status summary */}
        <div className="rounded border border-stroke bg-surface-card px-4 py-4">
          <p className="label-caps text-ink-muted mb-4">Stock Status Distribution</p>
          <div className="flex flex-col gap-3 pt-2">
            {(
              [
                ['OK',        STATUS_COUNTS.ok,        'bg-status-ok',      'text-status-ok'      ],
                ['Low',       STATUS_COUNTS.low,        'bg-status-warning', 'text-status-warning' ],
                ['Critical',  STATUS_COUNTS.critical,   'bg-status-error',   'text-status-error'   ],
                ['Overstock', STATUS_COUNTS.overstock,  'bg-accent-gold',    'text-accent-gold'    ],
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
                    style={{ width: `${(count / STOCK_ITEMS.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
