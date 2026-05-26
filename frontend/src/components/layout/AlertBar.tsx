import { AlertTriangle, Info, X } from 'lucide-react';
import { useAlertsStore } from '@/store/alerts.store';
import { cn } from '@/lib/cn';

const SEVERITY_CONFIG = {
  critical: {
    bar: 'bg-status-error/10 border-status-error',
    icon: 'text-status-error',
    label: 'bg-status-error text-white',
    Icon: AlertTriangle,
  },
  warning: {
    bar: 'bg-status-warning/10 border-status-warning',
    icon: 'text-status-warning',
    label: 'bg-status-warning text-surface-base',
    Icon: AlertTriangle,
  },
  info: {
    bar: 'bg-status-info/10 border-status-info',
    icon: 'text-status-info',
    label: 'bg-status-info text-white',
    Icon: Info,
  },
};

export function AlertBar() {
  const topAlert = useAlertsStore((s) => s.topCritical());
  const unackedCount = useAlertsStore((s) => s.unacknowledgedCount());
  const acknowledge = useAlertsStore((s) => s.acknowledge);

  if (!topAlert) return null;

  const config = SEVERITY_CONFIG[topAlert.severity];
  const { Icon } = config;
  const remaining = unackedCount - 1;

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b px-4',
        'h-9 shrink-0 text-sm',
        config.bar
      )}
      role="alert"
    >
      <Icon className={cn('h-3.5 w-3.5 shrink-0', config.icon)} aria-hidden />

      <span
        className={cn(
          'label-caps shrink-0 rounded px-1.5 py-0.5 text-2xs font-semibold',
          config.label
        )}
      >
        {topAlert.severity}
      </span>

      <span className="truncate text-ink">{topAlert.message}</span>

      {remaining > 0 && (
        <span className="shrink-0 text-ink-muted">
          +{remaining} more
        </span>
      )}

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <button
          onClick={() => acknowledge(topAlert.id, 'current-user')}
          className="text-ink-dim hover:text-ink transition-colors duration-fast text-xs font-medium"
          title="Acknowledge [A]"
        >
          Acknowledge
        </button>
        <button
          onClick={() => acknowledge(topAlert.id, 'current-user')}
          className="text-ink-muted hover:text-ink transition-colors duration-fast"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
