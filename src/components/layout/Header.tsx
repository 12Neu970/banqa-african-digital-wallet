
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/logo';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-gradient-to-r from-slate-900/95 via-amber-900/10 to-slate-900/95 backdrop-blur-sm border-b border-amber-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard">
            <Logo size="md" />
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-amber-200 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-amber-200 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-amber-200 hidden md:block">
                {user?.user_metadata?.first_name || 'Ubuntu Member'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="text-slate-300 hover:text-amber-200 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 hidden md:block"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
