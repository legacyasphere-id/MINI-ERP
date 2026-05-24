import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  ClipboardList,
  Bell,
  Truck,
  BarChart2,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAlertsStore } from '@/store/alerts.store';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/inventory',  label: 'Stock List',       icon: Package },
  { to: '/movement',   label: 'Movement',         icon: ArrowLeftRight },
  { to: '/orders',     label: 'Purchase Orders',  icon: ClipboardList },
  { to: '/alerts',     label: 'Alerts',           icon: Bell, badge: true },
  { to: '/suppliers',  label: 'Suppliers',        icon: Truck },
  { to: '/analytics',  label: 'Analytics',        icon: BarChart2 },
  { to: '/settings',   label: 'Settings',         icon: Settings },
];

export function Sidebar() {
  const alertCount = useAlertsStore((s) => s.unacknowledgedCount());

  return (
    <aside className="flex w-sidebar shrink-0 flex-col bg-surface-sidebar border-r border-stroke">
      {/* Wordmark */}
      <div className="flex h-topbar items-center border-b border-stroke px-5">
        <span className="font-heading text-base font-bold tracking-tight text-ink">
          Inventory
          <span className="text-accent-blue">OS</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group flex h-row items-center gap-3 px-4 text-sm transition-colors duration-fast',
                isActive
                  ? 'bg-accent-blue/15 text-accent-blue border-r-2 border-accent-blue'
                  : 'text-ink-dim hover:bg-surface-hover hover:text-ink'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-fast',
                    isActive ? 'text-accent-blue' : 'text-ink-muted group-hover:text-ink-dim'
                  )}
                  aria-hidden
                />
                <span className="flex-1 leading-none">{label}</span>
                {badge && alertCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-status-error px-1 text-2xs font-semibold text-white tabular-nums">
                    {alertCount > 99 ? '99+' : alertCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User strip */}
      <div className="border-t border-stroke px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-accent-blue/20 text-accent-blue text-xs font-semibold select-none">
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-ink leading-none">J. Davis</p>
            <p className="truncate text-2xs text-ink-muted leading-tight mt-0.5">Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
