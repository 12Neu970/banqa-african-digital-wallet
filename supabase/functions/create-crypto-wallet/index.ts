
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { currency } = await req.json()

    if (!currency) {
      return new Response(JSON.stringify({ error: 'Currency is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate mock wallet address based on currency
    const generateWalletAddress = (crypto: string): string => {
      const randomBytes = crypto.toUpperCase() + Math.random().toString(36).substring(2, 15)
      
      switch (crypto) {
        case 'BTC':
          return '1' + randomBytes.substring(0, 33)
        case 'ETH':
        case 'USDT':
        case 'USDC':
          return '0x' + randomBytes.substring(0, 40)
        case 'BNB':
          return 'bnb' + randomBytes.substring(0, 39)
        case 'ADA':
          return 'addr1' + randomBytes.substring(0, 98)
        case 'DOT':
          return '1' + randomBytes.substring(0, 47)
        case 'MATIC':
          return '0x' + randomBytes.substring(0, 40)
        default:
          return '0x' + randomBytes.substring(0, 40)
      }
    }

    // Generate mock private key (in production, use proper cryptographic libraries)
    const privateKey = 'sk_' + Math.random().toString(36).substring(2, 50)
    const publicKey = 'pk_' + Math.random().toString(36).substring(2, 50)
    const walletAddress = generateWalletAddress(currency)

    // Simple encryption for private key storage
    const encryptedPrivateKey = btoa(privateKey)

    // Insert new crypto wallet
    const { data, error } = await supabaseClient
      .from('crypto_wallets')
      .insert({
        user_id: user.id,
        crypto_currency: currency,
        wallet_address: walletAddress,
        private_key_encrypted: encryptedPrivateKey,
        public_key: publicKey,
        balance: 0.0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: 'Failed to create wallet' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      wallet: {
        id: data.id,
        currency: data.crypto_currency,
        address: data.wallet_address,
        balance: data.balance
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
