
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Shield, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface APIConfig {
  id: string;
  provider: string;
  is_active: boolean;
  created_at: string;
}

export function APIKeyModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});

  // Form states for different providers
  const [flutterwaveKey, setFlutterwaveKey] = useState('');
  const [flutterwaveSecret, setFlutterwaveSecret] = useState('');
  const [binanceKey, setBinanceKey] = useState('');
  const [binanceSecret, setBinanceSecret] = useState('');
  const [coinbaseKey, setCoinbaseKey] = useState('');
  const [coinbaseSecret, setCoinbaseSecret] = useState('');

  const providers = [
    { 
      id: 'flutterwave', 
      name: 'Flutterwave', 
      description: 'For bank transfers and card payments',
      color: 'from-orange-600 to-red-600'
    },
    { 
      id: 'binance', 
      name: 'Binance', 
      description: 'For crypto trading and wallet services',
      color: 'from-yellow-600 to-orange-600'
    },
    { 
      id: 'coinbase', 
      name: 'Coinbase', 
      description: 'For crypto payments and wallet management',
      color: 'from-blue-600 to-indigo-600'
    },
  ];

  useEffect(() => {
    if (user && open) {
      fetchAPIConfigs();
    }
  }, [user, open]);

  const fetchAPIConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('id, provider, is_active, created_at')
        .eq('user_id', user?.id);

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error fetching API configs:', error);
      toast.error('Failed to load API configurations');
    }
  };

  const saveAPIConfig = async (provider: string, apiKey: string, apiSecret?: string) => {
    if (!apiKey.trim()) {
      toast.error('API Key is required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('save-api-config', {
        body: {
          provider,
          api_key: apiKey,
          api_secret: apiSecret || null
        }
      });

      if (error) throw error;

      toast.success(`${provider} API configuration saved successfully!`);
      await fetchAPIConfigs();
      
      // Clear form
      if (provider === 'flutterwave') {
        setFlutterwaveKey('');
        setFlutterwaveSecret('');
      } else if (provider === 'binance') {
        setBinanceKey('');
        setBinanceSecret('');
      } else if (provider === 'coinbase') {
        setCoinbaseKey('');
        setCoinbaseSecret('');
      }
    } catch (error) {
      console.error('Error saving API config:', error);
      toast.error('Failed to save API configuration');
    } finally {
      setLoading(false);
    }
  };

  const deleteAPIConfig = async (configId: string, provider: string) => {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .delete()
        .eq('id', configId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success(`${provider} configuration deleted`);
      await fetchAPIConfigs();
    } catch (error) {
      console.error('Error deleting API config:', error);
      toast.error('Failed to delete configuration');
    }
  };

  const toggleSecretVisibility = (configId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  const getProviderConfig = (providerId: string) => {
    return configs.find(config => config.provider === providerId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Key className="w-4 h-4 mr-2" />
          Manage API Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 border-amber-500/20 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-200 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            API Key Management
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="add">Add API Keys</TabsTrigger>
            <TabsTrigger value="manage">Manage Existing</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <div className="grid gap-6">
              {providers.map((provider) => {
                const existing = getProviderConfig(provider.id);
                return (
                  <Card key={provider.id} className="bg-slate-800/30 border-slate-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${provider.color}`}></div>
                            {provider.name}
                          </CardTitle>
                          <p className="text-slate-400 text-sm">{provider.description}</p>
                        </div>
                        {existing && (
                          <Badge variant="outline" className="border-green-500/20 text-green-400">
                            Configured
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {provider.id === 'flutterwave' && (
                        <>
                          <div>
                            <Label className="text-slate-300">Public Key</Label>
                            <Input
                              value={flutterwaveKey}
                              onChange={(e) => setFlutterwaveKey(e.target.value)}
                              placeholder="FLWPUBK_TEST-..."
                              className="bg-slate-700/50 border-slate-500/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Secret Key</Label>
                            <Input
                              value={flutterwaveSecret}
                              onChange={(e) => setFlutterwaveSecret(e.target.value)}
                              placeholder="FLWSECK_TEST-..."
                              type="password"
                              className="bg-slate-700/50 border-slate-500/20 text-white"
                            />
                          </div>
                          <Button 
                            onClick={() => saveAPIConfig('flutterwave', flutterwaveKey, flutterwaveSecret)}
                            disabled={loading || !flutterwaveKey}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                          >
                            Save Flutterwave Config
                          </Button>
                        </>
                      )}

                      {provider.id === 'binance' && (
                        <>
                          <div>
                            <Label className="text-slate-300">API Key</Label>
                            <Input
                              value={binanceKey}
                              onChange={(e) => setBinanceKey(e.target.value)}
                              placeholder="Your Binance API Key"
                              className="bg-slate-700/50 border-slate-500/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Secret Key</Label>
                            <Input
                              value={binanceSecret}
                              onChange={(e) => setBinanceSecret(e.target.value)}
                              placeholder="Your Binance Secret Key"
                              type="password"
                              className="bg-slate-700/50 border-slate-500/20 text-white"
                            />
                          </div>
                          <Button 
                            onClick={() => saveAPIConfig('binance', binanceKey, binanceSecret)}
                            disabled={loading || !binanceKey}
                            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
                          >
                            Save Binance Config
                          </Button>
                        </>
                      )}

                      {provider.id === 'coinbase' && (
                        <>
                          <div>
                            <Label className="text-slate-300">API Key</Label>
                            <Input
                              value={coinbaseKey}
                              onChange={(e) => setCoinbaseKey(e.target.value)}
                              placeholder="Your Coinbase API Key"
                              className="bg-slate-700/50 border-slate-500/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">API Secret</Label>
                            <Input
                              value={coinbaseSecret}
                              onChange={(e) => setCoinbaseSecret(e.target.value)}
                              placeholder="Your Coinbase API Secret"
                              type="password"
                              className="bg-slate-700/50 border-slate-500/20 text-white"
                            />
                          </div>
                          <Button 
                            onClick={() => saveAPIConfig('coinbase', coinbaseKey, coinbaseSecret)}
                            disabled={loading || !coinbaseKey}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                          >
                            Save Coinbase Config
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            {configs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">No API configurations found</p>
                <p className="text-slate-500 text-sm">Add your first API key to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {configs.map((config) => {
                  const provider = providers.find(p => p.id === config.provider);
                  return (
                    <Card key={config.id} className="bg-slate-800/30 border-slate-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${provider?.color || 'from-gray-600 to-gray-700'}`}></div>
                            <div>
                              <h4 className="text-white font-medium">{provider?.name || config.provider}</h4>
                              <p className="text-slate-400 text-sm">
                                Added {new Date(config.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={config.is_active 
                                ? "border-green-500/20 text-green-400" 
                                : "border-red-500/20 text-red-400"
                              }
                            >
                              {config.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAPIConfig(config.id, config.provider)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
