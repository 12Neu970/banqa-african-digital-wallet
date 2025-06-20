
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

    const { recipient_phone, recipient_email, amount, currency, description } = await req.json()

    // Find recipient by phone or email
    let recipient_id = null

    if (recipient_phone) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('phone', recipient_phone)
        .single()
      
      recipient_id = profile?.id
    } else if (recipient_email) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('email', recipient_email)
        .single()
      
      recipient_id = profile?.id
    }

    if (!recipient_id) {
      return new Response(JSON.stringify({ error: 'Recipient not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (recipient_id === user.id) {
      return new Response(JSON.stringify({ error: 'Cannot transfer to yourself' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Process transfer using database function
    const { data: transfer_id, error } = await supabaseClient.rpc('process_transfer', {
      p_sender_id: user.id,
      p_recipient_id: recipient_id,
      p_amount: amount,
      p_currency: currency,
      p_description: description
    })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({
      status: 'success',
      data: { transfer_id }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Transfer error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
