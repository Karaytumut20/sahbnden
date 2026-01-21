import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            {label}
          </label>
        )}
        <input
          className={cn(
            "w-full border border-gray-300 rounded-sm h-10 px-3 outline-none focus:border-blue-500 text-sm transition-colors",
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
Input.displayName = "Input";