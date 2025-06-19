
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Eye, Shield, Smartphone, Lock } from 'lucide-react';

export function BiometricSecurity() {
  const [biometricEnabled, setBiometricEnabled] = useState({
    fingerprint: true,
    faceId: false,
    voiceId: false,
    behavioralAuth: true
  });

  const securityFeatures = [
    {
      icon: Fingerprint,
      title: 'Fingerprint Lock',
      description: 'Touch ID for instant access',
      enabled: biometricEnabled.fingerprint,
      color: 'text-blue-400'
    },
    {
      icon: Eye,
      title: 'Face Recognition',
      description: 'Advanced facial authentication',
      enabled: biometricEnabled.faceId,
      color: 'text-green-400'
    },
    {
      icon: Smartphone,
      title: 'Voice ID',
      description: 'Voice pattern recognition',
      enabled: biometricEnabled.voiceId,
      color: 'text-purple-400'
    },
    {
      icon: Shield,
      title: 'Behavioral Auth',
      description: 'AI-powered usage patterns',
      enabled: biometricEnabled.behavioralAuth,
      color: 'text-orange-400'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border-blue-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-blue-200 flex items-center gap-3">
          <Shield className="w-6 h-6" />
          Ubuntu Security Shield
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-slate-800/30 p-4 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  <div>
                    <h4 className="text-white font-medium">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
                <Badge variant={feature.enabled ? "default" : "outline"} className="border-blue-500/20">
                  {feature.enabled ? 'ON' : 'OFF'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/30 p-4 rounded-lg border border-blue-500/20">
          <h4 className="text-blue-200 font-medium mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Advanced Security Features
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Multi-factor Authentication</span>
              <Badge className="bg-green-600/20 text-green-400">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">End-to-End Encryption</span>
              <Badge className="bg-green-600/20 text-green-400">256-bit</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Fraud Detection AI</span>
              <Badge className="bg-green-600/20 text-green-400">Real-time</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Secure Element</span>
              <Badge className="bg-green-600/20 text-green-400">Hardware</Badge>
            </div>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
          Configure Security Settings
        </Button>
      </CardContent>
    </Card>
  );
}
