import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionUrl,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-gray-200 rounded-sm bg-gray-50/50", className)}>
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>

      {actionLabel && actionUrl && (
        <Link
          href={actionUrl}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}