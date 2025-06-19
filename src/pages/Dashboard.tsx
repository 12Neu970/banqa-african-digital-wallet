import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, Smartphone, TrendingUp, Plus, Send, ArrowUpRight, Brain, Shield, Users, Globe, Zap, Target } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface WalletData {
  id: string;
  currency: string;
  balance: number;
}

interface TransactionData {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  const quickActions = [
    { icon: Plus, label: 'Add Money', color: 'bg-green-500' },
    { icon: Send, label: 'Send Money', color: 'bg-blue-500' },
    { icon: Smartphone, label: 'Pay Bills', color: 'bg-purple-500' },
    { icon: CreditCard, label: 'Get Card', color: 'bg-orange-500' },
  ];

  const revolutionaryActions = [
    { icon: Brain, label: 'AI Advisor', color: 'bg-purple-500', description: 'Get personalized financial wisdom' },
    { icon: Globe, label: 'Bureau de Change', color: 'bg-green-500', description: 'Exchange currencies instantly' },
    { icon: TrendingUp, label: 'Smart Invest', color: 'bg-blue-500', description: 'AI-powered investments' },
    { icon: Shield, label: 'Biometric Security', color: 'bg-red-500', description: 'Advanced protection' },
    { icon: Users, label: 'Community Finance', color: 'bg-orange-500', description: 'Ubuntu savings circles' },
    { icon: Target, label: 'Financial Goals', color: 'bg-indigo-500', description: 'Achieve your dreams' },
  ];

  const currencySymbols: Record<string, string> = {
    NGN: '₦',
    KES: 'KSh',
    GHS: 'GH₵',
    ZAR: 'R',
    XOF: 'CFA',
    USDT: '$',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const currencyFlags: Record<string, string> = {
    NGN: '🇳🇬',
    KES: '🇰🇪',
    GHS: '🇬🇭',
    ZAR: '🇿🇦',
    XOF: '🇨🇮',
    USDT: '💵',
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧'
  };

  useEffect(() => {
    if (user) {
      fetchWallets();
      fetchTransactions();
    }
  }, [user]);

  const fetchWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast.error('Failed to load wallets');
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency] || '';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatTransactionAmount = (amount: number, currency: string, type: string) => {
    const symbol = currencySymbols[currency] || '';
    const prefix = ['deposit', 'transfer'].includes(type) ? '+' : '-';
    return `${prefix}${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.user_metadata?.first_name || 'Revolutionary'}! 🚀
            </h1>
            <p className="text-green-100 mb-4">
              Your Ubuntu financial revolution continues. Together we rise, together we prosper.
            </p>
            <div className="flex items-center gap-2 text-green-100">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Transforming Africa's Financial Future</span>
            </div>
          </div>
        </div>

        {/* Revolutionary Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Revolutionary Features
            </CardTitle>
            <CardDescription>Advanced technologies that surpass traditional banking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {revolutionaryActions.map((action, index) => (
                <Link key={index} to="/advanced-dashboard">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-2 hover:border-primary w-full"
                  >
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-center">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link to="/advanced-dashboard">
                <Button className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">
                  Explore All Features
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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
            {wallets.length > 0 ? (
              wallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currencyFlags[wallet.currency] || '💰'}</span>
                    <div>
                      <p className="font-semibold">{wallet.currency}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatBalance(wallet.balance, wallet.currency)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your wallets are being set up</p>
                <p className="text-sm">This may take a moment for new accounts</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description || 'Transaction'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        ['deposit', 'transfer'].includes(transaction.type) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formatTransactionAmount(transaction.amount, transaction.currency, transaction.type)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Start by adding money to your wallet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
