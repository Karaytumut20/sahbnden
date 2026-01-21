import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export default function Button({
  children,
  isLoading,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {

  const baseStyles = "font-bold rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 shadow-sm",
    secondary: "bg-[#ffe800] text-black hover:bg-yellow-400 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {!isLoading && icon}
      {children}
    </button>
  );
}