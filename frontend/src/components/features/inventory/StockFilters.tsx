import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { StockStatus } from '@/types/inventory.types';

const STATUS_TABS: { value: StockStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'critical',  label: 'Critical'  },
  { value: 'low',       label: 'Low Stock' },
  { value: 'ok',        label: 'OK'        },
  { value: 'overstock', label: 'Overstock' },
];

interface StockFiltersProps {
  search: string;
  onSearch: (v: string) => void;
  status: StockStatus | 'all';
  onStatus: (v: StockStatus | 'all') => void;
  category: string;
  onCategory: (v: string) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
}

export function StockFilters({
  search, onSearch,
  status, onStatus,
  category, onCategory,
  categories,
  totalCount, filteredCount,
}: StockFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative w-56">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="SKU or name…"
          aria-label="Search by SKU or name"
          className={cn(
            'h-input w-full rounded border border-stroke bg-surface-base pl-8 pr-3 text-sm text-ink',
            'placeholder:text-ink-muted',
            'focus:border-stroke-focus focus:outline-none',
            'transition-colors duration-fast'
          )}
        />
      </div>

      {/* Status tabs */}
      <div role="group" aria-label="Filter by stock status" className="flex overflow-hidden rounded border border-stroke">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatus(tab.value)}
            aria-pressed={status === tab.value}
            className={cn(
              'h-input border-r border-stroke px-3 text-xs font-medium transition-colors duration-fast last:border-r-0',
              status === tab.value
                ? 'bg-accent-blue text-white'
                : 'bg-surface-card text-ink-dim hover:bg-surface-hover hover:text-ink'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        aria-label="Filter by category"
        className={cn(
          'h-input rounded border border-stroke bg-surface-card px-3 text-sm text-ink',
          'focus:border-stroke-focus focus:outline-none',
          'transition-colors duration-fast'
        )}
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Result count */}
      <span className="ml-auto text-xs text-ink-muted tabular-nums">
        {filteredCount === totalCount
          ? `${totalCount} items`
          : `${filteredCount} / ${totalCount}`}
      </span>
    </div>
  );
}
