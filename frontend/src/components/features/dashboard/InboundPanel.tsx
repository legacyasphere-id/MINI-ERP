import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ordersApi, type ApiPurchaseOrder } from '@/services/orders.service';
import { isDueToday, fmtTime, fmtShortDate } from '@/lib/dates';
import { cn } from '@/lib/cn';
import type { POStatus } from '@/types/inventory.types';

const STATUS_STYLE: Record<POStatus, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'text-ink-muted' },
  sent:      { label: 'Sent',      cls: 'text-ink-dim' },
  confirmed: { label: 'Confirmed', cls: 'text-status-ok' },
  partial:   { label: 'Partial',   cls: 'text-status-warning' },
  received:  { label: 'Received',  cls: 'text-status-ok' },
};

export function InboundPanel() {
  const [orders,  setOrders]  = useState<ApiPurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.list({ limit: 20 })
      .then((res) => {
        const active = res.data.data
          .filter((po) => ['confirmed', 'partial', 'sent'].includes(po.status))
          .sort((a, b) => {
            const aToday = isDueToday(a.expectedDelivery) ? 0 : 1;
            const bToday = isDueToday(b.expectedDelivery) ? 0 : 1;
            return aToday - bToday || a.expectedDelivery.localeCompare(b.expectedDelivery);
          })
          .slice(0, 7);
        setOrders(active);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded border border-stroke bg-surface-card flex flex-col">
      <div className="flex items-center justify-between border-b border-stroke px-4 py-3 shrink-0">
        <span className="label-caps">Inbound / PO Status</span>
        <NavLink to="/orders" className="text-xs text-accent-blue hover:underline transition-colors">
          View all
        </NavLink>
      </div>

      {loading ? (
        <p className="px-4 py-5 text-sm text-ink-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="px-4 py-5 text-sm text-ink-muted">No pending inbound orders.</p>
      ) : (
        <div className="divide-y divide-stroke overflow-y-auto">
          {orders.map((po) => {
            const { label, cls } = STATUS_STYLE[po.status];
            const today = isDueToday(po.expectedDelivery);

            return (
              <div key={po.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors duration-fast">
                <Truck className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="sku">{po.id.toUpperCase()}</span>
                    <span className={cn('text-2xs font-semibold', cls)}>{label}</span>
                    {today && (
                      <span className="text-2xs font-semibold text-accent-gold">TODAY</span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {po.supplierName} · {po.lines.length} SKU{po.lines.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-ink-dim">
                  {today ? fmtTime(po.expectedDelivery) : fmtShortDate(po.expectedDelivery)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
