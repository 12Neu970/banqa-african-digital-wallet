
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
    )

    const webhookData = await req.json()
    console.log('NOWPayments webhook received:', webhookData)

    const { payment_id, payment_status, order_id, pay_amount, actually_paid } = webhookData

    if (payment_status === 'finished') {
      // Get transaction
      const { data: transaction } = await supabaseClient
        .from('real_time_transactions')
        .select('*')
        .eq('id', order_id)
        .eq('provider_reference', payment_id)
        .single()

      if (transaction) {
        // Update crypto wallet balance
        const { data: wallet } = await supabaseClient
          .from('crypto_wallets')
          .select('balance')
          .eq('id', transaction.account_id)
          .single()

        if (wallet) {
          await supabaseClient
            .from('crypto_wallets')
            .update({
              balance: parseFloat(wallet.balance) + parseFloat(actually_paid || pay_amount)
            })
            .eq('id', transaction.account_id)

          // Update transaction status
          await supabaseClient
            .from('real_time_transactions')
            .update({
              status: 'completed',
              processed_at: new Date().toISOString(),
              blockchain_hash: webhookData.outcome?.hash || `nowpayments_${payment_id}`
            })
            .eq('id', order_id)

          console.log(`Payment completed for transaction ${order_id}`)
        }
      }
    } else if (payment_status === 'failed' || payment_status === 'expired') {
      // Update transaction as failed
      await supabaseClient
        .from('real_time_transactions')
        .update({
          status: 'failed',
          processed_at: new Date().toISOString()
        })
        .eq('id', order_id)
        .eq('provider_reference', payment_id)
    }

    return new Response('OK', {
      status: 200,
      headers: corsHeaders,
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', {
      status: 500,
      headers: corsHeaders,
    })
  }
})
