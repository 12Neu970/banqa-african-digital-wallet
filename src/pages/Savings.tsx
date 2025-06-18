
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, Target, Calendar, TrendingUp, Coins } from 'lucide-react';

export default function Savings() {
  const savingsGroups = [
    {
      id: 1,
      name: 'Lagos Tech Community Ajo',
      targetAmount: 500000,
      currentAmount: 325000,
      members: 12,
      maxMembers: 20,
      frequency: 'Weekly',
      nextCollection: '3 days',
      myContribution: 27000,
      isActive: true
    },
    {
      id: 2,
      name: 'Family Emergency Fund',
      targetAmount: 1000000,
      currentAmount: 680000,
      members: 8,
      maxMembers: 10,
      frequency: 'Monthly',
      nextCollection: '12 days',
      myContribution: 85000,
      isActive: true
    },
    {
      id: 3,
      name: 'University Alumni Esusu',
      targetAmount: 2000000,
      currentAmount: 1250000,
      members: 25,
      maxMembers: 30,
      frequency: 'Bi-weekly',
      nextCollection: '8 days',
      myContribution: 50000,
      isActive: false
    }
  ];

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Savings Groups</h1>
            <p className="text-muted-foreground">Traditional Ajo/Esusu with modern convenience</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Savings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Coins className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦162,000</p>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Active Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦3.5M</p>
                  <p className="text-sm text-muted-foreground">Total Targets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">68%</p>
                  <p className="text-sm text-muted-foreground">Avg. Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Groups */}
        <div className="space-y-6">
          {savingsGroups.map((group) => (
            <Card key={group.id} className={`${!group.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members}/{group.maxMembers} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {group.frequency} collections
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={group.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                      {group.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {group.nextCollection && (
                      <Badge variant="outline">
                        Next: {group.nextCollection}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress to Target</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(group.currentAmount)} / {formatCurrency(group.targetAmount)}
                    </span>
                  </div>
                  <Progress 
                    value={calculateProgress(group.currentAmount, group.targetAmount)} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {calculateProgress(group.currentAmount, group.targetAmount)}% complete
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">My Contribution</p>
                    <p className="text-xl font-bold">{formatCurrency(group.myContribution)}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Average per Member</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(Math.round(group.currentAmount / group.members))}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(group.targetAmount - group.currentAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  {group.isActive && (
                    <Button className="flex-1">
                      Make Payment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create New Group CTA */}
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start a New Savings Group</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your own Ajo or Esusu group and invite friends, family, or colleagues 
              to save together towards common goals.
            </p>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Savings Group
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
