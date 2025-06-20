
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Plus, Send, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CryptoWallet {
  id: string;
  crypto_currency: string;
  wallet_address: string;
  balance: number;
  is_active: boolean;
}

interface CryptoWalletCardProps {
  onTopUp: (walletId: string, currency: string) => void;
  onCreateWallet: (currency: string) => void;
}

export function CryptoWalletCard({ onTopUp, onCreateWallet }: CryptoWalletCardProps) {
  const { user } = useAuth();
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const supportedCryptos = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', icon: '₮' },
    { symbol: 'USDC', name: 'USD Coin', icon: '$' },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'BNB' },
  ];

  useEffect(() => {
    if (user) {
      fetchCryptoWallets();
    }
  }, [user]);

  useEffect(() => {
    if (user && cryptoWallets.length > 0) {
      const cleanup = setupRealtimeSubscription();
      return cleanup;
    }
  }, [user, cryptoWallets.length]);

  const fetchCryptoWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching crypto wallets:', error);
        throw error;
      }
      
      setCryptoWallets(data || []);
    } catch (error) {
      console.error('Error fetching crypto wallets:', error);
      toast.error('Failed to load crypto wallets');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channelName = `crypto-wallets-updates-${user?.id}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crypto_wallets',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Crypto wallet update received:', payload);
          if (payload.eventType === 'INSERT') {
            setCryptoWallets(prev => [...prev, payload.new as CryptoWallet]);
            toast.success('New crypto wallet created!');
          } else if (payload.eventType === 'UPDATE') {
            setCryptoWallets(prev => 
              prev.map(wallet => 
                wallet.id === payload.new.id ? payload.new as CryptoWallet : wallet
              )
            );
            toast.success('Wallet balance updated!');
          }
        }
      )
      .subscribe((status) => {
        console.log('Crypto wallets subscription status:', status);
      });

    return () => {
      console.log('Cleaning up crypto wallets subscription');
      supabase.removeChannel(channel);
    };
  };

  const copyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Wallet address copied!');
  };

  const refreshBalances = async () => {
    setRefreshing(true);
    await fetchCryptoWallets();
    setRefreshing(false);
    toast.success('Balances refreshed!');
  };

  const formatBalance = (amount: number, currency: string) => {
    return `${amount.toFixed(8)} ${currency}`;
  };

  const getCryptoInfo = (symbol: string) => {
    return supportedCryptos.find(crypto => crypto.symbol === symbol) || 
           { symbol, name: symbol, icon: symbol };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-purple-500/20 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-purple-500/20 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Crypto Wallets</h3>
        <Button
          onClick={refreshBalances}
          disabled={refreshing}
          variant="ghost"
          size="sm"
          className="text-purple-400 hover:text-purple-300"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {cryptoWallets.map((wallet) => {
        const cryptoInfo = getCryptoInfo(wallet.crypto_currency);
        return (
          <Card key={wallet.id} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cryptoInfo.icon}</span>
                  <div>
                    <CardTitle className="text-purple-200">{cryptoInfo.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{cryptoInfo.symbol}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-purple-500/20 text-purple-200">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono text-sm truncate">
                    {wallet.wallet_address}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyWalletAddress(wallet.wallet_address)}
                    className="h-8 w-8 p-0 text-purple-400 hover:text-purple-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Balance</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="h-6 w-6 p-0 text-slate-400"
                  >
                    {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xl font-bold text-white mb-4">
                  {balanceVisible 
                    ? formatBalance(wallet.balance, wallet.crypto_currency)
                    : '****'
                  }
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => onTopUp(wallet.id, wallet.crypto_currency)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buy {wallet.crypto_currency}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500/20 text-purple-200"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Create new wallets */}
      <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-500/20">
        <CardContent className="p-6">
          <h4 className="text-white font-medium mb-4">Create New Crypto Wallet</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {supportedCryptos
              .filter(crypto => !cryptoWallets.some(wallet => wallet.crypto_currency === crypto.symbol))
              .map((crypto) => (
                <Button
                  key={crypto.symbol}
                  onClick={() => onCreateWallet(crypto.symbol)}
                  variant="outline"
                  className="border-slate-500/20 text-slate-300 hover:bg-slate-700/30"
                >
                  <span className="mr-2">{crypto.icon}</span>
                  {crypto.symbol}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
