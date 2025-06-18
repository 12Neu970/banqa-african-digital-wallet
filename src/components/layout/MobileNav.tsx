
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, Smartphone, Briefcase, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Wallet', href: '/wallet' },
  { icon: CreditCard, label: 'Cards', href: '/cards' },
  { icon: Smartphone, label: 'Bills', href: '/bills' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: Users, label: 'Savings', href: '/savings' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = location.pathname === href;
          
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
