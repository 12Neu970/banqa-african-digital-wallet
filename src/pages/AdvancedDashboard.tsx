
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AIFinancialAdvisor } from '@/components/advanced/AIFinancialAdvisor';
import { BureauDeChange } from '@/components/advanced/BureauDeChange';
import { SmartInvestments } from '@/components/advanced/SmartInvestments';
import { BiometricSecurity } from '@/components/advanced/BiometricSecurity';
import { CommunityFeatures } from '@/components/advanced/CommunityFeatures';
import { AfricanPattern } from '@/components/ui/african-pattern';

export default function AdvancedDashboard() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 relative overflow-hidden">
        <AfricanPattern variant="kente" opacity={0.03} />
        
        <div className="relative z-10 p-6 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                Revolutionary Finance
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the future of African banking with AI-powered features that surpass traditional financial institutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AIFinancialAdvisor />
            <BiometricSecurity />
          </div>

          <BureauDeChange />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SmartInvestments />
            <CommunityFeatures />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
