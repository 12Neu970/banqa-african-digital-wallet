
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, Smartphone, TrendingUp, Plus, Send, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Dashboard() {
  const { user } = useAuth();

  const quickActions = [
    { icon: Plus, label: 'Add Money', color: 'bg-green-500' },
    { icon: Send, label: 'Send Money', color: 'bg-blue-500' },
    { icon: Smartphone, label: 'Pay Bills', color: 'bg-purple-500' },
    { icon: CreditCard, label: 'Get Card', color: 'bg-orange-500' },
  ];

  const wallets = [
    { currency: 'NGN', balance: '₦125,450.00', flag: '🇳🇬' },
    { currency: 'KES', balance: 'KSh 15,230.50', flag: '🇰🇪' },
    { currency: 'USDT', balance: '$850.25', flag: '💵' },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.first_name || 'User'}! 👋
          </h1>
          <p className="text-green-100 mb-4">
            Your financial journey continues. What would you like to do today?
          </p>
          <div className="flex items-center gap-2 text-green-100">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Portfolio up 12.5% this month</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col gap-2 border-2 hover:border-primary"
            >
              <div className={`p-2 rounded-full ${action.color}`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Wallets Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Wallets</CardTitle>
              <CardDescription>Manage your multi-currency balances</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Currency
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallets.map((wallet, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.flag}</span>
                  <div>
                    <p className="font-semibold">{wallet.currency}</p>
                    <p className="text-sm text-muted-foreground">{wallet.balance}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Received', amount: '+₦5,000', from: 'John Doe', time: '2 hours ago' },
                { type: 'Paid Bills', amount: '-₦2,500', from: 'NEPA Bills', time: '1 day ago' },
                { type: 'Card Payment', amount: '-$25.00', from: 'Netflix', time: '2 days ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.from}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
