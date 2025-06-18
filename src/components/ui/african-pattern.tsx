
import React from 'react';
import { cn } from '@/lib/utils';

interface AfricanPatternProps {
  className?: string;
  variant?: 'kente' | 'mudcloth' | 'adinkra';
  opacity?: number;
}

export function AfricanPattern({ className, variant = 'kente', opacity = 0.1 }: AfricanPatternProps) {
  const patterns = {
    kente: (
      <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
        <defs>
          <pattern id="kente" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#FFB800"/>
            <rect width="10" height="10" fill="#FF8C00"/>
            <rect x="10" y="10" width="10" height="10" fill="#FF8C00"/>
            <path d="M0,0 L20,20 M0,20 L20,0" stroke="#B45309" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kente)"/>
      </svg>
    ),
    mudcloth: (
      <svg width="80" height="80" viewBox="0 0 80 80" className="w-full h-full">
        <defs>
          <pattern id="mudcloth" patternUnits="userSpaceOnUse" width="40" height="40">
            <rect width="40" height="40" fill="#8B4513"/>
            <circle cx="20" cy="20" r="8" fill="none" stroke="#D2691E" strokeWidth="2"/>
            <path d="M5,5 L35,35 M5,35 L35,5" stroke="#D2691E" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mudcloth)"/>
      </svg>
    ),
    adinkra: (
      <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <pattern id="adinkra" patternUnits="userSpaceOnUse" width="50" height="50">
            <rect width="50" height="50" fill="#2D5016"/>
            <path d="M25,10 L40,25 L25,40 L10,25 Z" fill="none" stroke="#90EE90" strokeWidth="2"/>
            <circle cx="25" cy="25" r="3" fill="#90EE90"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adinkra)"/>
      </svg>
    )
  };

  return (
    <div 
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ opacity }}
    >
      {patterns[variant]}
    </div>
  );
}
