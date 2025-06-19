
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Get Reloadly access token
async function getReloadlyToken() {
  const response = await fetch('https://auth.reloadly.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: Deno.env.get('RELOADLY_CLIENT_ID'),
      client_secret: Deno.env.get('RELOADLY_CLIENT_SECRET'),
      grant_type: 'client_credentials',
      audience: 'https://topups.reloadly.com'
    }),
  })
  
  const data = await response.json()
  return data.access_token
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

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (action === 'sync-products') {
      // Sync Reloadly products to database
      const token = await getReloadlyToken()
      
      const response = await fetch('https://topups.reloadly.com/operators', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const operators = await response.json()

      for (const operator of operators) {
        await supabaseClient
          .from('reloadly_products')
          .upsert({
            reloadly_product_id: operator.id,
            name: operator.name,
            service_type: 'airtime', // Default to airtime
            country: operator.country.isoName,
            provider_code: operator.name.toLowerCase().replace(/\s+/g, '_'),
            denomination_type: operator.denominationType,
            min_amount: operator.minAmount,
            max_amount: operator.maxAmount,
            fixed_amounts: operator.fixedAmounts || [],
            currency: operator.destinationCurrencyCode,
            processing_time: operator.processingTime,
            metadata: operator,
            last_synced: new Date().toISOString()
          }, {
            onConflict: 'reloadly_product_id'
          })
      }

      return new Response(JSON.stringify({ status: 'success', synced: operators.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'purchase') {
      const { service_type, customer_id, amount, operator_id, payment_method } = await req.json()

      // Calculate fee
      const { data: feeData } = await supabaseClient.rpc('calculate_fee', {
        p_amount: amount,
        p_feature_type: 'bill_payment',
        p_currency: 'USD'
      })

      const fee = feeData || 0
      const total_amount = amount + fee

      // Get user's USD wallet for payment
      const { data: wallet } = await supabaseClient
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .eq('currency', 'USD')
        .single()

      if (!wallet || wallet.balance < total_amount) {
        return new Response(JSON.stringify({ error: 'Insufficient balance' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Create bill payment record
      const { data: billPayment } = await supabaseClient
        .from('bill_payments')
        .insert({
          user_id: user.id,
          wallet_id: wallet.id,
          bill_type: service_type,
          amount,
          currency: 'USD',
          fee,
          total_amount,
          customer_id,
          status: 'pending'
        })
        .select()
        .single()

      // Debit wallet
      const { error: debitError } = await supabaseClient.rpc('update_wallet_balance', {
        p_wallet_id: wallet.id,
        p_amount: total_amount,
        p_operation: 'debit'
      })

      if (debitError) {
        throw debitError
      }

      // Process with Reloadly
      const token = await getReloadlyToken()
      
      const reloadlyResponse = await fetch('https://topups.reloadly.com/topups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operatorId: operator_id,
          amount,
          useLocalAmount: false,
          customIdentifier: billPayment.id,
          recipientEmail: user.email,
          recipientPhone: {
            countryCode: customer_id.startsWith('+') ? customer_id.slice(0, 4) : '+234',
            number: customer_id.replace(/^\+\d{1,4}/, '')
          }
        }),
      })

      const reloadlyData = await reloadlyResponse.json()

      if (reloadlyData.id) {
        // Update bill payment with success
        await supabaseClient
          .from('bill_payments')
          .update({
            status: 'completed',
            delivery_status: 'delivered',
            reloadly_transaction_id: reloadlyData.id.toString(),
            processed_at: new Date().toISOString(),
            delivered_at: new Date().toISOString()
          })
          .eq('id', billPayment.id)

        // Create transaction record
        await supabaseClient
          .from('transactions')
          .insert({
            user_id: user.id,
            wallet_id: wallet.id,
            type: 'bills',
            status: 'completed',
            amount: -total_amount,
            currency: 'USD',
            fee,
            description: `${service_type} purchase for ${customer_id}`,
            reference: billPayment.id,
            external_reference: reloadlyData.id.toString()
          })

        return new Response(JSON.stringify({
          status: 'success',
          data: {
            bill_payment_id: billPayment.id,
            reloadly_transaction_id: reloadlyData.id,
            amount,
            fee,
            total_amount
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // If failed, refund wallet
      await supabaseClient.rpc('update_wallet_balance', {
        p_wallet_id: wallet.id,
        p_amount: total_amount,
        p_operation: 'credit'
      })

      await supabaseClient
        .from('bill_payments')
        .update({ status: 'failed' })
        .eq('id', billPayment.id)

      throw new Error('Reloadly transaction failed')
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Reloadly service error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
