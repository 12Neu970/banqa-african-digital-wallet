
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Wifi, Zap, Gift, Tv, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BillPaymentModalProps {
  serviceType: string;
  serviceIcon: React.ReactNode;
  serviceName: string;
  onSuccess?: () => void;
}

export function BillPaymentModal({ serviceType, serviceIcon, serviceName, onSuccess }: BillPaymentModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState<any[]>([]);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [amount, setAmount] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [country, setCountry] = useState('NG');

  useEffect(() => {
    if (open) {
      loadOperators();
    }
  }, [open, serviceType, country]);

  const loadOperators = async () => {
    try {
      const { data } = await supabase
        .from('reloadly_products')
        .select('*')
        .eq('service_type', serviceType)
        .eq('country', country)
        .eq('is_active', true);

      setOperators(data || []);
    } catch (error) {
      console.error('Error loading operators:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedOperator || !amount || !customerId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'purchase',
          service_type: serviceType,
          customer_id: customerId,
          amount: parseFloat(amount),
          operator_id: parseInt(selectedOperator),
          payment_method: 'wallet'
        }
      });

      if (error) throw error;

      if (data.status === 'success') {
        toast.success(`${serviceName} purchased successfully!`);
        setOpen(false);
        setAmount('');
        setCustomerId('');
        setSelectedOperator('');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerIdPlaceholder = () => {
    switch (serviceType) {
      case 'airtime':
      case 'data':
        return 'Phone number (e.g., +2348012345678)';
      case 'electricity':
        return 'Meter number';
      case 'tv':
        return 'Decoder number/Smart card number';
      default:
        return 'Customer ID';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-24 flex-col space-y-2 bg-slate-800/50 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40 text-white"
        >
          {serviceIcon}
          <span className="text-sm">{serviceName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="text-amber-200">Pay {serviceName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="bg-slate-800/50 border-amber-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-amber-500/20">
                <SelectItem value="NG">Nigeria</SelectItem>
                <SelectItem value="KE">Kenya</SelectItem>
                <SelectItem value="GH">Ghana</SelectItem>
                <SelectItem value="ZA">South Africa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Service Provider</Label>
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger className="bg-slate-800/50 border-amber-500/20 text-white">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-amber-500/20">
                {operators.map((operator) => (
                  <SelectItem key={operator.id} value={operator.reloadly_product_id.toString()}>
                    {operator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customerId" className="text-slate-300">
              {getCustomerIdPlaceholder().split('(')[0]}
            </Label>
            <Input
              id="customerId"
              placeholder={getCustomerIdPlaceholder()}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="bg-slate-800/50 border-amber-500/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-slate-300">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-800/50 border-amber-500/20 text-white"
            />
          </div>

          <div className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded">
            <p>Fee: 0.369% of amount</p>
            <p>Total: ${(parseFloat(amount || '0') * 1.00369).toFixed(2)}</p>
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
