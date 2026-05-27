import { Search, RefreshCw, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useMe, useLogout } from '@/hooks/useAuth';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/inventory':  'Stock List',
  '/movement':   'Stock Movement',
  '/orders':     'Purchase Orders',
  '/alerts':     'Alerts Center',
  '/suppliers':  'Suppliers',
  '/analytics':  'Analytics',
  '/settings':   'Settings',
};

export function Header() {
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [lastSync] = useState('2 min ago');
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: user } = useMe();
  const logout = useLogout();

  // [/] to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        searchRef.current?.blur();
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const title = PAGE_TITLES[pathname] ?? 'InventoryOS';

  return (
    <header className="flex h-topbar shrink-0 items-center gap-4 border-b border-stroke bg-surface-sidebar px-4">
      {/* Page title */}
      <h1 className="font-heading text-md font-semibold text-ink leading-none shrink-0">
        {title}
      </h1>

      <div className="w-px h-4 bg-stroke mx-1 shrink-0" aria-hidden />

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted pointer-events-none"
          aria-hidden
        />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search SKU, name… [/]"
          aria-label="Search"
          className={cn(
            'h-input w-full rounded bg-surface-base pl-8 pr-3 text-sm text-ink',
            'border border-stroke placeholder:text-ink-muted',
            'focus:border-stroke-focus focus:outline-none',
            'transition-colors duration-fast'
          )}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Sync indicator */}
      <button
        className="flex items-center gap-1.5 text-ink-muted hover:text-ink-dim transition-colors duration-fast"
        title="Last synced"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        <span className="text-xs tabular-nums">{lastSync}</span>
      </button>

      {/* User + logout */}
      {user && (
        <div className="flex items-center gap-2 border-l border-stroke pl-3">
          <div className="text-right">
            <p className="text-xs font-medium text-ink leading-none">{user.name}</p>
            <p className="text-2xs text-ink-muted leading-none mt-0.5">{user.role}</p>
          </div>
          <button
            onClick={() => logout.mutate()}
            aria-label="Sign out"
            title="Sign out"
            className="rounded p-1.5 text-ink-muted hover:bg-surface-hover hover:text-ink transition-colors duration-fast"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}
    </header>
  );
}
