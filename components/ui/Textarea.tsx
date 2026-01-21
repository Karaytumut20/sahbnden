import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-blue-500 text-sm transition-colors resize-none",
            error && "border-red-500 bg-red-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";