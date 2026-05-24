import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAlertsStore } from '@/store/alerts.store';
import { relTime } from '@/lib/dates';
import { cn } from '@/lib/cn';
import type { AlertSeverity } from '@/types/inventory.types';

const DOT: Record<AlertSeverity, string> = {
  critical: 'bg-status-error',
  warning:  'bg-status-warning',
  info:     'bg-status-info',
};

const LABEL: Record<AlertSeverity, string> = {
  critical: 'text-status-error',
  warning:  'text-status-warning',
  info:     'text-status-info',
};

export function AlertsPanel() {
  const alerts = useAlertsStore((s) => s.alerts);
  const acknowledge = useAlertsStore((s) => s.acknowledge);

  const active = [...alerts]
    .filter((a) => !a.isAcknowledged)
    .sort((a, b) => {
      const ord: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
      return ord[a.severity] - ord[b.severity];
    })
    .slice(0, 7);

  return (
    <div className="rounded border border-stroke bg-surface-card flex flex-col">
      <div className="flex items-center justify-between border-b border-stroke px-4 py-3 shrink-0">
        <span className="label-caps">Active Alerts</span>
        <NavLink to="/alerts" className="text-xs text-accent-blue hover:underline transition-colors">
          View all
        </NavLink>
      </div>

      {active.length === 0 ? (
        <p className="px-4 py-5 text-sm text-ink-muted">
          No active alerts. Last checked moments ago.
        </p>
      ) : (
        <div className="divide-y divide-stroke overflow-y-auto">
          {active.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors duration-fast">
              <div className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', DOT[alert.severity])} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink leading-snug">{alert.message}</p>
                <p className={cn('mt-0.5 text-xs font-medium', LABEL[alert.severity])}>
                  {alert.severity.toUpperCase()}
                  <span className="text-ink-muted font-normal"> · {relTime(alert.timestamp)}</span>
                </p>
              </div>
              <button
                onClick={() => acknowledge(alert.id, 'current-user')}
                className="mt-0.5 shrink-0 text-ink-muted hover:text-ink transition-colors duration-fast"
                title="Acknowledge"
                aria-label="Acknowledge alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
