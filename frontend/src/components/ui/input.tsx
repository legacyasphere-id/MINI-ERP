import * as React from 'react';
import { cn } from '@/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'h-input w-full rounded border border-stroke bg-surface-base px-3 text-sm text-ink',
        'placeholder:text-ink-muted',
        'focus:border-stroke-focus focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'transition-colors duration-fast',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
