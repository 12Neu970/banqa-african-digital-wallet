
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Gift, Star, MessageCircle, Trophy } from 'lucide-react';

export function CommunityFeatures() {
  const tontineGroups = [
    { name: 'Lagos Tech Workers', members: 25, target: '₦5M', progress: 68 },
    { name: 'Nairobi Entrepreneurs', members: 18, target: 'KSh 500K', progress: 45 },
    { name: 'Accra Market Traders', members: 30, target: 'GH₵ 20K', progress: 82 }
  ];

  const communityStats = [
    { icon: Users, label: 'Active Communities', value: '1,247', color: 'text-blue-400' },
    { icon: Heart, label: 'Lives Impacted', value: '2.3M', color: 'text-red-400' },
    { icon: Gift, label: 'Mutual Aid Given', value: '₦1.2B', color: 'text-green-400' },
    { icon: Trophy, label: 'Success Stories', value: '15K', color: 'text-yellow-400' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-orange-200 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Ubuntu Community Finance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-slate-800/30 rounded-lg border border-orange-500/20">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-slate-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tontine Groups */}
          <div className="bg-slate-800/30 p-4 rounded-lg border border-orange-500/20">
            <h4 className="text-orange-200 font-medium mb-4">Digital Tontines (Savings Circles)</h4>
            <div className="space-y-3">
              {tontineGroups.map((group, index) => (
                <div key={index} className="bg-slate-700/30 p-3 rounded border border-orange-500/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-white font-medium">{group.name}</h5>
                      <p className="text-slate-400 text-sm">{group.members} members • Target: {group.target}</p>
                    </div>
                    <Badge className="bg-orange-600/20 text-orange-400">{group.progress}%</Badge>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${group.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-red-600">
              Join a Tontine
            </Button>
          </div>

          {/* Community Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-orange-500/20">
              <MessageCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h4 className="text-orange-200 font-medium">Community Chat</h4>
              <p className="text-slate-400 text-sm">Connect with members</p>
            </div>
            <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-orange-500/20">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-yellow-200 font-medium">Peer Reviews</h4>
              <p className="text-slate-400 text-sm">Rate & recommend</p>
            </div>
            <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-orange-500/20">
              <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-green-200 font-medium">Mutual Aid</h4>
              <p className="text-slate-400 text-sm">Help others prosper</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
