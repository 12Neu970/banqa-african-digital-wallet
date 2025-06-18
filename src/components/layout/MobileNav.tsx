
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, Receipt, Briefcase, PiggyBank, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Boma', path: '/dashboard', meaning: 'Home' },
    { icon: Wallet, label: 'Mali', path: '/wallet', meaning: 'Wealth' },
    { icon: CreditCard, label: 'Kadi', path: '/cards', meaning: 'Cards' },
    { icon: Receipt, label: 'Bili', path: '/bills', meaning: 'Bills' },
    { icon: Briefcase, label: 'Kazi', path: '/jobs', meaning: 'Work' },
    { icon: PiggyBank, label: 'Akiba', path: '/savings', meaning: 'Savings' },
    { icon: User, label: 'Mimi', path: '/profile', meaning: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-amber-900/20 to-slate-900/95 backdrop-blur-sm border-t border-amber-500/20 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-300 relative group',
                isActive 
                  ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-600/20 text-amber-200 border border-amber-500/30' 
                  : 'text-slate-400 hover:text-amber-200 hover:bg-amber-500/10'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5 mb-1 transition-all duration-300', 
                isActive && 'text-amber-300 scale-110'
              )} />
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Cultural tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-amber-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item.meaning}
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Ubuntu Unity Indicator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-amber-400 to-red-600 rounded-full shadow-lg animate-pulse"></div>
    </nav>
  );
}
