import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { productsApi, type ApiProduct } from '@/services/products.service';
import { StatusBadge } from '@/components/features/inventory/StatusBadge';
import { cn } from '@/lib/cn';

export function LowStockPanel() {
  const [items, setItems]     = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.list({ status: 'critical', limit: 10 }),
      productsApi.list({ status: 'low',      limit: 10 }),
    ])
      .then(([critRes, lowRes]) => {
        const combined = [...critRes.data.data, ...lowRes.data.data]
          .sort((a, b) => {
            if (a.status === 'critical' && b.status !== 'critical') return -1;
            if (b.status === 'critical' && a.status !== 'critical') return 1;
            return a.currentQty / a.minQty - b.currentQty / b.minQty;
          });
        setItems(combined);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded border border-stroke bg-surface-card flex flex-col">
      <div className="flex items-center justify-between border-b border-stroke px-4 py-3 shrink-0">
        <span className="label-caps">Low Stock Items</span>
        <NavLink to="/inventory?status=critical" className="text-xs text-accent-blue hover:underline transition-colors">
          View all
        </NavLink>
      </div>

      {loading ? (
        <div className="px-4 py-5 text-sm text-ink-muted">Loading…</div>
      ) : items.length === 0 ? (
        <div className="px-4 py-5 text-sm text-ink-muted">All stock levels OK.</div>
      ) : (
        <div className="divide-y divide-stroke overflow-y-auto">
          {items.map((item) => {
            const pct = Math.round((item.currentQty / item.minQty) * 100);
            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 transition-colors duration-fast hover:bg-surface-hover',
                  item.status === 'critical' ? 'bg-status-error/[0.06]' : 'bg-status-warning/[0.04]'
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="sku">{item.sku}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">{item.name}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="tabular-nums text-sm font-medium text-ink">
                    {item.currentQty}
                    <span className="text-ink-muted">/{item.minQty}</span>
                    <span className="ml-1 text-xs text-ink-muted">{item.unit}</span>
                  </p>
                  <p className="text-2xs text-ink-muted">{pct}% of min</p>
                </div>

                <button
                  className="shrink-0 text-ink-muted hover:text-accent-blue transition-colors duration-fast"
                  title="Create Purchase Order"
                  aria-label="Create purchase order for this item"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
