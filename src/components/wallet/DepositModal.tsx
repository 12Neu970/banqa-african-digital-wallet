
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CreditCard, Bitcoin } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DepositModalProps {
  onSuccess?: () => void;
}

export function DepositModal({ onSuccess }: DepositModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('flutterwave-deposit', {
        body: {
          amount: parseFloat(amount),
          currency,
          payment_method_id: null // For now, we'll handle this in the backend
        }
      });

      if (error) throw error;

      if (data.status === 'success') {
        // Open Flutterwave payment link
        window.open(data.data.payment_link, '_blank');
        toast.success('Redirecting to payment...');
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to initiate deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="text-amber-200">Add Money to Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-slate-300">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-800/50 border-amber-500/20 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-300">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-slate-800/50 border-amber-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-amber-500/20">
                <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                <SelectItem value="GHS">Ghanaian Cedi (GHS)</SelectItem>
                <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Payment Method</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Card/Bank
              </Button>
              <Button
                variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('crypto')}
                className="flex items-center gap-2"
              >
                <Bitcoin className="w-4 h-4" />
                Crypto
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleDeposit} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {loading ? 'Processing...' : 'Add Money'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
