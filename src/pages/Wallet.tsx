
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Send, Download, History, Eye, EyeOff } from 'lucide-react';

export default function Wallet() {
  const [showBalance, setShowBalance] = React.useState(true);

  const wallets = [
    { currency: 'NGN', balance: 125450.00, flag: '🇳🇬', name: 'Nigerian Naira' },
    { currency: 'KES', balance: 15230.50, flag: '🇰🇪', name: 'Kenyan Shilling' },
    { currency: 'GHS', balance: 2840.25, flag: '🇬🇭', name: 'Ghanaian Cedi' },
    { currency: 'ZAR', balance: 1520.80, flag: '🇿🇦', name: 'South African Rand' },
    { currency: 'USDT', balance: 850.25, flag: '💵', name: 'Tether USD' },
  ];

  const formatBalance = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      NGN: '₦',
      KES: 'KSh',
      GHS: 'GH₵',
      ZAR: 'R',
      USDT: '$'
    };
    return `${symbols[currency] || ''}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallets</h1>
            <p className="text-muted-foreground">Manage your multi-currency balances</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Currency
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Total Balance Card */}
            <Card className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Total Portfolio Value</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold">
                    {showBalance ? '$2,847.65' : '••••••'}
                  </p>
                  <p className="text-green-100">≈ ₦4,271,475.00</p>
                </div>
              </CardContent>
            </Card>

            {/* Individual Wallets */}
            <div className="grid gap-4">
              {wallets.map((wallet, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{wallet.flag}</div>
                        <div>
                          <h3 className="font-semibold">{wallet.name}</h3>
                          <p className="text-sm text-muted-foreground">{wallet.currency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {showBalance ? formatBalance(wallet.balance, wallet.currency) : '••••••'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Receive
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>View all your wallet transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Your transaction history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>Track your financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Analytics coming soon</p>
                  <p className="text-sm">Detailed portfolio insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
