
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Zap, Tv, Gamepad2, Gift, Plane, Clock, ArrowRight } from 'lucide-react';

export default function Bills() {
  const services = [
    {
      category: 'Airtime & Data',
      icon: Smartphone,
      color: 'bg-green-500',
      services: ['MTN', 'Airtel', 'Glo', '9mobile', 'Safaricom', 'Vodacom']
    },
    {
      category: 'Electricity',
      icon: Zap,
      color: 'bg-yellow-500',
      services: ['EKEDC', 'IKEDC', 'AEDC', 'PHED', 'KEDCO', 'IBEDC']
    },
    {
      category: 'TV Subscriptions',
      icon: Tv,
      color: 'bg-purple-500',
      services: ['DSTV', 'GOtv', 'StarTimes', 'Netflix', 'Showmax', 'Prime Video']
    },
    {
      category: 'Gaming & Betting',
      icon: Gamepad2,
      color: 'bg-blue-500',
      services: ['Steam', 'PlayStation', 'Xbox', 'Bet9ja', 'SportyBet', 'NairaBet']
    },
    {
      category: 'Gift Cards',
      icon: Gift,
      color: 'bg-pink-500',
      services: ['iTunes', 'Google Play', 'Amazon', 'Steam', 'Netflix', 'Spotify']
    },
    {
      category: 'Travel & Transport',
      icon: Plane,
      color: 'bg-indigo-500',
      services: ['Flight Booking', 'Bus Tickets', 'Train Tickets', 'Hotel Booking']
    }
  ];

  const recentBills = [
    { service: 'EKEDC', amount: '₦5,250', status: 'Paid', date: '2 hours ago' },
    { service: 'MTN Airtime', amount: '₦1,000', status: 'Paid', date: '1 day ago' },
    { service: 'DSTV Premium', amount: '₦21,000', status: 'Pending', date: '2 days ago' },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bills & Payments</h1>
            <p className="text-muted-foreground">Pay for services across Africa with ease</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦47,250</p>
                  <p className="text-sm text-muted-foreground">Total spent this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Bills paid this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦2,100</p>
                  <p className="text-sm text-muted-foreground">Cashback earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${category.color} rounded-full`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                    <CardDescription>{category.services.length} providers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.services.slice(0, 3).map((service, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {category.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{category.services.length - 3} more
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Pay Now
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bills */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your latest bill payments and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{bill.service}</p>
                      <p className="text-sm text-muted-foreground">{bill.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{bill.amount}</p>
                    <Badge className={bill.status === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}>
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
