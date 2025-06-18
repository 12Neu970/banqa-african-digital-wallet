
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CreditCard, Smartphone, Users, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Index() {
  const { user } = useAuth();

  const features = [
    {
      icon: Wallet,
      title: 'Multi-Currency Wallets',
      description: 'Manage money in NGN, KES, GHS, ZAR, XOF, USDT and more across 54 African countries',
    },
    {
      icon: CreditCard,
      title: 'Virtual & Physical Cards',
      description: 'Get instant virtual cards or order physical cards for global spending',
    },
    {
      icon: Smartphone,
      title: 'Bill Payments & Top-ups',
      description: 'Pay for airtime, data, electricity, TV subscriptions, and more',
    },
    {
      icon: Users,
      title: 'Savings Groups (Ajo/Esusu)',
      description: 'Join traditional savings groups with modern digital convenience',
    },
    {
      icon: Shield,
      title: 'Secure & Verified',
      description: 'Bank-level security with KYC verification and payment proof management',
    },
    {
      icon: Globe,
      title: 'Works Offline',
      description: 'Access services through agents even without internet connection',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center py-20">
          <div className="mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Banqa
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              The African Financial Super App
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your bank, wallet, payment platform, and financial advisor all in one. 
              Built for Africa, designed for the future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {user ? (
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>54 African Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Multi-Currency Support</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need to Manage Money in Africa
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From everyday payments to long-term savings, Banqa provides all the financial tools 
            Africans need to thrive in the digital economy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Join the Financial Revolution?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of Africans who have already taken control of their financial future with Banqa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user && (
                <Button asChild size="lg" className="text-lg px-12 py-6">
                  <Link to="/auth">Create Your Account</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
