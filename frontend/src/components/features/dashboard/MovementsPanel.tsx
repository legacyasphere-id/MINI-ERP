import { NavLink } from 'react-router-dom';
import { MOVEMENTS, STOCK_ITEMS } from '@/lib/mock-data';
import { relTime } from '@/lib/dates';
import { cn } from '@/lib/cn';
import type { MovementType } from '@/types/inventory.types';

const TYPE_CONFIG: Record<MovementType, { label: string; cls: string; sign: string }> = {
  receive:  { label: 'RCV', cls: 'text-status-ok',      sign: '+'  },
  issue:    { label: 'ISS', cls: 'text-ink-dim',         sign: '−'  },
  transfer: { label: 'TRF', cls: 'text-status-info',    sign: '→'  },
  adjust:   { label: 'ADJ', cls: 'text-accent-gold',    sign: '±'  },
};

const QTY_COLOR: Record<MovementType, string> = {
  receive:  'text-status-ok',
  issue:    'text-ink-dim',
  transfer: 'text-status-info',
  adjust:   'text-accent-gold',
};

const stockMap = Object.fromEntries(STOCK_ITEMS.map((i) => [i.id, i]));

const recent = [...MOVEMENTS]
  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  .slice(0, 10);

export function MovementsPanel() {
  return (
    <div className="rounded border border-stroke bg-surface-card flex flex-col">
      <div className="flex items-center justify-between border-b border-stroke px-4 py-3 shrink-0">
        <span className="label-caps">Recent Movements</span>
        <NavLink to="/movement" className="text-xs text-accent-blue hover:underline transition-colors">
          View all
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stroke bg-surface-sidebar">
              <th className="px-3 py-2 text-left label-caps w-12">Type</th>
              <th className="px-3 py-2 text-left label-caps w-36">SKU</th>
              <th className="px-3 py-2 text-left label-caps">Name</th>
              <th className="px-3 py-2 text-right label-caps w-16">Qty</th>
              <th className="px-3 py-2 text-left label-caps w-28">Ref</th>
              <th className="px-3 py-2 text-right label-caps w-28">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke">
            {recent.map((mov) => {
              const stock = stockMap[mov.skuId];
              const { label, cls, sign } = TYPE_CONFIG[mov.type];
              return (
                <tr key={mov.id} className="hover:bg-surface-hover transition-colors duration-fast">
                  <td className="px-3 py-1.5">
                    <span className={cn('font-mono text-xs font-bold', cls)}>{label}</span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className="sku">{stock?.sku ?? '—'}</span>
                  </td>
                  <td className="px-3 py-1.5 max-w-[200px]">
                    <span className="block truncate text-ink-dim">{stock?.name ?? '—'}</span>
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    <span className={cn('font-medium', QTY_COLOR[mov.type])}>
                      {sign}{Math.abs(mov.qty)}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className="sku text-ink-muted">{mov.referenceId}</span>
                  </td>
                  <td className="px-3 py-1.5 text-right text-xs text-ink-muted tabular-nums whitespace-nowrap">
                    {relTime(mov.timestamp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
