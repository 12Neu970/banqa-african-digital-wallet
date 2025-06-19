
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Smartphone, Bitcoin, QrCode } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId?: string;
  accountType: 'bank' | 'crypto';
  currency: string;
}

export function TopUpModal({ open, onOpenChange, accountId, accountType, currency }: TopUpModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!accountId) {
      toast.error('No account selected');
      return;
    }

    setLoading(true);
    try {
      // Create a real-time transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from('real_time_transactions')
        .insert({
          user_id: user?.id,
          account_id: accountId,
          account_type: accountType,
          transaction_type: 'top_up',
          amount: parseFloat(amount),
          currency: currency,
          status: 'processing',
          metadata: {
            payment_method: paymentMethod,
            initiated_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Simulate payment processing with external provider
      if (accountType === 'bank') {
        // For bank accounts, use Flutterwave or similar
        const { data, error } = await supabase.functions.invoke('process-bank-topup', {
          body: {
            account_id: accountId,
            amount: parseFloat(amount),
            currency,
            payment_method: paymentMethod,
            transaction_id: transactionData.id
          }
        });

        if (error) throw error;

        if (data.payment_link) {
          window.open(data.payment_link, '_blank');
          toast.success('Redirecting to payment...');
        }
      } else {
        // For crypto wallets, simulate blockchain transaction
        const { data, error } = await supabase.functions.invoke('process-crypto-topup', {
          body: {
            wallet_id: accountId,
            amount: parseFloat(amount),
            currency,
            payment_method: paymentMethod,
            transaction_id: transactionData.id
          }
        });

        if (error) throw error;

        if (data.qr_code || data.wallet_address) {
          toast.success('Please send crypto to the provided address');
        }
      }

      onOpenChange(false);
      setAmount('');
    } catch (error) {
      console.error('Top-up error:', error);
      toast.error('Failed to initiate top-up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 border-amber-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-200">
            Top Up {accountType === 'bank' ? 'Bank Account' : 'Crypto Wallet'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="amount" className="text-slate-300">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-800/50 border-amber-500/20 text-white pr-16"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                {currency}
              </span>
            </div>
          </div>

          <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="ussd" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                USSD
              </TabsTrigger>
              {accountType === 'crypto' && (
                <TabsTrigger value="crypto" className="flex items-center gap-2">
                  <Bitcoin className="w-4 h-4" />
                  Crypto
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="card" className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <h4 className="text-amber-200 font-medium">Card Payment</h4>
                </div>
                <p className="text-slate-400 text-sm">
                  Pay securely with your debit or credit card via Flutterwave
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ussd" className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h4 className="text-amber-200 font-medium">USSD Payment</h4>
                </div>
                <p className="text-slate-400 text-sm">
                  Use your phone to make payment via USSD code
                </p>
              </div>
            </TabsContent>

            {accountType === 'crypto' && (
              <TabsContent value="crypto" className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <QrCode className="w-5 h-5 text-amber-400" />
                    <h4 className="text-amber-200 font-medium">Crypto Transfer</h4>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Send {currency} directly to your wallet address
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>

          <Button 
            onClick={handleTopUp} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {loading ? 'Processing...' : `Top Up ${currency}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
