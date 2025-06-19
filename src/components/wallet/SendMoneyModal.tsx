
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SendMoneyModalProps {
  onSuccess?: () => void;
}

export function SendMoneyModal({ onSuccess }: SendMoneyModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [recipientType, setRecipientType] = useState('phone');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');

  const handleSendMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!recipient) {
      toast.error('Please enter recipient information');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        amount: parseFloat(amount),
        currency,
        description
      };

      if (recipientType === 'phone') {
        payload.recipient_phone = recipient;
      } else {
        payload.recipient_email = recipient;
      }

      const { data, error } = await supabase.functions.invoke('process-transfer', {
        body: payload
      });

      if (error) throw error;

      if (data.status === 'success') {
        toast.success('Money sent successfully!');
        setOpen(false);
        setAmount('');
        setRecipient('');
        setDescription('');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Send className="w-4 h-4 mr-2" />
          Send Money
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="text-amber-200">Send Money</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Send to</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={recipientType === 'phone' ? 'default' : 'outline'}
                onClick={() => setRecipientType('phone')}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Phone
              </Button>
              <Button
                variant={recipientType === 'email' ? 'default' : 'outline'}
                onClick={() => setRecipientType('email')}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="recipient" className="text-slate-300">
              {recipientType === 'phone' ? 'Phone Number' : 'Email Address'}
            </Label>
            <Input
              id="recipient"
              type={recipientType === 'phone' ? 'tel' : 'email'}
              placeholder={recipientType === 'phone' ? '+234XXXXXXXXXX' : 'user@example.com'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
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
            <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800/50 border-amber-500/20 text-white"
            />
          </div>

          <Button 
            onClick={handleSendMoney} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {loading ? 'Sending...' : 'Send Money'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
