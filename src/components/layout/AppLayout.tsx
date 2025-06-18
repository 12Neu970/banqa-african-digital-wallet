
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-4">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
