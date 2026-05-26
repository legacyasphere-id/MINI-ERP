import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

type KPISeverity = 'critical' | 'warning' | 'ok' | 'neutral';

interface KPICardProps {
  label: string;
  value: number | string;
  subtext: string;
  severity?: KPISeverity;
  icon: LucideIcon;
}

const BORDER: Record<KPISeverity, string> = {
  critical: 'border-l-status-error',
  warning:  'border-l-status-warning',
  ok:       'border-l-status-ok',
  neutral:  'border-l-stroke',
};

const VALUE_COLOR: Record<KPISeverity, string> = {
  critical: 'text-status-error',
  warning:  'text-status-warning',
  ok:       'text-status-ok',
  neutral:  'text-ink',
};

const ICON_COLOR: Record<KPISeverity, string> = {
  critical: 'text-status-error/50',
  warning:  'text-status-warning/50',
  ok:       'text-status-ok/50',
  neutral:  'text-ink-muted',
};

export function KPICard({ label, value, subtext, severity = 'neutral', icon: Icon }: KPICardProps) {
  return (
    <div className={cn('rounded border border-stroke bg-surface-card p-4 border-l-2', BORDER[severity])}>
      <div className="flex items-start justify-between gap-2">
        <span className="label-caps leading-tight">{label}</span>
        <Icon className={cn('h-4 w-4 shrink-0 mt-px', ICON_COLOR[severity])} aria-hidden />
      </div>
      <div className={cn('mt-3 font-heading text-3xl font-bold tabular-nums leading-none', VALUE_COLOR[severity])}>
        {value}
      </div>
      <p className="mt-2 text-xs text-ink-muted leading-snug">{subtext}</p>
    </div>
  );
}
