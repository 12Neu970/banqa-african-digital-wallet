
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Globe, Smartphone, CreditCard, Users, TrendingUp, Landmark, Coins, Banknote, CircuitBoard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/logo';
import { AfricanPattern } from '@/components/ui/african-pattern';

export default function Index() {
  const revolutionaryFeatures = [
    {
      icon: Shield,
      title: 'Ubuntu Security',
      description: 'Community-powered security inspired by African Ubuntu philosophy',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Lightning Hawala',
      description: 'Traditional hawala system reimagined with blockchain technology',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: 'Pan-African Unity',
      description: 'Seamless transactions across all 54 African nations',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: Users,
      title: 'Tontine Revolution',
      description: 'Digital savings circles powered by smart contracts',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: CircuitBoard,
      title: 'AI Griot',
      description: 'Personalized financial wisdom from our AI storyteller',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Coins,
      title: 'Afri-Coin Mining',
      description: 'Earn rewards through community participation',
      color: 'from-teal-500 to-cyan-600'
    },
  ];

  const culturalStats = [
    { value: '54', label: 'Nations United', flag: '🌍' },
    { value: '1.4B+', label: 'People Empowered', flag: '🚀' },
    { value: '₦10T+', label: 'Wealth Circulated', flag: '💎' },
    { value: '99.99%', label: 'Ubuntu Reliability', flag: '🛡️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white overflow-hidden relative">
      {/* African Pattern Background */}
      <AfricanPattern variant="kente" opacity={0.05} className="fixed inset-0" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating African symbols */}
        <div className="absolute top-20 left-20 text-6xl opacity-10 animate-bounce delay-300">🦁</div>
        <div className="absolute top-40 right-32 text-4xl opacity-10 animate-bounce delay-700">🌿</div>
        <div className="absolute bottom-40 left-40 text-5xl opacity-10 animate-bounce delay-1000">⚡</div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-white hover:bg-white/10 border border-amber-500/30">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-600 hover:to-red-700 border-0 shadow-lg">
                Join Revolution
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Revolutionary Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-red-600/20 border border-amber-500/30 mb-8 backdrop-blur-sm">
            <Landmark className="h-4 w-4 mr-2 text-amber-400" />
            <span className="text-sm font-medium text-amber-200">The Financial Revolution Has Begun</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Ubuntu Finance
            </span>
            <span className="block text-3xl md:text-5xl mt-4 text-slate-300">
              By Africans, For Africa
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Experience the fusion of ancient African wisdom and cutting-edge blockchain technology. 
            Together, we're building the financial system that will liberate Africa from traditional banking.
          </p>

          {/* Cultural Quote */}
          <div className="mb-12 p-6 bg-gradient-to-r from-amber-500/10 to-red-600/10 rounded-2xl border border-amber-500/20 backdrop-blur-sm">
            <p className="text-lg italic text-amber-200 mb-2">
              "I am because we are, we are because I am"
            </p>
            <p className="text-sm text-amber-400">— Ubuntu Philosophy</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-600 hover:to-red-700 border-0 text-lg px-12 py-6 shadow-2xl">
                Start Revolution
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-amber-500/50 text-amber-200 hover:bg-amber-500/10 text-lg px-12 py-6 backdrop-blur-sm">
              Watch Manifesto
            </Button>
          </div>
        </div>
      </section>

      {/* Revolutionary Features */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-red-600 bg-clip-text text-transparent">
              Revolutionary Features
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ancient wisdom meets modern technology. These aren't just features—they're weapons of financial liberation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {revolutionaryFeatures.map((feature, index) => (
            <Card key={index} className="bg-slate-800/30 border border-amber-500/20 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-500 group hover:scale-105 hover:shadow-2xl">
              <CardHeader>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-amber-200 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-slate-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Cultural Stats */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-slate-800/40 via-amber-900/20 to-slate-800/40 backdrop-blur-sm rounded-3xl p-12 border border-amber-500/20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-red-600 bg-clip-text text-transparent">
              Ubuntu Impact
            </h3>
            <p className="text-slate-300">Together, we are transforming Africa's financial landscape</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {culturalStats.map((stat, index) => (
              <div key={index} className="group hover:scale-110 transition-transform duration-300">
                <div className="text-6xl mb-2">{stat.flag}</div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-red-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Call to Action */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 rounded-3xl p-16 border-2 border-amber-500/30 backdrop-blur-sm relative overflow-hidden">
          <AfricanPattern variant="adinkra" opacity={0.1} />
          
          <div className="relative z-10">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-red-600 bg-clip-text text-transparent">
                The Time Is Now
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join millions of Africans who are already using Banqa to break free from traditional banking. 
              Together, we build the future of African finance.
            </p>
            
            {/* Ubuntu Quote */}
            <div className="mb-8 p-4 bg-slate-800/30 rounded-xl border border-amber-500/20">
              <p className="text-amber-200 italic">
                "When we build together, we all rise together"
              </p>
            </div>
            
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-600 hover:to-red-700 border-0 text-xl px-16 py-8 shadow-2xl hover:shadow-amber-500/25 transition-all duration-300">
                Join The Revolution
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 border-t border-amber-500/20">
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-4" />
          <p className="text-slate-400 mb-4">
            &copy; 2024 Banqa. Empowering Africa, One Transaction at a Time.
          </p>
          <p className="text-amber-400 font-medium">
            Ubuntu • Innovation • Liberation
          </p>
        </div>
      </footer>
    </div>
  );
}
