
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Shield, Zap } from 'lucide-react';
import { AfricanPattern } from '@/components/ui/african-pattern';

export function AIFinancialAdvisor() {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const insights = [
    { icon: TrendingUp, title: 'Investment Opportunities', description: 'AI-powered investment recommendations' },
    { icon: Shield, title: 'Risk Assessment', description: 'Smart financial risk analysis' },
    { icon: Brain, title: 'Spending Intelligence', description: 'Personalized spending insights' },
    { icon: Zap, title: 'Instant Advice', description: 'Real-time financial guidance' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20 backdrop-blur-sm relative overflow-hidden">
        <AfricanPattern variant="adinkra" opacity={0.1} />
        <CardHeader className="relative z-10">
          <CardTitle className="text-purple-200 flex items-center gap-3">
            <Brain className="w-6 h-6" />
            AI Griot - Your Financial Wisdom Keeper
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask your AI financial advisor anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-slate-800/50 border-purple-500/20 text-white flex-1"
            />
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
              Ask Griot
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {insights.map((insight, index) => (
              <div key={index} className="text-center p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <insight.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <h4 className="text-purple-200 text-sm font-medium">{insight.title}</h4>
                <p className="text-slate-400 text-xs">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
