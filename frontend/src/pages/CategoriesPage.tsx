import { useState, useEffect } from 'react';
import { productsApi } from '@/services/products.service';
import { cn } from '@/lib/cn';
import type { StockStatus } from '@/types/inventory.types';

const STATUS_DOT: Record<StockStatus, string> = {
  critical: 'bg-status-error',
  low:      'bg-status-warning',
  ok:       'bg-status-ok',
  overstock:'bg-accent-gold',
};

interface CategoryRow {
  name:     string;
  total:    number;
  critical: number;
  low:      number;
  ok:       number;
  overstock: number;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [totalSKUs, setTotalSKUs]   = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    productsApi.list({ limit: 100 })
      .then((res) => {
        const map: Record<string, CategoryRow> = {};
        for (const product of res.data.data) {
          const catName = product.category?.name ?? 'Uncategorized';
          if (!map[catName]) {
            map[catName] = { name: catName, total: 0, critical: 0, low: 0, ok: 0, overstock: 0 };
          }
          map[catName].total++;
          map[catName][product.status]++;
        }
        const rows = Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
        setCategories(rows);
        setTotalSKUs(res.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading">Categories</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {loading
            ? 'Loading…'
            : `${categories.length} categories across ${totalSKUs} SKUs.`}
        </p>
      </div>

      <div className="rounded border border-stroke overflow-hidden">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-ink-muted">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke bg-surface-sidebar">
                  <th className="px-4 py-2.5 text-left label-caps min-w-[160px]">Category</th>
                  <th className="px-4 py-2.5 text-right label-caps w-24">Total SKUs</th>
                  <th className="px-4 py-2.5 text-left label-caps min-w-[200px]">Status Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke">
                {categories.map((cat, idx) => (
                  <tr
                    key={cat.name}
                    className={cn('transition-colors duration-fast', idx % 2 === 1 ? 'bg-surface-hover/20' : '')}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-ink">{cat.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                      {cat.total}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {(
                          [
                            ['critical', cat.critical],
                            ['low',      cat.low],
                            ['ok',       cat.ok],
                            ['overstock', cat.overstock],
                          ] as [StockStatus, number][]
                        ).filter(([, n]) => n > 0).map(([status, count]) => (
                          <span key={status} className="flex items-center gap-1 text-xs text-ink-muted">
                            <span className={cn('h-2 w-2 rounded-full shrink-0', STATUS_DOT[status])} />
                            {count}
                          </span>
                        ))}
                        <div className="flex-1 flex gap-px h-1.5 rounded-full overflow-hidden min-w-[80px]">
                          {(['ok', 'low', 'critical', 'overstock'] as StockStatus[]).map((s) =>
                            cat[s] > 0 ? (
                              <div key={s} className={cn(STATUS_DOT[s])} style={{ flex: cat[s] }} />
                            ) : null
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
