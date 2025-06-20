
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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

    // Create payment with NOWPayments
    const nowPaymentsPayload = {
      price_amount: parseFloat(amount),
      price_currency: 'usd', // Convert to USD first
      pay_currency: currency.toLowerCase(),
      order_id: transaction_id,
      order_description: `Banqa crypto wallet top-up - ${currency}`,
      ipn_callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/nowpayments-webhook`,
      success_url: `${req.headers.get('origin')}/wallet?status=success`,
      cancel_url: `${req.headers.get('origin')}/wallet?status=cancelled`
    }

    const nowPaymentsResponse = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('NOWPAYMENTS_API_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nowPaymentsPayload)
    })

    const paymentData = await nowPaymentsResponse.json()

    if (!nowPaymentsResponse.ok) {
      throw new Error(paymentData.message || 'NOWPayments API error')
    }

    // Update transaction with NOWPayments details
    await supabaseClient
      .from('real_time_transactions')
      .update({
        provider_reference: paymentData.payment_id,
        metadata: {
          nowpayments_data: paymentData,
          wallet_address: wallet.wallet_address,
          expected_amount: amount,
          currency: currency
        }
      })
      .eq('id', transaction_id)

    return new Response(JSON.stringify({
      status: 'success',
      payment_url: paymentData.payment_url,
      payment_address: paymentData.pay_address,
      payment_amount: paymentData.pay_amount,
      payment_id: paymentData.payment_id
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
