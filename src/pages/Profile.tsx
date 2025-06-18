
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Award, 
  Settings,
  Camera,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  const kycStatus = 'verified'; // This would come from the database
  const userStats = {
    transactionsCount: 127,
    totalSpent: 450000,
    savingsGroups: 3,
    rewardsPoints: 2850
  };

  const getKycStatusInfo = (status: string) => {
    switch (status) {
      case 'verified':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Verified' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending' };
      case 'rejected':
        return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Rejected' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100', text: 'Not Started' };
    }
  };

  const kycInfo = getKycStatusInfo(kycStatus);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </h1>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${kycInfo.bg}`}>
                    <kycInfo.icon className={`h-3 w-3 ${kycInfo.color}`} />
                    <span className={`text-xs font-medium ${kycInfo.color}`}>
                      {kycInfo.text}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {user?.user_metadata?.phone || 'No phone number'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(user?.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <Button>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{userStats.transactionsCount}</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">₦{userStats.totalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{userStats.savingsGroups}</p>
              <p className="text-sm text-muted-foreground">Savings Groups</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{userStats.rewardsPoints}</p>
              <p className="text-sm text-muted-foreground">Reward Points</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details and verification status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <p className="text-lg">{user?.user_metadata?.first_name || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <p className="text-lg">{user?.user_metadata?.last_name || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <p className="text-lg">{user?.user_metadata?.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Date of Birth</label>
                    <p className="text-lg">Not provided</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <p className="text-lg">Nigeria</p>
                  </div>
                </div>
                
                <Button>Update Information</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Verification</CardTitle>
                  <CardDescription>Complete your identity verification for full access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className={`h-6 w-6 ${kycInfo.color}`} />
                      <div>
                        <p className="font-medium">Identity Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Status: <span className={kycInfo.color}>{kycInfo.text}</span>
                        </p>
                      </div>
                    </div>
                    {kycStatus !== 'verified' && (
                      <Button>Complete KYC</Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified of new device logins</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive transaction alerts and updates</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Get important updates via email</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                  </div>
                  <Button variant="outline">English</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Currency Display</p>
                    <p className="text-sm text-muted-foreground">Primary currency for display</p>
                  </div>
                  <Button variant="outline">NGN (₦)</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Reward Points
                  </CardTitle>
                  <CardDescription>Earn points for using Banqa services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-4xl font-bold text-primary mb-2">{userStats.rewardsPoints}</div>
                    <p className="text-muted-foreground">Available Points</p>
                    <Button className="mt-4">Redeem Points</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Bill Payment', points: '+50', date: '2 days ago' },
                      { action: 'Friend Referral', points: '+200', date: '1 week ago' },
                      { action: 'Card Transaction', points: '+25', date: '1 week ago' },
                    ].map((reward, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{reward.action}</p>
                          <p className="text-sm text-muted-foreground">{reward.date}</p>
                        </div>
                        <Badge className="bg-green-500">{reward.points}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
