
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Plus, Send, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { DepositModal } from '@/components/wallet/DepositModal';
import { SendMoneyModal } from '@/components/wallet/SendMoneyModal';
import { AfricanPattern } from '@/components/ui/african-pattern';

interface Wallet {
  id: string;
  currency: string;
  balance: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description: string;
  created_at: string;
  status: string;
}

export default function Wallet() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

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
        .select('id, currency, balance')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, type, amount, currency, description, created_at, status')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      NGN: '₦',
      KES: 'KSh',
      GHS: 'GH₵',
      ZAR: 'R',
      USD: '$',
      USDT: '₮'
    };
    
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) {
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-red-500" />;
  };

  const handleRefresh = () => {
    fetchWallets();
    fetchTransactions();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center">
          <div className="text-amber-200">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 relative overflow-hidden">
        <AfricanPattern variant="kente" opacity={0.05} />
        
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              My Wallets
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-slate-300 hover:text-amber-200"
            >
              {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          {/* Wallet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-amber-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-amber-200 text-sm font-medium">
                    {wallet.currency} Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-white">
                      {balanceVisible 
                        ? formatCurrency(wallet.balance, wallet.currency)
                        : '****'
                      }
                    </div>
                    <div className="flex gap-2">
                      <DepositModal onSuccess={handleRefresh} />
                      <SendMoneyModal onSuccess={handleRefresh} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Transactions */}
          <Card className="bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-amber-200">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No transactions yet</p>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-amber-500/10"
                    >
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type, transaction.amount)}
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-slate-400 text-sm">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.amount > 0 ? '+' : ''}
                          {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
                        </p>
                        <p className="text-slate-400 text-sm capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
