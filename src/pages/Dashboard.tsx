import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Wallet, Zap, Receipt } from 'lucide-react';
import { AfricanPattern } from '@/components/ui/african-pattern';

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 relative overflow-hidden">
        <AfricanPattern variant="kente" opacity={0.05} />
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                Welcome to Banqa
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Africa's most advanced digital bank, powered by AI and blockchain technology
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/real-time-wallet">
              <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-200 mb-2">Real-Time Banking</h3>
                  <p className="text-slate-400">Real bank accounts & crypto wallets with instant updates</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/advanced-dashboard">
              <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-200 mb-2">Advanced Features</h3>
                  <p className="text-slate-400">AI advisor, investments & bureau de change</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/bills">
              <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-200 mb-2">Pay Bills</h3>
                  <p className="text-slate-400">Airtime, data, electricity & more</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">Total Balance</span>
                  <span className="text-2xl font-bold text-white">₦1,250,000</span>
                  <span className="text-green-400 text-sm">+2.5% this week</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">Savings</span>
                  <span className="text-2xl font-bold text-white">₦450,000</span>
                  <span className="text-green-400 text-sm">+5.2% this month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">Investments</span>
                  <span className="text-2xl font-bold text-white">₦320,000</span>
                  <span className="text-green-400 text-sm">+12.7% this month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm">Crypto</span>
                  <span className="text-2xl font-bold text-white">₦180,000</span>
                  <span className="text-red-400 text-sm">-3.1% this week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-200 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-amber-500/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400">↓</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Salary Deposit</p>
                      <p className="text-slate-400 text-sm">Today, 10:45 AM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">+₦350,000</p>
                    <p className="text-slate-400 text-sm">Completed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-amber-500/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-red-400">↑</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Rent Payment</p>
                      <p className="text-slate-400 text-sm">Yesterday, 2:30 PM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-medium">-₦120,000</p>
                    <p className="text-slate-400 text-sm">Completed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-amber-500/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400">↑</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Bitcoin Purchase</p>
                      <p className="text-slate-400 text-sm">Jan 15, 9:15 AM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-medium">-₦50,000</p>
                    <p className="text-slate-400 text-sm">Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
