
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

    const { wallet_id, amount, currency, payment_method, transaction_id } = await req.json()

    // Get wallet information
    const { data: wallet, error: walletError } = await supabaseClient
      .from('crypto_wallets')
      .select('wallet_address, crypto_currency')
      .eq('id', wallet_id)
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      return new Response(JSON.stringify({ error: 'Wallet not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate QR code data for crypto payment
    const qrData = {
      address: wallet.wallet_address,
      amount: amount,
      currency: currency,
      memo: `Banqa top-up ${transaction_id}`
    }

    // Generate a simple QR code URL (in production, use a proper QR code service)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(qrData))}`

    // Update transaction with crypto details
    await supabaseClient
      .from('real_time_transactions')
      .update({
        provider_reference: wallet.wallet_address,
        metadata: {
          wallet_address: wallet.wallet_address,
          qr_code_url: qrCodeUrl,
          expected_amount: amount,
          currency: currency
        }
      })
      .eq('id', transaction_id)

    // Simulate receiving crypto after 10 seconds (for demo purposes)
    setTimeout(async () => {
      try {
        // Update wallet balance
        await supabaseClient
          .from('crypto_wallets')
          .update({
            balance: wallet.balance + parseFloat(amount)
          })
          .eq('id', wallet_id)

        // Update transaction status
        await supabaseClient
          .from('real_time_transactions')
          .update({
            status: 'completed',
            processed_at: new Date().toISOString(),
            blockchain_hash: `0x${Math.random().toString(16).substring(2, 66)}`
          })
          .eq('id', transaction_id)

      } catch (error) {
        console.error('Error updating crypto transaction:', error)
      }
    }, 10000)

    return new Response(JSON.stringify({
      status: 'success',
      wallet_address: wallet.wallet_address,
      qr_code: qrCodeUrl,
      amount: amount,
      currency: currency
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
