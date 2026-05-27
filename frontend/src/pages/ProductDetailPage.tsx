import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowLeftRight, ShoppingCart } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonTableRows } from '@/components/SkeletonLoader';
import { StatusBadge } from '@/components/features/inventory/StatusBadge';
import { Button } from '@/components/ui/button';
import { productsApi, type ApiProduct } from '@/services/products.service';
import { movementsApi, type ApiMovement } from '@/services/movements.service';
import { ordersApi, type ApiPurchaseOrder } from '@/services/orders.service';
import { relTime, fmtShortDate } from '@/lib/dates';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import type { MovementType, POStatus } from '@/types/inventory.types';

const MOV_CONFIG: Record<MovementType, { label: string; cls: string; bg: string; sign: string }> = {
  receive:  { label: 'RCV', cls: 'text-status-ok',   bg: 'bg-status-ok/10',   sign: '+' },
  issue:    { label: 'ISS', cls: 'text-ink-dim',      bg: 'bg-surface-hover',  sign: '−' },
  transfer: { label: 'TRF', cls: 'text-status-info', bg: 'bg-status-info/10', sign: '→' },
  adjust:   { label: 'ADJ', cls: 'text-accent-gold', bg: 'bg-accent-gold/10', sign: '±' },
};

const PO_STATUS_CFG: Record<POStatus, { label: string; cls: string; bg: string }> = {
  draft:     { label: 'Draft',     cls: 'text-ink-muted',    bg: 'bg-surface-hover'  },
  sent:      { label: 'Sent',      cls: 'text-accent-blue',  bg: 'bg-accent-blue/10' },
  confirmed: { label: 'Confirmed', cls: 'text-accent-gold',  bg: 'bg-accent-gold/10' },
  partial:   { label: 'Partial',   cls: 'text-status-info',  bg: 'bg-status-info/10' },
  received:  { label: 'Received',  cls: 'text-status-ok',    bg: 'bg-status-ok/10'   },
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product,    setProduct]    = useState<ApiProduct | null>(null);
  const [notFound,   setNotFound]   = useState(false);
  const [movements,  setMovements]  = useState<ApiMovement[]>([]);
  const [movTotal,   setMovTotal]   = useState(0);
  const [movLoading, setMovLoading] = useState(true);
  const [orders,     setOrders]     = useState<ApiPurchaseOrder[]>([]);
  const [ordLoading, setOrdLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    productsApi.getById(id)
      .then((r) => setProduct(r.data))
      .catch(() => setNotFound(true));

    movementsApi.listForProduct(id, { limit: 30 })
      .then((r) => { setMovements(r.data.data); setMovTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setMovLoading(false));

    ordersApi.list({ productId: id, limit: 50 })
      .then((r) => setOrders(r.data.data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )))
      .catch(() => {})
      .finally(() => setOrdLoading(false));
  }, [id]);

  if (notFound) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="-ml-1 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
        <div className="rounded border border-stroke bg-surface-card px-4 py-10 text-center">
          <p className="text-sm text-ink-muted">Item not found.</p>
        </div>
      </div>
    );
  }

  const stockStatus  = product?.stockStatus ?? product?.status ?? 'ok';
  const stockFill    = product ? Math.min(100, Math.round((product.currentQty / product.maxQty) * 100)) : 0;
  const stockColor   =
    stockStatus === 'critical' ? 'bg-status-error' :
    stockStatus === 'low'      ? 'bg-status-warning' :
    stockStatus === 'overstock'? 'bg-accent-gold' :
    'bg-status-ok';

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="-ml-1 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
      </div>

      {/* Item header */}
      <div className="rounded border border-stroke bg-surface-card px-5 py-4">
        {!product ? (
          <div className="h-24 flex items-center justify-center text-sm text-ink-muted">Loading…</div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="sku">{product.sku}</span>
                  <span className="label-caps text-ink-muted">{product.category?.name ?? '—'}</span>
                </div>
                <h1 className="heading">{product.name}</h1>
              </div>
              <StatusBadge status={stockStatus} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
              <div>
                <p className="label-caps text-ink-muted">Current Stock</p>
                <p className={cn('mt-0.5 text-xl font-semibold tabular-nums',
                  stockStatus === 'critical' ? 'text-status-error' :
                  stockStatus === 'low' ? 'text-status-warning' : 'text-ink'
                )}>
                  {product.currentQty.toLocaleString()}
                  <span className="ml-1 text-sm font-normal text-ink-muted">{product.unit}</span>
                </p>
              </div>
              <div>
                <p className="label-caps text-ink-muted">Min / Max</p>
                <p className="mt-0.5 text-sm tabular-nums text-ink">
                  {product.minQty} / {product.maxQty}
                  <span className="ml-1 text-ink-muted">{product.unit}</span>
                </p>
              </div>
              <div>
                <p className="label-caps text-ink-muted">Location</p>
                <p className="mt-0.5 sku">
                  {product.locationZone}-{product.locationRack}-{product.locationBin}
                </p>
              </div>
              <div>
                <p className="label-caps text-ink-muted">Category</p>
                <p className="mt-0.5 text-sm text-ink">{product.category?.name ?? '—'}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-ink-muted mb-1">
                <span>0</span>
                <span className="tabular-nums">{stockFill}% of max capacity</span>
                <span>{product.maxQty}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-hover">
                <div
                  className={cn('h-2 rounded-full transition-all', stockColor)}
                  style={{ width: `${stockFill}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Movement history */}
        <div className="rounded border border-stroke overflow-hidden">
          <div className="border-b border-stroke bg-surface-sidebar px-4 py-2 flex items-center justify-between">
            <span className="label-caps">Movement History</span>
            <span className="text-xs text-ink-muted tabular-nums">
              {movLoading ? 'Loading…' : `${movTotal} record${movTotal !== 1 ? 's' : ''}`}
            </span>
          </div>
          {movLoading ? (
            <table className="w-full text-sm"><tbody><SkeletonTableRows rows={3} cols={4} /></tbody></table>
          ) : movements.length === 0 ? (
            <EmptyState icon={ArrowLeftRight} title="No movements recorded" subtitle="Movements will appear here once stock is received, issued, or transferred." />
          ) : (
            <div className="divide-y divide-stroke">
              {movements.map((mov) => {
                const cfg  = MOV_CONFIG[mov.type];
                const sign = mov.type === 'adjust' ? (mov.qty >= 0 ? '+' : '') : cfg.sign;
                const loc  =
                  mov.type === 'transfer'
                    ? `${mov.fromLocation ?? '?'} → ${mov.toLocation ?? '?'}`
                    : mov.fromLocation ?? mov.toLocation ?? '—';
                return (
                  <div key={mov.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors duration-fast">
                    <span className={cn('rounded px-1.5 py-0.5 text-2xs font-semibold shrink-0', cfg.cls, cfg.bg)}>
                      {cfg.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn('tabular-nums font-semibold text-sm', cfg.cls)}>
                          {sign}{Math.abs(mov.qty)} {product?.unit ?? ''}
                        </span>
                        <span className="sku text-xs text-ink-dim">{loc}</span>
                      </div>
                      {mov.note && <p className="text-xs text-ink-muted truncate">{mov.note}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-ink-muted tabular-nums">{relTime(mov.timestamp)}</p>
                      <p className="text-2xs text-ink-muted/60">{mov.operator?.name ?? mov.operatorId ?? '—'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Related POs */}
        <div className="rounded border border-stroke overflow-hidden">
          <div className="border-b border-stroke bg-surface-sidebar px-4 py-2 flex items-center justify-between">
            <span className="label-caps">Purchase Orders</span>
            <span className="text-xs text-ink-muted tabular-nums">
              {ordLoading ? 'Loading…' : `${orders.length} record${orders.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          {ordLoading ? (
            <table className="w-full text-sm"><tbody><SkeletonTableRows rows={3} cols={4} /></tbody></table>
          ) : orders.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="No purchase orders for this SKU" />
          ) : (
            <div className="divide-y divide-stroke">
              {orders.map((po) => {
                const line = po.lines.find((l) => l.sku === product?.sku);
                const cfg  = PO_STATUS_CFG[po.status];
                return (
                  <div key={po.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors duration-fast">
                    <span className="sku shrink-0">{po.id.toUpperCase()}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('rounded px-1.5 py-0.5 text-2xs font-semibold', cfg.cls, cfg.bg)}>
                          {cfg.label}
                        </span>
                        {line && (
                          <span className="text-xs text-ink-muted tabular-nums">
                            {line.receivedQty}/{line.orderedQty} {product?.unit ?? ''} received
                          </span>
                        )}
                        <span className="text-xs text-ink-muted tabular-nums">
                          {formatCurrency(po.totalValue)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted">{po.supplierName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-ink-muted">Due {fmtShortDate(po.expectedDelivery)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
