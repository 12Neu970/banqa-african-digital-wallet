
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, Receipt, Briefcase, PiggyBank, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: CreditCard, label: 'Cards', path: '/cards' },
    { icon: Receipt, label: 'Bills', path: '/bills' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: PiggyBank, label: 'Savings', path: '/savings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-600/20 text-blue-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              )}
            >
              <item.icon className={cn('h-5 w-5 mb-1', isActive && 'text-blue-400')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
