import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi, type ApiProduct } from '@/services/products.service';
import { INVENTORY_CATEGORIES } from '@/lib/constants';
import type { StockStatus, StockItem } from '@/types/inventory.types';
import { StockFilters } from '@/components/features/inventory/StockFilters';
import { StockTable, type SortKey, type SortDir } from '@/components/features/inventory/StockTable';
import { SkeletonTableRows } from '@/components/SkeletonLoader';
import { EmptyState } from '@/components/EmptyState';
import { Package } from 'lucide-react';
import { cn } from '@/lib/cn';

const LIMIT = 20;

function toStockItem(p: ApiProduct): StockItem {
  return {
    id:           p.id,
    sku:          p.sku,
    name:         p.name,
    category:     p.category?.name ?? 'Uncategorized',
    location:     { zone: p.locationZone, rack: p.locationRack, bin: p.locationBin },
    currentQty:   p.currentQty,
    minQty:       p.minQty,
    maxQty:       p.maxQty,
    unit:         p.unit,
    status:       p.status,
    lastMovement: p.updatedAt,
    supplierId:   '',
  };
}

export function InventoryPage() {
  const navigate = useNavigate();

  const [search, setSearch]               = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter]   = useState<StockStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortKey, setSortKey]             = useState<SortKey>('status');
  const [sortDir, setSortDir]             = useState<SortDir>('asc');
  const [page, setPage]                   = useState(1);

  const [items, setItems]       = useState<StockItem[]>([]);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  // Debounce search 300ms
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [statusFilter, categoryFilter, sortKey, sortDir]);

  const fetchRef = useRef(0);

  const fetchProducts = useCallback(async () => {
    const token = ++fetchRef.current;
    setLoading(true);
    setError(false);
    try {
      const res = await productsApi.list({
        page,
        limit:    LIMIT,
        search:   debouncedSearch || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status:   statusFilter   !== 'all' ? statusFilter   : undefined,
        sortKey,
        sortDir,
      });
      if (token !== fetchRef.current) return; // stale
      setItems(res.data.data.map(toStockItem));
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      if (token !== fetchRef.current) return;
      setError(true);
    } finally {
      if (token === fetchRef.current) setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, categoryFilter, sortKey, sortDir]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Refetch on tab focus (keeps qty in sync after movements)
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') fetchProducts();
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchProducts]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const subtitle = loading
    ? 'Loading…'
    : error
    ? 'Could not load inventory — is the backend running?'
    : `${total} SKU${total !== 1 ? 's' : ''} across ${INVENTORY_CATEGORIES.length} categories`;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading">Stock List</h1>
        <p className={cn('mt-1 text-sm', error ? 'text-status-error' : 'text-ink-muted')}>
          {subtitle}
        </p>
      </div>

      <StockFilters
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        onStatus={setStatusFilter}
        category={categoryFilter}
        onCategory={setCategoryFilter}
        categories={[...INVENTORY_CATEGORIES]}
        totalCount={total}
        filteredCount={items.length}
      />

      {loading && items.length === 0 ? (
        <div className="rounded border border-stroke overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <SkeletonTableRows rows={5} cols={8} />
            </tbody>
          </table>
        </div>
      ) : !loading && items.length === 0 ? (
        <div className="rounded border border-stroke bg-surface-card">
          <EmptyState
            icon={Package}
            title="No products found"
            subtitle={debouncedSearch || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'No products match the current filters. Try clearing them.'
              : 'No products yet. Add inventory to get started.'}
          />
        </div>
      ) : (
        <>
          <StockTable
            items={items}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onRowClick={(item: StockItem) => navigate(`/inventory/${item.id}`)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs text-ink-muted tabular-nums">
                Page {page} of {totalPages} · {total} total
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={cn(
                    'h-input px-3 rounded border border-stroke text-xs transition-colors duration-fast',
                    page <= 1
                      ? 'text-ink-muted/40 cursor-not-allowed'
                      : 'text-ink-dim hover:bg-surface-hover hover:text-ink'
                  )}
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={cn(
                    'h-input px-3 rounded border border-stroke text-xs transition-colors duration-fast',
                    page >= totalPages
                      ? 'text-ink-muted/40 cursor-not-allowed'
                      : 'text-ink-dim hover:bg-surface-hover hover:text-ink'
                  )}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
