
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Send, Download, History, Eye, EyeOff, Wallet as WalletIcon } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletData {
  id: string;
  currency: string;
  balance: number;
  locked_balance: number;
  is_active: boolean;
  created_at: string;
}

interface TransactionData {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  created_at: string;
}

export default function Wallet() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const currencyNames: Record<string, string> = {
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    GHS: 'Ghanaian Cedi',
    ZAR: 'South African Rand',
    XOF: 'West African CFA',
    USDT: 'Tether USD',
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound'
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
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast.error('Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    }
  };

  const formatBalance = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency] || '';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const calculateTotalUSD = () => {
    // Simple conversion - in production, you'd use real exchange rates
    const conversionRates: Record<string, number> = {
      NGN: 0.0012,
      KES: 0.0067,
      GHS: 0.082,
      ZAR: 0.055,
      XOF: 0.0016,
      USDT: 1,
      USD: 1,
      EUR: 1.1,
      GBP: 1.27
    };

    return wallets.reduce((total, wallet) => {
      const rate = conversionRates[wallet.currency] || 1;
      return total + (wallet.balance * rate);
    }, 0);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallets</h1>
            <p className="text-muted-foreground">Manage your multi-currency balances</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Currency
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Total Balance Card */}
            <Card className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Total Portfolio Value</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold">
                    {showBalance ? `$${calculateTotalUSD().toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                  </p>
                  <p className="text-green-100">Estimated USD value</p>
                </div>
              </CardContent>
            </Card>

            {/* Individual Wallets */}
            <div className="grid gap-4">
              {wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <Card key={wallet.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{currencyFlags[wallet.currency] || '💰'}</div>
                          <div>
                            <h3 className="font-semibold">{currencyNames[wallet.currency] || wallet.currency}</h3>
                            <p className="text-sm text-muted-foreground">{wallet.currency}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {showBalance ? formatBalance(wallet.balance, wallet.currency) : '••••••'}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Send className="h-3 w-3 mr-1" />
                              Send
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Receive
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <WalletIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Your wallets are being set up</p>
                    <p className="text-sm text-muted-foreground">This may take a moment for new accounts</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>View all your wallet transactions</CardDescription>
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
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            ['deposit', 'transfer'].includes(transaction.type) 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {formatBalance(transaction.amount, transaction.currency)}
                          </p>
                          <p className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Your transaction history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>Track your financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Analytics coming soon</p>
                  <p className="text-sm">Detailed portfolio insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
