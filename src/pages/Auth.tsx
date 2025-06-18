
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '+234',
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateSignUpData = () => {
    if (!signUpData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!signUpData.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!signUpData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!signUpData.phone.trim() || signUpData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateSignInData = () => {
    if (!signInData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!signInData.password.trim()) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignInData()) return;
    
    setIsLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpData()) return;

    setIsLoading(true);
    
    const { error } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.phone,
      signUpData.firstName,
      signUpData.lastName
    );
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="absolute top-4 left-4 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Banqa
            </CardTitle>
          </div>
          <CardDescription className="text-slate-300">
            Welcome to the future of African finance
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-slate-600">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-slate-600">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4 mt-6">
              <div className="flex items-center space-x-2 text-slate-300 mb-4">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure login with bank-grade encryption</span>
              </div>
              
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-slate-200">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-slate-200">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData({ ...signInData, password: e.target.value })
                    }
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-0" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="flex items-center space-x-2 text-slate-300 mb-4">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Create your secure Banqa account</span>
              </div>
              
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={signUpData.firstName}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, firstName: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={signUpData.lastName}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, lastName: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-200">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
                    value={signUpData.phone}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, phone: e.target.value })
                    }
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-200">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="john@example.com"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-200">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                    }
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-0" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
