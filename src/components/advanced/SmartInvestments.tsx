
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Pie, Target, Zap } from 'lucide-react';

export function SmartInvestments() {
  const investments = [
    {
      name: 'Africa Tech Growth Fund',
      return: '+18.5%',
      risk: 'Medium',
      minimum: '₦10,000',
      icon: '🚀',
      color: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Pan-African Infrastructure',
      return: '+12.3%',
      risk: 'Low',
      minimum: '₦5,000',
      icon: '🏗️',
      color: 'from-green-600 to-blue-600'
    },
    {
      name: 'Crypto Basket',
      return: '+25.7%',
      risk: 'High',
      minimum: '₦1,000',
      icon: '₿',
      color: 'from-orange-600 to-red-600'
    },
    {
      name: 'Agriculture Bond',
      return: '+8.9%',
      risk: 'Low',
      minimum: '₦20,000',
      icon: '🌾',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-indigo-200 flex items-center gap-3">
          <TrendingUp className="w-6 h-6" />
          AI-Powered Investments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {investments.map((investment, index) => (
            <Card key={index} className="bg-slate-800/30 border-indigo-500/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{investment.icon}</span>
                    <div>
                      <h4 className="text-white font-medium">{investment.name}</h4>
                      <p className="text-slate-400 text-sm">Min: {investment.minimum}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/20 text-indigo-200">
                    {investment.risk}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Expected Return</span>
                  <span className="text-green-400 font-bold">{investment.return}</span>
                </div>
                
                <Button className={`w-full bg-gradient-to-r ${investment.color}`}>
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-indigo-500/20">
            <Pie className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <h4 className="text-indigo-200 font-medium">Portfolio</h4>
            <p className="text-slate-400 text-sm">AI Managed</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-indigo-500/20">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-green-200 font-medium">Goals</h4>
            <p className="text-slate-400 text-sm">Smart Targets</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-indigo-500/20">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h4 className="text-yellow-200 font-medium">Auto-Invest</h4>
            <p className="text-slate-400 text-sm">Set & Forget</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
