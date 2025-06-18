
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Globe, Smartphone, CreditCard, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Military-grade encryption protects your assets',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant transactions across African borders',
    },
    {
      icon: Globe,
      title: 'Multi-Currency',
      description: 'Support for all major African currencies + crypto',
    },
    {
      icon: Smartphone,
      title: 'AI-Powered',
      description: 'Smart financial assistant built for Africa',
    },
    {
      icon: CreditCard,
      title: 'Virtual Cards',
      description: 'Create unlimited virtual cards instantly',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join savings groups and grow together',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Banqa
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-0">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              African Finance
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience next-generation banking with AI-powered financial services, 
            multi-currency wallets, and seamless cross-border payments designed for Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-0 text-lg px-8 py-4">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-white/10 text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Built for the Future
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced technology meets African financial needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
                <CardDescription className="text-slate-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                10M+
              </div>
              <div className="text-slate-300">Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                54
              </div>
              <div className="text-slate-300">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                500K+
              </div>
              <div className="text-slate-300">Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-slate-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl p-12 border border-slate-700 backdrop-blur-sm">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Finance?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Africans already using Banqa to manage their money smarter.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-0 text-lg px-8 py-4">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 border-t border-slate-800">
        <div className="text-center text-slate-400">
          <p>&copy; 2024 Banqa. Building the future of African finance.</p>
        </div>
      </footer>
    </div>
  );
}
