import { useState } from 'react';
import { X } from 'lucide-react';
import { SUPPLIERS, PURCHASE_ORDERS, STOCK_ITEMS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { fmtShortDate, relTime } from '@/lib/dates';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import type { Supplier, PurchaseOrder, POStatus } from '@/types/inventory.types';

const ITEM_IDX = Object.fromEntries(STOCK_ITEMS.map((i) => [i.id, i]));

const STATUS_CFG: Record<POStatus, { label: string; cls: string; bg: string }> = {
  draft:     { label: 'Draft',     cls: 'text-ink-muted',    bg: 'bg-surface-hover'  },
  sent:      { label: 'Sent',      cls: 'text-accent-blue',  bg: 'bg-accent-blue/10' },
  confirmed: { label: 'Confirmed', cls: 'text-accent-gold',  bg: 'bg-accent-gold/10' },
  partial:   { label: 'Partial',   cls: 'text-status-info',  bg: 'bg-status-info/10' },
  received:  { label: 'Received',  cls: 'text-status-ok',    bg: 'bg-status-ok/10'   },
};

function reliabilityColor(score: number): string {
  if (score >= 90) return 'text-status-ok';
  if (score >= 75) return 'text-accent-gold';
  return 'text-status-warning';
}

function reliabilityBar(score: number): string {
  if (score >= 90) return 'bg-status-ok';
  if (score >= 75) return 'bg-accent-gold';
  return 'bg-status-warning';
}

function supplierPOs(supplierId: string): PurchaseOrder[] {
  return PURCHASE_ORDERS.filter((p) => p.supplierId === supplierId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ─── Detail Panel ────────────────────────────────────────────────────────────

function SupplierPanel({
  supplier,
  open,
  onClose,
}: {
  supplier: Supplier | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!supplier) return null;

  const pos = supplierPOs(supplier.id);
  const openPos = pos.filter((p) => p.status !== 'received' && p.status !== 'draft');

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[520px] flex-col',
          'border-l border-stroke bg-surface-card shadow-xl',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stroke px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">{supplier.name}</h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              {supplier.activeOrders} active order{supplier.activeOrders !== 1 ? 's' : ''}
              &nbsp;·&nbsp;Last delivery {relTime(supplier.lastDelivery)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px border-b border-stroke bg-stroke">
          <div className="bg-surface-card px-5 py-4">
            <p className="label-caps text-ink-muted">Lead Time</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
              {supplier.leadTimeDays}
              <span className="ml-1 text-sm font-normal text-ink-muted">days</span>
            </p>
          </div>
          <div className="bg-surface-card px-5 py-4">
            <p className="label-caps text-ink-muted">Reliability</p>
            <p className={cn('mt-1 text-xl font-semibold tabular-nums', reliabilityColor(supplier.reliabilityScore))}>
              {supplier.reliabilityScore}
              <span className="ml-0.5 text-sm font-normal">%</span>
            </p>
            <div className="mt-1.5 h-1 w-full rounded-full bg-surface-hover">
              <div
                className={cn('h-1 rounded-full', reliabilityBar(supplier.reliabilityScore))}
                style={{ width: `${supplier.reliabilityScore}%` }}
              />
            </div>
          </div>
          <div className="bg-surface-card px-5 py-4">
            <p className="label-caps text-ink-muted">Open POs</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
              {openPos.length}
            </p>
          </div>
        </div>

        {/* PO list */}
        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-stroke bg-surface-sidebar px-5 py-2">
            <span className="label-caps">Purchase Orders ({pos.length})</span>
          </div>

          {pos.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink-muted">
              No purchase orders for this supplier.
            </div>
          ) : (
            <div className="divide-y divide-stroke">
              {pos.map((po) => {
                const cfg = STATUS_CFG[po.status];
                const totalOrdered = po.items.reduce((s, i) => s + i.orderedQty, 0);
                const totalReceived = po.items.reduce((s, i) => s + i.receivedQty, 0);
                return (
                  <div key={po.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="sku">{po.id.toUpperCase()}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn('rounded px-1.5 py-0.5 text-2xs font-semibold', cfg.cls, cfg.bg)}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-ink tabular-nums">{formatCurrency(po.totalValue)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <span>
                        {po.items.length} line{po.items.length !== 1 ? 's' : ''}
                        &nbsp;·&nbsp;
                        {totalReceived}/{totalOrdered} units received
                      </span>
                      <span>Due {fmtShortDate(po.expectedDelivery)}</span>
                    </div>
                    {/* SKU chips */}
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {po.items.map((item) => {
                        const stock = ITEM_IDX[item.skuId];
                        return (
                          <span key={item.skuId} className="sku text-2xs">
                            {stock?.sku ?? item.skuId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stroke px-5 py-3 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function SuppliersPage() {
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  function openPanel(s: Supplier) {
    setSelected(s);
    requestAnimationFrame(() => setPanelOpen(true));
  }

  function closePanel() {
    setPanelOpen(false);
    setTimeout(() => setSelected(null), 300);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading">Suppliers</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {SUPPLIERS.length} suppliers — click to view orders and performance.
        </p>
      </div>

      <div className="rounded border border-stroke overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stroke bg-surface-sidebar">
                <th className="px-4 py-2.5 text-left label-caps min-w-[200px]">Supplier</th>
                <th className="px-4 py-2.5 text-left label-caps w-32">Lead Time</th>
                <th className="px-4 py-2.5 text-left label-caps w-48">Reliability</th>
                <th className="px-4 py-2.5 text-left label-caps w-28">Active POs</th>
                <th className="px-4 py-2.5 text-left label-caps w-40">Last Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke">
              {SUPPLIERS.map((s, idx) => (
                <tr
                  key={s.id}
                  onClick={() => openPanel(s)}
                  className={cn(
                    'cursor-pointer transition-colors duration-fast',
                    idx % 2 === 1
                      ? 'bg-surface-hover/20 hover:bg-surface-hover'
                      : 'hover:bg-surface-hover'
                  )}
                >
                  <td className="px-4 py-2.5">
                    <span className="text-sm font-medium text-ink">{s.name}</span>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-ink-muted">
                    {s.leadTimeDays} days
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={cn('tabular-nums font-semibold text-sm w-10', reliabilityColor(s.reliabilityScore))}>
                        {s.reliabilityScore}%
                      </span>
                      <div className="h-1.5 w-24 rounded-full bg-surface-hover">
                        <div
                          className={cn('h-1.5 rounded-full', reliabilityBar(s.reliabilityScore))}
                          style={{ width: `${s.reliabilityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-ink-muted">
                    {s.activeOrders}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-ink-muted">
                    {relTime(s.lastDelivery)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SupplierPanel supplier={selected} open={panelOpen} onClose={closePanel} />
    </div>
  );
}
