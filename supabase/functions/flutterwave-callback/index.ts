
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const tx_ref = url.searchParams.get('tx_ref')
    const transaction_id = url.searchParams.get('transaction_id')

    if (status === 'successful' && tx_ref && transaction_id) {
      // Verify transaction with Flutterwave
      const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('FLUTTERWAVE_SECRET_KEY')}`,
        },
      })

      const verifyData = await verifyResponse.json()

      if (verifyData.status === 'success' && verifyData.data.status === 'successful') {
        // Update deposit status
        const { data: deposit } = await supabaseClient
          .from('deposits')
          .update({
            status: 'completed',
            provider_reference: transaction_id,
            processed_at: new Date().toISOString()
          })
          .eq('flutterwave_tx_ref', tx_ref)
          .select()
          .single()

        if (deposit) {
          // Update wallet balance
          await supabaseClient.rpc('update_wallet_balance', {
            p_wallet_id: deposit.wallet_id,
            p_amount: deposit.net_amount,
            p_operation: 'credit'
          })

          // Create transaction record
          await supabaseClient
            .from('transactions')
            .insert({
              user_id: deposit.user_id,
              wallet_id: deposit.wallet_id,
              type: 'deposit',
              status: 'completed',
              amount: deposit.net_amount,
              currency: deposit.currency,
              fee: deposit.fee,
              description: 'Wallet deposit via Flutterwave',
              reference: tx_ref,
              external_reference: transaction_id
            })
        }
      }
    }

    // Redirect to app
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${Deno.env.get('APP_URL')}/wallet?status=${status}&tx_ref=${tx_ref}`,
        ...corsHeaders
      },
    })

  } catch (error) {
    console.error('Callback error:', error)
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${Deno.env.get('APP_URL')}/wallet?status=error`,
        ...corsHeaders
      },
    })
  }
})
