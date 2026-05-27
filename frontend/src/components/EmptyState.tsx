import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 py-12 text-center', className)}>
      {Icon && (
        <Icon className="mb-1 h-8 w-8 text-ink-muted/30" strokeWidth={1.5} />
      )}
      <p className="text-sm font-medium text-ink-muted">{title}</p>
      {subtitle && (
        <p className="max-w-xs text-xs text-ink-muted/60">{subtitle}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 text-xs text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded px-1"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
