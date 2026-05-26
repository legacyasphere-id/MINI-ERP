import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
}

// Base primitive — animated shimmer block
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded bg-surface-hover', className)} />;
}

// Table rows — renders <tr> elements, place inside <tbody>
export function SkeletonTableRows({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  const widths = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-4/5'];
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-stroke">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-3 py-2.5">
              <Skeleton className={cn('h-3.5', widths[(r + c) % widths.length])} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Single KPI card skeleton — matches KPICard height
export function SkeletonKPICard() {
  return (
    <div className="rounded border border-stroke bg-surface-card px-4 py-3 flex flex-col gap-2.5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-14" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

// Single list item skeleton — matches alert row height
export function SkeletonListItem() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-stroke last:border-b-0">
      <Skeleton className="mt-1.5 h-2 w-2 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// Complete bordered list skeleton with N rows
export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded border border-stroke overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  );
}
