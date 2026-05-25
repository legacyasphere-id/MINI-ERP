import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { PURCHASE_ORDERS, SUPPLIERS, STOCK_ITEMS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fmtShortDate } from '@/lib/dates';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import type { PurchaseOrder, POStatus } from '@/types/inventory.types';

const SUPPLIER_IDX = Object.fromEntries(SUPPLIERS.map((s) => [s.id, s]));
const ITEM_IDX = Object.fromEntries(STOCK_ITEMS.map((i) => [i.id, i]));

const STATUS_CFG: Record<POStatus, { label: string; cls: string; bg: string }> = {
  draft:     { label: 'Draft',     cls: 'text-ink-muted',    bg: 'bg-surface-hover'  },
  sent:      { label: 'Sent',      cls: 'text-accent-blue',  bg: 'bg-accent-blue/10' },
  confirmed: { label: 'Confirmed', cls: 'text-accent-gold',  bg: 'bg-accent-gold/10' },
  partial:   { label: 'Partial',   cls: 'text-status-info',  bg: 'bg-status-info/10' },
  received:  { label: 'Received',  cls: 'text-status-ok',    bg: 'bg-status-ok/10'   },
};

type FilterTab = 'all' | 'active' | 'received' | 'draft';

const TABS: { value: FilterTab; label: string; match: (s: POStatus) => boolean }[] = [
  { value: 'all',      label: 'All',      match: () => true },
  { value: 'active',   label: 'Active',   match: (s) => s === 'sent' || s === 'confirmed' || s === 'partial' },
  { value: 'received', label: 'Received', match: (s) => s === 'received' },
  { value: 'draft',    label: 'Draft',    match: (s) => s === 'draft' },
];

function isOverdue(po: PurchaseOrder) {
  return (
    po.status !== 'received' &&
    po.status !== 'draft' &&
    new Date(po.expectedDelivery) < new Date()
  );
}

function canReceive(s: POStatus) {
  return s === 'sent' || s === 'confirmed' || s === 'partial';
}

// ─── Receive Drawer ──────────────────────────────────────────────────────────

interface DrawerProps {
  po: PurchaseOrder | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    po: PurchaseOrder,
    qtys: Record<string, number>,
    locs: Record<string, string>
  ) => void;
}

function ReceiveDrawer({ po, open, onClose, onConfirm }: DrawerProps) {
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [locs, setLocs] = useState<Record<string, string>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!po) return;
    setQtys(Object.fromEntries(po.items.map((i) => [i.skuId, 0])));
    setLocs(
      Object.fromEntries(
        po.items.map((i) => {
          const item = ITEM_IDX[i.skuId];
          const loc = item
            ? `${item.location.zone}-${item.location.rack}-${item.location.bin}`
            : '';
          return [i.skuId, loc];
        })
      )
    );
  }, [po?.id]);

  if (!po) return null;

  const supplier = SUPPLIER_IDX[po.supplierId];
  const receivable = canReceive(po.status);
  const overdue = isOverdue(po);
  const cfg = STATUS_CFG[po.status];
  const anyQtyEntered = Object.values(qtys).some((q) => q > 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[500px] flex-col',
          'border-l border-stroke bg-surface-card shadow-xl',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stroke px-5 py-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-semibold text-ink">
                {po.id.toUpperCase()}
              </span>
              <span className={cn('rounded px-1.5 py-0.5 text-2xs font-semibold', cfg.cls, cfg.bg)}>
                {cfg.label}
              </span>
              {overdue && (
                <span className="rounded px-1.5 py-0.5 text-2xs font-semibold text-status-error bg-status-error/10">
                  OVERDUE
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-ink-muted">
              {supplier?.name ?? po.supplierId}
              &nbsp;·&nbsp;Due {fmtShortDate(po.expectedDelivery)}
              &nbsp;·&nbsp;{formatCurrency(po.totalValue)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Line items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {po.items.map((poItem) => {
            const item = ITEM_IDX[poItem.skuId];
            const remaining = poItem.orderedQty - poItem.receivedQty;
            const complete = remaining <= 0;
            const qty = qtys[poItem.skuId] ?? 0;
            const loc = locs[poItem.skuId] ?? '';

            return (
              <div
                key={poItem.skuId}
                className={cn(
                  'rounded border p-3',
                  complete
                    ? 'border-stroke/40 bg-surface-base/50 opacity-60'
                    : 'border-stroke bg-surface-base'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    {item && <span className="sku">{item.sku}</span>}
                    <p className="mt-0.5 text-sm text-ink">{item?.name ?? poItem.skuId}</p>
                  </div>
                  {complete && (
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-2xs font-semibold text-status-ok bg-status-ok/10">
                      COMPLETE
                    </span>
                  )}
                </div>

                <div className="mb-3 flex gap-4 text-xs text-ink-muted">
                  <span>Ordered: <span className="tabular-nums text-ink">{poItem.orderedQty}</span></span>
                  <span>Received: <span className="tabular-nums text-ink">{poItem.receivedQty}</span></span>
                  <span>
                    Remaining:{' '}
                    <span className={cn('tabular-nums font-semibold', remaining > 0 ? 'text-accent-gold' : 'text-status-ok')}>
                      {remaining}
                    </span>
                  </span>
                  <span>Unit cost: <span className="tabular-nums text-ink">{formatCurrency(poItem.unitCost)}</span></span>
                </div>

                {receivable && !complete && (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="label-caps text-ink-muted">Receive now</span>
                      <Input
                        type="number"
                        min={0}
                        max={remaining}
                        step={1}
                        value={qty || ''}
                        onChange={(e) =>
                          setQtys((prev) => ({
                            ...prev,
                            [poItem.skuId]: Math.min(
                              Math.max(0, Number(e.target.value) || 0),
                              remaining
                            ),
                          }))
                        }
                        placeholder="0"
                        className="w-[80px] tabular-nums bg-surface-card"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className="label-caps text-ink-muted">Put-away location</span>
                      <Input
                        value={loc}
                        onChange={(e) =>
                          setLocs((prev) => ({ ...prev, [poItem.skuId]: e.target.value }))
                        }
                        placeholder="Z-RR-BB"
                        className="font-mono text-ink-dim bg-surface-card"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-stroke px-5 py-3">
          <span className="text-xs text-ink-muted">
            {po.items.length} line{po.items.length !== 1 ? 's' : ''}
            &nbsp;·&nbsp;
            <span className="tabular-nums text-ink">{formatCurrency(po.totalValue)}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              {receivable ? 'Cancel' : 'Close'}
            </Button>
            {receivable && (
              <Button
                onClick={() => onConfirm(po, qtys, locs)}
                disabled={!anyQtyEntered}
                className="px-5"
              >
                Confirm Receipt
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(() =>
    [...PURCHASE_ORDERS].sort(
      (a, b) =>
        new Date(a.expectedDelivery).getTime() - new Date(b.expectedDelivery).getTime()
    )
  );
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openDrawer(po: PurchaseOrder) {
    setSelectedPO(po);
    requestAnimationFrame(() => setDrawerOpen(true));
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setSelectedPO(null), 300);
  }

  function handleConfirm(
    po: PurchaseOrder,
    qtys: Record<string, number>,
    _locs: Record<string, string>
  ) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== po.id) return o;

        const updatedItems = o.items.map((item) => {
          const add = Math.min(
            Math.max(0, qtys[item.skuId] ?? 0),
            item.orderedQty - item.receivedQty
          );
          return add > 0 ? { ...item, receivedQty: item.receivedQty + add } : item;
        });

        const allDone = updatedItems.every((i) => i.receivedQty >= i.orderedQty);
        const anyDone = updatedItems.some((i) => i.receivedQty > 0);
        const newStatus: POStatus = allDone ? 'received' : anyDone ? 'partial' : o.status;

        return { ...o, items: updatedItems, status: newStatus };
      })
    );
    closeDrawer();
  }

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.value === filter)!;
    return orders.filter((o) => tab.match(o.status));
  }, [orders, filter]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading">Purchase Orders</h1>
        <p className="mt-1 text-sm text-ink-muted">
          PO status, receiving workflow, and delivery tracking.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-0 border-b border-stroke">
        {TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? orders.length
              : orders.filter((o) => tab.match(o.status)).length;
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                '-mb-px px-4 py-2 text-sm transition-colors duration-fast',
                active
                  ? 'border-b-2 border-accent-blue text-accent-blue'
                  : 'text-ink-muted hover:text-ink'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'ml-1.5 rounded px-1 py-0.5 text-2xs tabular-nums',
                  active
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'bg-surface-hover text-ink-muted'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded border border-stroke overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-ink-muted">
            No purchase orders in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke bg-surface-sidebar">
                  <th className="px-4 py-2.5 text-left label-caps w-28">PO</th>
                  <th className="px-4 py-2.5 text-left label-caps min-w-[160px]">Supplier</th>
                  <th className="px-4 py-2.5 text-left label-caps w-28">Status</th>
                  <th className="px-4 py-2.5 text-left label-caps w-20">Lines</th>
                  <th className="px-4 py-2.5 text-right label-caps w-32">Value</th>
                  <th className="px-4 py-2.5 text-left label-caps w-40">Expected</th>
                  <th className="px-4 py-2.5 text-left label-caps w-28">Created</th>
                  <th className="px-4 py-2.5 text-left label-caps w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke">
                {filtered.map((po, idx) => {
                  const supplier = SUPPLIER_IDX[po.supplierId];
                  const cfg = STATUS_CFG[po.status];
                  const overdue = isOverdue(po);
                  const receivable = canReceive(po.status);

                  return (
                    <tr
                      key={po.id}
                      onClick={() => openDrawer(po)}
                      className={cn(
                        'cursor-pointer transition-colors duration-fast',
                        idx % 2 === 1
                          ? 'bg-surface-hover/20 hover:bg-surface-hover'
                          : 'hover:bg-surface-hover'
                      )}
                    >
                      <td className="px-4 py-2">
                        <span className="sku">{po.id.toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-2 text-ink">
                        {supplier?.name ?? po.supplierId}
                      </td>
                      <td className="px-4 py-2">
                        <span className={cn('rounded px-1.5 py-0.5 text-2xs font-semibold', cfg.cls, cfg.bg)}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-2 tabular-nums text-ink-muted">
                        {po.items.length}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums text-ink">
                        {formatCurrency(po.totalValue)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('text-xs tabular-nums', overdue ? 'text-status-error' : 'text-ink-muted')}>
                            {fmtShortDate(po.expectedDelivery)}
                          </span>
                          {overdue && (
                            <span className="rounded px-1 py-0.5 text-2xs font-semibold text-status-error bg-status-error/10">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs text-ink-muted">
                        {fmtShortDate(po.createdAt)}
                      </td>
                      <td className="px-4 py-2">
                        {receivable ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); openDrawer(po); }}
                            className="text-accent-blue hover:bg-accent-blue/10 hover:text-accent-blue"
                          >
                            Receive
                          </Button>
                        ) : (
                          <span className="text-xs text-ink-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReceiveDrawer
        po={selectedPO}
        open={drawerOpen}
        onClose={closeDrawer}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
