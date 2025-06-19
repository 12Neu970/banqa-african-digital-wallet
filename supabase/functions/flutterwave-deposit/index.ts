
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
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { amount, currency, payment_method_id } = await req.json()

    // Generate unique transaction reference
    const tx_ref = `BQ_${Date.now()}_${user.id.slice(0, 8)}`

    // Initialize Flutterwave payment
    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('FLUTTERWAVE_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency,
        redirect_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/flutterwave-callback`,
        customer: {
          email: user.email,
          name: user.user_metadata.first_name + ' ' + user.user_metadata.last_name,
        },
        customizations: {
          title: 'Banqa Wallet Deposit',
          description: 'Add money to your Banqa wallet',
          logo: 'https://banqa.app/logo.png',
        },
      }),
    })

    const flutterwaveData = await flutterwaveResponse.json()

    if (flutterwaveData.status === 'success') {
      // Calculate fee
      const { data: feeData } = await supabaseClient.rpc('calculate_fee', {
        p_amount: amount,
        p_feature_type: 'deposit',
        p_currency: currency
      })

      const fee = feeData || 0
      const net_amount = amount - fee

      // Get user's wallet
      const { data: wallet } = await supabaseClient
        .from('wallets')
        .select('id')
        .eq('user_id', user.id)
        .eq('currency', currency)
        .single()

      // Create deposit record
      const { data: deposit } = await supabaseClient
        .from('deposits')
        .insert({
          user_id: user.id,
          wallet_id: wallet.id,
          payment_method_id,
          amount,
          currency,
          fee,
          net_amount,
          flutterwave_tx_ref: tx_ref,
          status: 'pending'
        })
        .select()
        .single()

      return new Response(JSON.stringify({
        status: 'success',
        data: {
          payment_link: flutterwaveData.data.link,
          deposit_id: deposit.id,
          tx_ref
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Flutterwave payment initialization failed')

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
