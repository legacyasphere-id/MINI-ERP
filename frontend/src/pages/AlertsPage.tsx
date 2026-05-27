import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAlertsStore } from '@/store/alerts.store';
import { SkeletonList } from '@/components/SkeletonLoader';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/lib/toast';
import { CheckCircle2, History } from 'lucide-react';
import { relTime } from '@/lib/dates';
import { cn } from '@/lib/cn';
import type { Alert, AlertSeverity, AlertType } from '@/types/inventory.types';

const SEV_ORDER: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };

const SEV_CONFIG: Record<AlertSeverity, { dot: string; label: string; text: string; borderL: string }> = {
  critical: { dot: 'bg-status-error',   label: 'CRITICAL', text: 'text-status-error',   borderL: 'border-l-status-error'   },
  warning:  { dot: 'bg-status-warning', label: 'WARNING',  text: 'text-status-warning', borderL: 'border-l-status-warning' },
  info:     { dot: 'bg-status-info',    label: 'INFO',     text: 'text-status-info',    borderL: 'border-l-status-info'    },
};

const TYPE_LABEL: Record<AlertType, string> = {
  low_stock:         'Low Stock',
  discrepancy:       'Discrepancy',
  overdue_po:        'Overdue PO',
  receiving_pending: 'Receiving Pending',
};

const CURRENT_OPERATOR = 'current-user';

type Tab = 'active' | 'history';

function AlertModal({ alert, onClose, onAcknowledge }: {
  alert: Alert;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}) {
  const cfg = SEV_CONFIG[alert.severity];
  const navigate = useNavigate();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full max-w-lg mx-4 rounded border border-stroke bg-surface-card shadow-2xl',
          'border-l-4', cfg.borderL
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-5 py-3">
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', cfg.dot)} />
            <span className={cn('text-xs font-semibold tracking-wide', cfg.text)}>
              {cfg.label}
            </span>
            <span className="text-xs text-ink-muted">·</span>
            <span className="text-xs text-ink-muted">{TYPE_LABEL[alert.type]}</span>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink transition-colors duration-fast"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-ink leading-relaxed">{alert.message}</p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="label-caps text-ink-muted">Raised</p>
              <p className="mt-0.5 text-xs text-ink">{relTime(alert.timestamp)}</p>
            </div>

            {alert.sku && (
              <div>
                <p className="label-caps text-ink-muted">SKU</p>
                <p className="mt-0.5 sku">{alert.sku}</p>
                <p className="text-xs text-ink-muted truncate">{alert.skuName}</p>
              </div>
            )}

            {alert.poId && (
              <div>
                <p className="label-caps text-ink-muted">Purchase Order</p>
                <p className="mt-0.5 sku">{alert.poId.toUpperCase()}</p>
              </div>
            )}

            {alert.isAcknowledged && alert.acknowledgedBy && (
              <div>
                <p className="label-caps text-ink-muted">Acknowledged By</p>
                <p className="mt-0.5 text-xs text-ink">{alert.acknowledgedBy}</p>
                {alert.acknowledgedAt && (
                  <p className="text-xs text-ink-muted">{relTime(alert.acknowledgedAt)}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-stroke px-5 py-3">
          {alert.skuId && alert.sku ? (
            <button
              onClick={() => { onClose(); navigate(`/inventory/${alert.skuId}`); }}
              className="flex items-center gap-1.5 text-xs text-accent-blue hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View {alert.sku}
            </button>
          ) : <span />}

          <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className={cn(
              'h-input px-4 rounded border border-stroke text-sm text-ink-dim',
              'hover:text-ink hover:border-stroke-focus transition-colors duration-fast'
            )}
          >
            Dismiss
          </button>
          {!alert.isAcknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="h-input px-4 rounded bg-accent-blue text-sm text-white font-medium hover:opacity-90 transition-opacity duration-fast"
            >
              Acknowledge
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsPage() {
  const alerts    = useAlertsStore((s) => s.alerts);
  const hydrated  = useAlertsStore((s) => s.hydrated);
  const acknowledge = useAlertsStore((s) => s.acknowledge);
  const [tab, setTab] = useState<Tab>('active');
  const [selected, setSelected] = useState<Alert | null>(null);

  const active = [...alerts]
    .filter((a) => !a.isAcknowledged)
    .sort(
      (a, b) =>
        SEV_ORDER[a.severity] - SEV_ORDER[b.severity] ||
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const history = [...alerts]
    .filter((a) => a.isAcknowledged)
    .sort(
      (a, b) =>
        new Date(b.acknowledgedAt ?? b.timestamp).getTime() -
        new Date(a.acknowledgedAt ?? a.timestamp).getTime()
    );

  const displayed = tab === 'active' ? active : history;

  const toast = useToast();

  const handleAcknowledge = useCallback(
    (id: string) => {
      acknowledge(id, CURRENT_OPERATOR);
      setSelected(null);
      toast.success('Alert acknowledged');
    },
    [acknowledge, toast]
  );

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Page header */}
        <div>
          <h1 className="heading">Alerts Center</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {active.length > 0
              ? `${active.length} unacknowledged alert${active.length !== 1 ? 's' : ''} — click to review.`
              : 'All alerts acknowledged. System nominal.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-stroke">
          {([
            ['active',  'Active',  active.length]  as const,
            ['history', 'History', history.length] as const,
          ]).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-fast',
                tab === key
                  ? 'border-accent-blue text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink-dim'
              )}
            >
              {label}
              <span
                className={cn(
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-2xs font-medium',
                  key === 'active' && count > 0
                    ? 'bg-status-error/20 text-status-error'
                    : 'bg-surface-hover text-ink-muted'
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {!hydrated ? (
          <SkeletonList rows={5} />
        ) : displayed.length === 0 ? (
          <div className="rounded border border-stroke bg-surface-card">
            {tab === 'active' ? (
              <EmptyState
                icon={CheckCircle2}
                title="All clear"
                subtitle="No critical or warning alerts right now. System nominal."
              />
            ) : (
              <EmptyState
                icon={History}
                title="No acknowledged alerts yet"
                subtitle="Acknowledged alerts will appear here for audit reference."
              />
            )}
          </div>
        ) : (
          <div className="rounded border border-stroke overflow-hidden">
            <div className="divide-y divide-stroke">
              {displayed.map((alert) => {
                const cfg = SEV_CONFIG[alert.severity];
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelected(alert)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors duration-fast text-left group"
                  >
                    <div className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', cfg.dot)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink leading-snug">{alert.message}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <span className={cn('text-2xs font-semibold', cfg.text)}>{cfg.label}</span>
                        <span className="text-2xs text-ink-muted">·</span>
                        <span className="text-2xs text-ink-muted">{TYPE_LABEL[alert.type]}</span>
                        {alert.sku && (
                          <>
                            <span className="text-2xs text-ink-muted">·</span>
                            <span className="sku text-2xs">{alert.sku}</span>
                          </>
                        )}
                        <span className="text-2xs text-ink-muted">·</span>
                        <span className="text-2xs text-ink-muted">{relTime(alert.timestamp)}</span>
                        {tab === 'history' && alert.acknowledgedBy && (
                          <>
                            <span className="text-2xs text-ink-muted">·</span>
                            <span className="text-2xs text-ink-muted">
                              Acked by {alert.acknowledgedBy}
                              {alert.acknowledgedAt && ` · ${relTime(alert.acknowledgedAt)}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted transition-colors duration-fast group-hover:text-ink-dim" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <AlertModal
          alert={selected}
          onClose={handleClose}
          onAcknowledge={handleAcknowledge}
        />
      )}
    </>
  );
}
