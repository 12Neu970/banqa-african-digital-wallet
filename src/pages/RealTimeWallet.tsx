
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BankAccountCard } from '@/components/wallet/BankAccountCard';
import { CryptoWalletCard } from '@/components/wallet/CryptoWalletCard';
import { TopUpModal } from '@/components/wallet/TopUpModal';
import { APIKeyModal } from '@/components/wallet/APIKeyModal';
import { AfricanPattern } from '@/components/ui/african-pattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, Bitcoin, TrendingUp, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function RealTimeWallet() {
  const { user } = useAuth();
  const [topUpModal, setTopUpModal] = useState({
    open: false,
    accountId: '',
    accountType: 'bank' as 'bank' | 'crypto',
    currency: ''
  });

  const handleBankTopUp = (accountId: string) => {
    setTopUpModal({
      open: true,
      accountId,
      accountType: 'bank',
      currency: 'NGN'
    });
  };

  const handleCryptoTopUp = (walletId: string, currency: string) => {
    setTopUpModal({
      open: true,
      accountId: walletId,
      accountType: 'crypto',
      currency
    });
  };

  const handleCreateCryptoWallet = async (currency: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-crypto-wallet', {
        body: { currency }
      });

      if (error) throw error;

      toast.success(`${currency} wallet created successfully!`);
    } catch (error) {
      console.error('Error creating crypto wallet:', error);
      toast.error('Failed to create crypto wallet');
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
        <AfricanPattern variant="kente" opacity={0.03} />
        
        <div className="relative z-10 p-6 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Real-Time Banking
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              Experience instant banking with real bank accounts and crypto wallets that update in real-time
            </p>
            
            <div className="flex justify-center mb-8">
              <APIKeyModal />
            </div>

            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="bg-slate-800/30 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Banknote className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-purple-200 font-medium">Real Bank Account</h3>
                  <p className="text-slate-400 text-sm">Actual account numbers</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-pink-500/20">
                <CardContent className="p-4 text-center">
                  <Bitcoin className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <h3 className="text-pink-200 font-medium">Crypto Wallets</h3>
                  <p className="text-slate-400 text-sm">Multi-currency support</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-orange-500/20">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <h3 className="text-orange-200 font-medium">Real-Time Updates</h3>
                  <p className="text-slate-400 text-sm">Instant balance sync</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-green-500/20">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-green-200 font-medium">Secure APIs</h3>
                  <p className="text-slate-400 text-sm">Encrypted storage</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="bank" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <Banknote className="w-4 h-4" />
                Bank Account
              </TabsTrigger>
              <TabsTrigger value="crypto" className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                Crypto Wallets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="mt-8">
              <BankAccountCard onTopUp={handleBankTopUp} />
            </TabsContent>

            <TabsContent value="crypto" className="mt-8">
              <CryptoWalletCard 
                onTopUp={handleCryptoTopUp}
                onCreateWallet={handleCreateCryptoWallet}
              />
            </TabsContent>
          </Tabs>
        </div>

        <TopUpModal
          open={topUpModal.open}
          onOpenChange={(open) => setTopUpModal(prev => ({ ...prev, open }))}
          accountId={topUpModal.accountId}
          accountType={topUpModal.accountType}
          currency={topUpModal.currency}
        />
      </div>
    </AppLayout>
  );
}
