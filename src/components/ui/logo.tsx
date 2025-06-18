
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* African-inspired geometric logo */}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Outer circle representing unity and wholeness */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 opacity-90"></div>
        
        {/* Inner triangular pattern inspired by African textiles and unity */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tl from-green-500 via-emerald-600 to-teal-700 flex items-center justify-center">
          {/* Central diamond representing prosperity and stability */}
          <div className="w-2 h-2 bg-white rounded-sm transform rotate-45 shadow-sm"></div>
        </div>
        
        {/* Subtle African pattern overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
      
      {showText && (
        <span className={cn(
          'font-bold bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 bg-clip-text text-transparent',
          textSizeClasses[size]
        )}>
          Banqa
        </span>
      )}
    </div>
  );
}
