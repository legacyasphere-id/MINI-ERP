import { useState, useMemo, useEffect } from 'react';
import { STOCK_ITEMS } from '@/lib/mock-data';
import type { StockStatus } from '@/types/inventory.types';
import { StockFilters } from '@/components/features/inventory/StockFilters';
import { StockTable, type SortKey, type SortDir } from '@/components/features/inventory/StockTable';

const CATEGORIES = [...new Set(STOCK_ITEMS.map((i) => i.category))].sort();

const STATUS_ORDER: Record<string, number> = { critical: 0, low: 1, ok: 2, overstock: 3 };

export function InventoryPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('status');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // 200ms debounce on search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    let items = STOCK_ITEMS;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (i) => i.sku.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      items = items.filter((i) => i.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      items = items.filter((i) => i.category === categoryFilter);
    }

    return [...items].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'sku':        cmp = a.sku.localeCompare(b.sku);                            break;
        case 'name':       cmp = a.name.localeCompare(b.name);                          break;
        case 'category':   cmp = a.category.localeCompare(b.category);                  break;
        case 'currentQty': cmp = a.currentQty - b.currentQty;                           break;
        case 'status':     cmp = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [debouncedSearch, statusFilter, categoryFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading">Stock List</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {STOCK_ITEMS.length} SKUs across {CATEGORIES.length} categories — search, filter, sort.
        </p>
      </div>

      <StockFilters
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        onStatus={setStatusFilter}
        category={categoryFilter}
        onCategory={setCategoryFilter}
        categories={CATEGORIES}
        totalCount={STOCK_ITEMS.length}
        filteredCount={filtered.length}
      />

      <StockTable
        items={filtered}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />
    </div>
  );
}
