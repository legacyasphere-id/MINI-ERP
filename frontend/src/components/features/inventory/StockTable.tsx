import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { relTime } from '@/lib/dates';
import { cn } from '@/lib/cn';
import type { StockItem } from '@/types/inventory.types';

export type SortKey = 'sku' | 'name' | 'category' | 'currentQty' | 'status';
export type SortDir = 'asc' | 'desc';

interface StockTableProps {
  items: StockItem[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

const ROW_TINT: Partial<Record<string, string>> = {
  critical: 'bg-status-error/[0.08]',
  low:      'bg-status-warning/[0.08]',
};

const QTY_COLOR: Partial<Record<string, string>> = {
  critical: 'text-status-error font-semibold',
  low:      'text-status-warning font-semibold',
};

interface Col {
  key: SortKey | null;
  label: string;
  className: string;
}

const COLS: Col[] = [
  { key: 'sku',        label: 'SKU',           className: 'w-40'              },
  { key: 'name',       label: 'Name',          className: 'min-w-[180px]'     },
  { key: 'category',   label: 'Category',      className: 'w-28'              },
  { key: null,         label: 'Location',      className: 'w-28'              },
  { key: 'currentQty', label: 'Qty',           className: 'w-24 text-right'   },
  { key: null,         label: 'Min / Max',     className: 'w-24 text-right'   },
  { key: 'status',     label: 'Status',        className: 'w-28'              },
  { key: null,         label: 'Last Movement', className: 'w-32 text-right'   },
];

function SortIndicator({ col, sortKey, sortDir }: { col: SortKey | null; sortKey: SortKey; sortDir: SortDir }) {
  if (!col) return null;
  if (col !== sortKey) return <ChevronsUpDown className="h-3 w-3 shrink-0 text-ink-muted" />;
  return sortDir === 'asc'
    ? <ChevronUp   className="h-3 w-3 shrink-0 text-accent-blue" />
    : <ChevronDown className="h-3 w-3 shrink-0 text-accent-blue" />;
}

export function StockTable({ items, sortKey, sortDir, onSort }: StockTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded border border-stroke bg-surface-card px-4 py-10 text-center">
        <p className="text-sm text-ink-muted">No items match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-stroke overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stroke bg-surface-sidebar">
              {COLS.map((col) => (
                <th
                  key={col.label}
                  className={cn(
                    'px-3 py-2 text-left label-caps',
                    col.className,
                    col.key && 'cursor-pointer select-none hover:text-ink-dim transition-colors duration-fast'
                  )}
                  onClick={() => col.key && onSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    <SortIndicator col={col.key} sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke">
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  'transition-colors duration-fast hover:bg-surface-hover',
                  ROW_TINT[item.status] ?? (idx % 2 === 1 ? 'bg-surface-hover/20' : '')
                )}
              >
                <td className="px-3 py-1.5">
                  <span className="sku">{item.sku}</span>
                </td>

                <td className="px-3 py-1.5 max-w-[240px]">
                  <span className="block truncate text-ink">{item.name}</span>
                </td>

                <td className="px-3 py-1.5">
                  <span className="label-caps">{item.category}</span>
                </td>

                <td className="px-3 py-1.5">
                  <span className="sku text-ink-dim">
                    {item.location.zone}-{item.location.rack}-{item.location.bin}
                  </span>
                </td>

                <td className="px-3 py-1.5 text-right">
                  <span className={cn('tabular-nums', QTY_COLOR[item.status] ?? 'text-ink')}>
                    {item.currentQty.toLocaleString()}
                  </span>
                  <span className="ml-1 text-2xs text-ink-muted">{item.unit}</span>
                </td>

                <td className="px-3 py-1.5 text-right tabular-nums text-xs text-ink-muted">
                  {item.minQty} / {item.maxQty}
                </td>

                <td className="px-3 py-1.5">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-3 py-1.5 text-right text-xs text-ink-muted tabular-nums whitespace-nowrap">
                  {relTime(item.lastMovement)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
