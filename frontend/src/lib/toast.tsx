import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error:   (message: string) => void;
  warning: (message: string) => void;
  info:    (message: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION: Record<ToastType, number> = {
  success: 3500,
  info:    3500,
  warning: 4000,
  error:   5000,
};

const STYLE: Record<ToastType, string> = {
  success: 'border-l-status-ok   bg-status-ok/10   text-status-ok',
  error:   'border-l-status-error  bg-status-error/10  text-status-error',
  warning: 'border-l-status-warning bg-status-warning/10 text-status-warning',
  info:    'border-l-status-info  bg-status-info/10  text-status-info',
};

// ─── Provider + Container ─────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { id, type, message }]); // max 3
    const timer = setTimeout(() => dismiss(id), DURATION[type]);
    timers.current.set(id, timer);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (m) => add('success', m),
    error:   (m) => add('error',   m),
    warning: (m) => add('warning', m),
    info:    (m) => add('info',    m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              role="alert"
              className={cn(
                'flex items-start gap-2 rounded border border-l-4 border-stroke px-3 py-2.5 shadow-lg',
                'bg-surface-card',
                STYLE[t.type],
                'animate-in slide-in-from-right-5 duration-200'
              )}
            >
              <p className="flex-1 text-xs text-ink leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="mt-0.5 shrink-0 text-ink-muted hover:text-ink transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
