import { cn } from '@/lib/cn';

interface QueryErrorHandlerProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
  message?: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Failed to load data.';
}

export function QueryErrorHandler({ error, onRetry, className, message }: QueryErrorHandlerProps) {
  const displayMsg = message ?? getErrorMessage(error);
  return (
    <div className={cn('flex flex-col items-center gap-2 py-10 text-center', className)}>
      <p className="text-sm text-status-error">{displayMsg}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded px-1"
        >
          Retry
        </button>
      )}
    </div>
  );
}
