
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Banqa
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-slate-300 hidden md:block">
                {user?.user_metadata?.first_name || 'User'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="text-slate-300 hover:text-white hover:bg-slate-800 hidden md:block"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
