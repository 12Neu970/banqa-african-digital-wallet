
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BillPaymentModalProps {
  serviceType: string;
  serviceIcon: React.ReactNode;
  serviceName: string;
}

export function BillPaymentModal({ serviceType, serviceIcon, serviceName }: BillPaymentModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!customerId) {
      toast.error('Please enter customer information');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          service_type: serviceType as any,
          amount: parseFloat(amount),
          customer_id: customerId,
          payment_method: paymentMethod
        }
      });

      if (error) throw error;

      if (data.status === 'success') {
        toast.success('Bill payment processed successfully!');
        setOpen(false);
        setAmount('');
        setCustomerId('');
      }
    } catch (error) {
      console.error('Bill payment error:', error);
      toast.error('Failed to process bill payment');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (serviceType) {
      case 'airtime':
      case 'data':
        return 'Enter phone number';
      case 'electricity':
        return 'Enter meter number';
      case 'tv':
        return 'Enter decoder number';
      default:
        return 'Enter customer ID';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="p-6 bg-slate-800/30 border-amber-500/20 backdrop-blur-sm hover:bg-slate-700/40 transition-all cursor-pointer group">
          <div className="text-center space-y-3">
            <div className="text-amber-400 group-hover:scale-110 transition-transform">
              {serviceIcon}
            </div>
            <h3 className="text-white font-medium">{serviceName}</h3>
            <p className="text-slate-400 text-sm">Pay with ease</p>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="text-amber-200">Pay {serviceName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerId" className="text-slate-300">
              {getPlaceholder().replace('Enter ', '')}
            </Label>
            <Input
              id="customerId"
              placeholder={getPlaceholder()}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="bg-slate-800/50 border-amber-500/20 text-white"
            />
          </div>

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
            <Label className="text-slate-300">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-slate-800/50 border-amber-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-amber-500/20">
                <SelectItem value="wallet">Wallet Balance</SelectItem>
                <SelectItem value="card">Bank Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {loading ? 'Processing...' : `Pay ${serviceName}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
