import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded text-sm font-medium transition-colors duration-fast focus-visible:ring-1 focus-visible:ring-stroke-focus disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        primary:   'bg-accent-blue text-white hover:bg-accent-blue-dim',
        secondary: 'border border-stroke bg-transparent text-ink hover:bg-surface-hover',
        tertiary:  'bg-transparent text-accent-blue hover:underline',
        ghost:     'bg-transparent text-ink-dim hover:bg-surface-hover hover:text-ink',
        danger:    'bg-status-error text-white hover:bg-status-error/90',
      },
      size: {
        default: 'h-btn px-3',
        sm:      'h-7 px-2 text-xs',
        icon:    'h-btn w-btn p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
