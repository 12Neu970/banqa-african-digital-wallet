
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

    const { account_id, amount, currency, payment_method, transaction_id } = await req.json()

    // Get user's Flutterwave API keys
    const { data: apiConfig } = await supabaseClient
      .from('api_configurations')
      .select('api_key_encrypted, api_secret_encrypted')
      .eq('user_id', user.id)
      .eq('provider', 'flutterwave')
      .eq('is_active', true)
      .single()

    if (!apiConfig) {
      return new Response(JSON.stringify({ error: 'Flutterwave API not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Decrypt API keys (simple base64 decoding - use proper encryption in production)
    const publicKey = atob(apiConfig.api_key_encrypted)
    const secretKey = atob(apiConfig.api_secret_encrypted || '')

    // Generate transaction reference
    const txRef = `banqa_${transaction_id}_${Date.now()}`

    // Create Flutterwave payment
    const flutterwavePayload = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      customer: {
        email: user.email,
        name: user.user_metadata?.first_name || 'Banqa User'
      },
      payment_options: payment_method === 'card' ? 'card' : 'ussd',
      redirect_url: `${req.headers.get('origin')}/wallet/callback`,
      meta: {
        account_id: account_id,
        transaction_id: transaction_id
      }
    }

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(flutterwavePayload)
    })

    const result = await response.json()

    if (result.status === 'success') {
      // Update transaction with provider reference
      await supabaseClient
        .from('real_time_transactions')
        .update({
          provider_reference: txRef,
          metadata: {
            ...flutterwavePayload.meta,
            flutterwave_response: result
          }
        })
        .eq('id', transaction_id)

      return new Response(JSON.stringify({
        status: 'success',
        payment_link: result.data.link,
        reference: txRef
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      throw new Error(result.message || 'Payment initialization failed')
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
