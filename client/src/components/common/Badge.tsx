import React from 'react';
import { cn } from '../../lib/utils';
import { ProductStatus } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-zinc-900 text-white border-transparent',
    secondary: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    neutral: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    outline: 'bg-transparent text-zinc-700 border-zinc-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    accent: 'bg-accent-50 text-accent-700 border-accent-200/60',
  };

  const sizes = {
    sm: 'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium border leading-none transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ProductStatus; className?: string }> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge variant="success" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Active
        </Badge>
      );
    case 'DRAFT':
      return (
        <Badge variant="warning" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Draft
        </Badge>
      );
    case 'OUT_OF_STOCK':
      return (
        <Badge variant="danger" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
          Out of Stock
        </Badge>
      );
    case 'ARCHIVED':
      return (
        <Badge variant="secondary" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-1.5" />
          Archived
        </Badge>
      );
    default:
      return <Badge size="sm">{status}</Badge>;
  }
};

export const StockBadge: React.FC<{ stock: number; className?: string }> = ({ stock, className }) => {
  if (stock === 0) {
    return (
      <Badge variant="danger" size="sm" className={className}>
        Out of Stock
      </Badge>
    );
  }
  if (stock <= 5) {
    return (
      <Badge variant="warning" size="sm" className={className}>
        Only {stock} Left
      </Badge>
    );
  }
  return (
    <Badge variant="success" size="sm" className={className}>
      In Stock ({stock})
    </Badge>
  );
};
