
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Eye, EyeOff, Settings, Lock } from 'lucide-react';

export default function Cards() {
  const [showCardNumbers, setShowCardNumbers] = React.useState(false);

  const cards = [
    {
      id: 1,
      type: 'Virtual',
      name: 'NGN Virtual Card',
      number: '4532 1234 5678 9012',
      balance: '₦45,250.00',
      status: 'Active',
      currency: 'NGN',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 2,
      type: 'Virtual',
      name: 'USD Virtual Card',
      number: '4532 9876 5432 1098',
      balance: '$1,250.50',
      status: 'Active',
      currency: 'USD',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const maskCardNumber = (number: string) => {
    if (!showCardNumbers) {
      return number.replace(/\d{4} \d{4} \d{4}/g, '•••• •••• ••••');
    }
    return number;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cards</h1>
            <p className="text-muted-foreground">Manage your virtual and physical cards</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Request Physical Card
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Virtual Card
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className="overflow-hidden">
              <div className={`bg-gradient-to-r ${card.color} p-6 text-white relative`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge variant="secondary" className="mb-2 bg-white/20 text-white">
                      {card.type}
                    </Badge>
                    <p className="text-sm opacity-90">{card.name}</p>
                  </div>
                  <CreditCard className="h-8 w-8 opacity-80" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-mono tracking-wider">
                      {maskCardNumber(card.number)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-80">Balance</p>
                      <p className="text-xl font-bold">{card.balance}</p>
                    </div>
                    <Badge className={`${card.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {card.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Lock className="h-3 w-3 mr-1" />
                    Freeze
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Card */}
          <Card className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] p-6">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Create New Card</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get instant virtual cards or request physical cards for global spending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Card Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Card Settings</CardTitle>
            <CardDescription>Manage your card preferences and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Card Numbers</p>
                <p className="text-sm text-muted-foreground">Toggle visibility of sensitive card information</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCardNumbers(!showCardNumbers)}
              >
                {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Transaction Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified for all card transactions</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Spending Limits</p>
                <p className="text-sm text-muted-foreground">Set daily and monthly spending limits</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
