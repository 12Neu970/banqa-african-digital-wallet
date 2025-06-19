
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, TrendingUp, Globe, Coins } from 'lucide-react';

export function BureauDeChange() {
  const [fromCurrency, setFromCurrency] = useState('NGN');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');

  const exchangeRates = [
    { from: 'NGN', to: 'USD', rate: 0.0012, trend: 'up' },
    { from: 'KES', to: 'USD', rate: 0.0075, trend: 'down' },
    { from: 'GHS', to: 'USD', rate: 0.085, trend: 'up' },
    { from: 'ZAR', to: 'USD', rate: 0.055, trend: 'up' },
    { from: 'XOF', to: 'USD', rate: 0.0016, trend: 'down' },
    { from: 'USD', to: 'BTC', rate: 0.000025, trend: 'up' }
  ];

  const cryptoRates = [
    { symbol: 'BTC', price: 42150, change: '+2.5%', color: 'text-green-400' },
    { symbol: 'ETH', price: 2580, change: '+1.8%', color: 'text-green-400' },
    { symbol: 'USDT', price: 1.00, change: '0.0%', color: 'text-slate-400' },
    { symbol: 'BNB', price: 315, change: '-0.5%', color: 'text-red-400' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-green-200 flex items-center gap-3">
            <ArrowUpDown className="w-6 h-6" />
            Pan-African Bureau De Change
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Exchange */}
          <div className="bg-slate-800/30 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-green-200 font-medium mb-4">Instant Currency Exchange</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-300 text-sm">From</label>
                <select className="w-full mt-1 bg-slate-700 border border-green-500/20 rounded p-2 text-white">
                  <option value="NGN">🇳🇬 Nigerian Naira</option>
                  <option value="KES">🇰🇪 Kenyan Shilling</option>
                  <option value="GHS">🇬🇭 Ghanaian Cedi</option>
                  <option value="ZAR">🇿🇦 South African Rand</option>
                  <option value="USD">🇺🇸 US Dollar</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm">To</label>
                <select className="w-full mt-1 bg-slate-700 border border-green-500/20 rounded p-2 text-white">
                  <option value="USD">🇺🇸 US Dollar</option>
                  <option value="EUR">🇪🇺 Euro</option>
                  <option value="GBP">🇬🇧 British Pound</option>
                  <option value="BTC">₿ Bitcoin</option>
                  <option value="ETH">Ξ Ethereum</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="bg-slate-700 border-green-500/20 text-white"
                />
              </div>
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600">
              Exchange Now
            </Button>
          </div>

          {/* Live Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 p-4 rounded-lg border border-green-500/20">
              <h4 className="text-green-200 font-medium mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Fiat Rates
              </h4>
              <div className="space-y-2">
                {exchangeRates.slice(0, 4).map((rate, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-300">{rate.from}/{rate.to}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{rate.rate}</span>
                      <TrendingUp className={`w-3 h-3 ${rate.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-lg border border-green-500/20">
              <h4 className="text-green-200 font-medium mb-3 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Crypto Rates
              </h4>
              <div className="space-y-2">
                {cryptoRates.map((crypto, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-300">{crypto.symbol}</span>
                    <div className="text-right">
                      <div className="text-white">${crypto.price.toLocaleString()}</div>
                      <div className={`text-xs ${crypto.color}`}>{crypto.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
