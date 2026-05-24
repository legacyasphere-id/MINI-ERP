import { cn } from '@/lib/cn';
import type { StockStatus } from '@/types/inventory.types';

const CONFIG: Record<StockStatus, { label: string; cls: string }> = {
  critical: { label: 'Critical',  cls: 'bg-status-error/20   text-status-error   border-status-error/30'   },
  low:      { label: 'Low Stock', cls: 'bg-status-warning/20 text-status-warning border-status-warning/30' },
  ok:       { label: 'OK',        cls: 'bg-status-ok/20      text-status-ok      border-status-ok/30'       },
  overstock:{ label: 'Overstock', cls: 'bg-status-info/20    text-status-info    border-status-info/30'     },
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const { label, cls } = CONFIG[status];
  return (
    <span className={cn('inline-flex items-center rounded border px-1.5 py-0.5 text-2xs font-semibold tabular-nums', cls)}>
      {label}
    </span>
  );
}
