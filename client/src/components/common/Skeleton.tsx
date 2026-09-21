import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-zinc-200/80', className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-subtle p-4">
      <Skeleton className="w-full aspect-[4/3] rounded-xl mb-4" />
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="w-20 h-4 rounded-md" />
        <Skeleton className="w-12 h-4 rounded-md" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded-md mb-3" />
      <div className="flex justify-between items-center mt-auto pt-2">
        <Skeleton className="w-24 h-6 rounded-md" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 6 }) => {
  return (
    <tr className="border-b border-zinc-100">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="p-4">
          <Skeleton className="w-full h-5 rounded-md" />
        </td>
      ))}
    </tr>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-subtle flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="w-28 h-4 rounded-md" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-32 h-8 rounded-lg" />
      <Skeleton className="w-24 h-3 rounded-md" />
    </div>
  );
};
