
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Plus, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BankAccount {
  id: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
  currency: string;
  balance: number;
  is_active: boolean;
}

interface BankAccountCardProps {
  onTopUp: (accountId: string) => void;
}

export function BankAccountCard({ onTopUp }: BankAccountCardProps) {
  const { user } = useAuth();
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBankAccount();
    }
  }, [user]);

  useEffect(() => {
    if (user && bankAccount) {
      const cleanup = setupRealtimeSubscription();
      return cleanup;
    }
  }, [user, bankAccount]);

  const fetchBankAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching bank account:', error);
        throw error;
      }
      
      setBankAccount(data);
    } catch (error) {
      console.error('Error fetching bank account:', error);
      toast.error('Failed to load bank account');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channelName = `bank-account-updates-${user?.id}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bank_accounts',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Bank account update received:', payload);
          setBankAccount(payload.new as BankAccount);
          toast.success('Account balance updated!');
        }
      )
      .subscribe((status) => {
        console.log('Bank account subscription status:', status);
      });

    return () => {
      console.log('Cleaning up bank account subscription');
      supabase.removeChannel(channel);
    };
  };

  const copyAccountNumber = () => {
    if (bankAccount?.account_number) {
      navigator.clipboard.writeText(bankAccount.account_number);
      toast.success('Account number copied!');
    }
  };

  const formatBalance = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      NGN: '₦',
      KES: 'KSh',
      GHS: 'GH₵',
      ZAR: 'R',
      USD: '$'
    };
    
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/20">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-blue-500/20 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-blue-500/20 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bankAccount) {
    return (
      <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/20">
        <CardContent className="p-6 text-center">
          <p className="text-red-200 mb-4">No bank account found</p>
          <p className="text-slate-400 text-sm">
            Your bank account will be created automatically. Please refresh the page or contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/20 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-200 text-lg">
            {bankAccount.bank_name}
          </CardTitle>
          <Badge variant="outline" className="border-blue-500/20 text-blue-200">
            {bankAccount.currency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        <div>
          <p className="text-slate-400 text-sm mb-1">Account Name</p>
          <p className="text-white font-medium">{bankAccount.account_name}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm mb-1">Account Number</p>
          <div className="flex items-center gap-2">
            <p className="text-white font-mono text-lg">{bankAccount.account_number}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAccountNumber}
              className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Available Balance</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="h-6 w-6 p-0 text-slate-400"
            >
              {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-2xl font-bold text-white mb-4">
            {balanceVisible 
              ? formatBalance(bankAccount.balance, bankAccount.currency)
              : '****'
            }
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onTopUp(bankAccount.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Top Up
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-500/20 text-blue-200"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Transfer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
