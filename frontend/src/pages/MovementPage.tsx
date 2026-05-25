import { useState, useMemo, useRef } from 'react';
import { STOCK_ITEMS, MOVEMENTS } from '@/lib/mock-data';
import { StatusBadge } from '@/components/features/inventory/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { relTime } from '@/lib/dates';
import { cn } from '@/lib/cn';
import type { StockMovement, MovementType } from '@/types/inventory.types';

const TYPE_OPTIONS: { value: MovementType; label: string }[] = [
  { value: 'receive',  label: 'Receive (IN)'  },
  { value: 'issue',    label: 'Issue (OUT)'   },
  { value: 'transfer', label: 'Transfer'      },
  { value: 'adjust',   label: 'Adjustment'    },
];

const TYPE_CONFIG: Record<MovementType, { label: string; cls: string; bg: string }> = {
  receive:  { label: 'RCV', cls: 'text-status-ok',   bg: 'bg-status-ok/10'   },
  issue:    { label: 'ISS', cls: 'text-ink-dim',      bg: 'bg-surface-hover'  },
  transfer: { label: 'TRF', cls: 'text-status-info', bg: 'bg-status-info/10' },
  adjust:   { label: 'ADJ', cls: 'text-accent-gold', bg: 'bg-accent-gold/10' },
};

const LOC_LABEL: Record<MovementType, string> = {
  receive:  'Destination',
  issue:    'From Location',
  transfer: 'Destination',
  adjust:   'Location',
};

const SKU_INDEX = Object.fromEntries(STOCK_ITEMS.map((i) => [i.sku.toLowerCase(), i]));
const ITEM_INDEX = Object.fromEntries(STOCK_ITEMS.map((i) => [i.id, i]));

let refSeq = 100;
function genRef(type: MovementType): string {
  const n = refSeq++;
  if (type === 'receive')  return `PO-MAN-${String(n).padStart(3, '0')}`;
  if (type === 'issue')    return `REQ-${1900 + n}`;
  if (type === 'transfer') return `TRF-${String(n).padStart(4, '0')}`;
  return `ADJ-${String(n).padStart(4, '0')}`;
}

function locationDisplay(mov: StockMovement): string {
  if (mov.type === 'transfer') return `${mov.fromLocation ?? '?'} → ${mov.toLocation ?? '?'}`;
  return mov.fromLocation ?? mov.toLocation ?? '—';
}

function qtyDisplay(mov: StockMovement): { text: string; cls: string } {
  const QTY_CLS: Record<MovementType, string> = {
    receive:  'text-status-ok',
    issue:    'text-ink-dim',
    transfer: 'text-status-info',
    adjust:   'text-accent-gold',
  };
  const cls = QTY_CLS[mov.type];
  if (mov.type === 'adjust')  return { text: mov.qty >= 0 ? `+${mov.qty}` : String(mov.qty), cls };
  if (mov.type === 'issue')   return { text: `−${mov.qty}`, cls };
  if (mov.type === 'receive') return { text: `+${mov.qty}`, cls };
  return { text: String(mov.qty), cls };
}

export function MovementPage() {
  const [log, setLog] = useState<StockMovement[]>(() =>
    [...MOVEMENTS]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)
  );
  const [sku, setSku] = useState('');
  const [type, setType] = useState<MovementType>('receive');
  const [qty, setQty] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const skuRef = useRef<HTMLInputElement>(null);

  const matchedItem = useMemo(
    () => (sku.trim() ? SKU_INDEX[sku.trim().toLowerCase()] ?? null : null),
    [sku]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!matchedItem) {
      setError(sku.trim() ? `SKU "${sku.trim()}" not found` : 'SKU is required');
      skuRef.current?.focus();
      return;
    }
    const qtyNum = Number(qty);
    if (!qty || isNaN(qtyNum) || qtyNum === 0) {
      setError('Enter a valid non-zero quantity');
      return;
    }
    if (!location.trim()) {
      setError('Location is required');
      return;
    }

    const storedLoc = `${matchedItem.location.zone}-${matchedItem.location.rack}-${matchedItem.location.bin}`;

    const mov: StockMovement = {
      id: `mov-${Date.now()}`,
      type,
      skuId: matchedItem.id,
      qty: type === 'adjust' ? qtyNum : Math.abs(qtyNum),
      fromLocation:
        type === 'receive'  ? null :
        type === 'transfer' ? storedLoc :
        location.trim(),
      toLocation:
        type === 'issue'  ? null :
        type === 'adjust' ? null :
        location.trim(),
      operatorId: 'current-user',
      timestamp: new Date().toISOString(),
      referenceId: genRef(type),
      note: note.trim() || null,
    };

    setLog((prev) => [mov, ...prev].slice(0, 20));
    setLastAddedId(mov.id);
    setSku('');
    setQty('');
    setNote('');
    requestAnimationFrame(() => skuRef.current?.focus());
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading">Stock Movement</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Scan a SKU, confirm type and quantity. Last {log.length} movements shown.
        </p>
      </div>

      {/* Entry form */}
      <div className="rounded border border-stroke bg-surface-card px-4 py-3">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-end gap-2 flex-wrap">
            {/* SKU */}
            <div className="flex flex-col gap-0.5">
              <span className="label-caps text-ink-muted">SKU / Barcode</span>
              <Input
                ref={skuRef}
                value={sku}
                onChange={(e) => { setSku(e.target.value); setError(null); }}
                placeholder="Scan or type…"
                autoFocus
                className={cn(
                  'w-[150px]',
                  error && !matchedItem && sku.trim() ? 'border-status-error' : ''
                )}
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-0.5">
              <span className="label-caps text-ink-muted">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MovementType)}
                className="h-input w-[130px] rounded border border-stroke bg-surface-base px-2.5 text-sm text-ink focus:border-stroke-focus focus:outline-none transition-colors duration-fast"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Qty */}
            <div className="flex flex-col gap-0.5">
              <span className="label-caps text-ink-muted">Qty</span>
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
                step={1}
                className="w-[80px] tabular-nums"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-0.5">
              <span className="label-caps text-ink-muted">{LOC_LABEL[type]}</span>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Z-RR-BB"
                className="w-[120px] font-mono text-ink-dim"
              />
            </div>

            {/* Note */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-[120px]">
              <span className="label-caps text-ink-muted">Note (optional)</span>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Damage, discrepancy, ref…"
              />
            </div>

            <Button type="submit" className="px-5">Confirm</Button>
          </div>

          {/* Context strip */}
          {matchedItem && (
            <div className="mt-2 flex items-center gap-x-3 gap-y-1 flex-wrap rounded border border-stroke/50 bg-surface-base px-3 py-1.5">
              <span className="text-xs font-medium text-ink truncate max-w-[220px]">
                {matchedItem.name}
              </span>
              <span className="text-ink-muted text-xs">·</span>
              <span className="text-xs text-ink-muted">
                Current:&nbsp;
                <span className="tabular-nums text-ink">{matchedItem.currentQty.toLocaleString()}</span>
                &nbsp;{matchedItem.unit}
              </span>
              <span className="text-ink-muted text-xs">·</span>
              <span className="sku">
                {matchedItem.location.zone}-{matchedItem.location.rack}-{matchedItem.location.bin}
              </span>
              <StatusBadge status={matchedItem.status} />
              {type === 'transfer' && location.trim() && (
                <>
                  <span className="text-ink-muted text-xs">·</span>
                  <span className="text-xs text-ink-muted">
                    {matchedItem.location.zone}-{matchedItem.location.rack}-{matchedItem.location.bin}
                    &nbsp;→&nbsp;
                    <span className="font-mono text-ink-dim">{location.trim()}</span>
                  </span>
                </>
              )}
            </div>
          )}

          {error && (
            <p className="mt-1.5 text-xs text-status-error">{error}</p>
          )}
        </form>
      </div>

      {/* Log table */}
      <div className="rounded border border-stroke overflow-hidden">
        <div className="border-b border-stroke bg-surface-sidebar px-4 py-2 flex items-center justify-between">
          <span className="label-caps">Movement Log</span>
          <span className="text-xs text-ink-muted tabular-nums">{log.length} entries</span>
        </div>

        {log.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">No movements recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke bg-surface-sidebar">
                  <th className="px-3 py-2 text-left label-caps w-28">Time</th>
                  <th className="px-3 py-2 text-left label-caps w-14">Type</th>
                  <th className="px-3 py-2 text-left label-caps w-36">SKU</th>
                  <th className="px-3 py-2 text-left label-caps min-w-[160px]">Item</th>
                  <th className="px-3 py-2 text-right label-caps w-20">Qty</th>
                  <th className="px-3 py-2 text-left label-caps w-44">Location</th>
                  <th className="px-3 py-2 text-left label-caps min-w-[160px]">Note / Ref</th>
                  <th className="px-3 py-2 text-left label-caps w-28">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke">
                {log.map((mov, idx) => {
                  const item = ITEM_INDEX[mov.skuId];
                  const cfg = TYPE_CONFIG[mov.type];
                  const qty = qtyDisplay(mov);
                  const isNew = mov.id === lastAddedId && idx === 0;
                  return (
                    <tr
                      key={mov.id}
                      className={cn(
                        'transition-colors duration-fast',
                        isNew
                          ? 'bg-accent-blue/[0.06] hover:bg-accent-blue/[0.1]'
                          : idx % 2 === 1
                          ? 'bg-surface-hover/20 hover:bg-surface-hover'
                          : 'hover:bg-surface-hover'
                      )}
                    >
                      <td className="px-3 py-1.5 text-xs text-ink-muted tabular-nums whitespace-nowrap">
                        {relTime(mov.timestamp)}
                      </td>
                      <td className="px-3 py-1.5">
                        <span className={cn('rounded px-1.5 py-0.5 text-2xs font-semibold', cfg.cls, cfg.bg)}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-1.5">
                        <span className="sku">{item?.sku ?? mov.skuId}</span>
                      </td>
                      <td className="px-3 py-1.5 max-w-[220px]">
                        <span className="block truncate text-xs text-ink-muted">{item?.name ?? '—'}</span>
                      </td>
                      <td className={cn('px-3 py-1.5 text-right tabular-nums font-semibold', qty.cls)}>
                        {qty.text}
                      </td>
                      <td className="px-3 py-1.5">
                        <span className="sku text-xs text-ink-dim whitespace-nowrap">
                          {locationDisplay(mov)}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 max-w-[240px]">
                        {mov.note ? (
                          <span className="block truncate text-xs text-ink-muted" title={mov.note}>
                            {mov.note}
                          </span>
                        ) : (
                          <span className="text-xs text-ink-muted/40">{mov.referenceId}</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-ink-muted">{mov.operatorId}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
