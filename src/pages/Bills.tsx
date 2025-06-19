
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Wifi, Zap, Gift, Tv, Gamepad2 } from 'lucide-react';
import { BillPaymentModal } from '@/components/bills/BillPaymentModal';
import { AfricanPattern } from '@/components/ui/african-pattern';

export default function Bills() {
  const services = [
    {
      id: 'airtime',
      name: 'Airtime',
      icon: <Smartphone className="w-8 h-8" />,
      description: 'Top up your phone'
    },
    {
      id: 'data',
      name: 'Data Bundles',
      icon: <Wifi className="w-8 h-8" />,
      description: 'Internet data plans'
    },
    {
      id: 'electricity',
      name: 'Electricity',
      icon: <Zap className="w-8 h-8" />,
      description: 'Pay electricity bills'
    },
    {
      id: 'tv',
      name: 'TV Subscription',
      icon: <Tv className="w-8 h-8" />,
      description: 'Cable TV payments'
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: <Gamepad2 className="w-8 h-8" />,
      description: 'Gaming top-ups'
    },
    {
      id: 'gift_cards',
      name: 'Gift Cards',
      icon: <Gift className="w-8 h-8" />,
      description: 'Digital gift cards'
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 relative overflow-hidden">
        <AfricanPattern variant="adinkra" opacity={0.05} />
        
        <div className="relative z-10 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                Pay Bills
              </h1>
              <p className="text-slate-300">
                Pay for airtime, data, electricity, and more with instant delivery
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <BillPaymentModal
                  key={service.id}
                  serviceType={service.id}
                  serviceIcon={service.icon}
                  serviceName={service.name}
                />
              ))}
            </div>

            <Card className="bg-slate-800/50 border-amber-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-200">How it works</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Choose Service</h3>
                    <p className="text-sm text-slate-400">Select the bill or service you want to pay for</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Enter Details</h3>
                    <p className="text-sm text-slate-400">Provide customer information and amount</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Instant Delivery</h3>
                    <p className="text-sm text-slate-400">Payment processed and delivered immediately</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
