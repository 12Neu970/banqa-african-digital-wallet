
-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('bank_card', 'crypto_wallet', 'bank_account')),
  provider VARCHAR(50) NOT NULL, -- 'flutterwave', 'binance', etc.
  details JSONB NOT NULL DEFAULT '{}', -- encrypted card/account details
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deposits table for adding money
CREATE TABLE public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id),
  payment_method_id UUID REFERENCES public.payment_methods(id),
  amount DECIMAL(20,8) NOT NULL,
  currency currency_type NOT NULL,
  fee DECIMAL(20,8) DEFAULT 0.00,
  net_amount DECIMAL(20,8) NOT NULL,
  status transaction_status DEFAULT 'pending',
  provider_reference VARCHAR(255),
  flutterwave_tx_ref VARCHAR(255),
  crypto_hash VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transfers table for send money
CREATE TABLE public.transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id),
  sender_wallet_id UUID REFERENCES public.wallets(id),
  recipient_wallet_id UUID REFERENCES public.wallets(id),
  amount DECIMAL(20,8) NOT NULL,
  currency currency_type NOT NULL,
  fee DECIMAL(20,8) DEFAULT 0.00,
  net_amount DECIMAL(20,8) NOT NULL,
  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(255),
  description TEXT,
  status transaction_status DEFAULT 'pending',
  reference VARCHAR(100) UNIQUE,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bill payments table
CREATE TABLE public.bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id),
  payment_method_id UUID REFERENCES public.payment_methods(id),
  service_provider_id UUID REFERENCES public.service_providers(id),
  bill_type service_type NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  currency currency_type NOT NULL,
  fee DECIMAL(20,8) DEFAULT 0.00,
  total_amount DECIMAL(20,8) NOT NULL,
  customer_id VARCHAR(100) NOT NULL, -- phone number, meter number, etc.
  reloadly_transaction_id VARCHAR(255),
  flutterwave_tx_ref VARCHAR(255),
  status transaction_status DEFAULT 'pending',
  delivery_status VARCHAR(20) DEFAULT 'pending', -- pending, delivered, failed
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reloadly products table for caching
CREATE TABLE public.reloadly_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reloadly_product_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  service_type service_type NOT NULL,
  country VARCHAR(3) NOT NULL,
  provider_code VARCHAR(50),
  denomination_type VARCHAR(20), -- FIXED, RANGE
  min_amount DECIMAL(20,8),
  max_amount DECIMAL(20,8),
  fixed_amounts DECIMAL(20,8)[],
  currency VARCHAR(3) DEFAULT 'USD',
  processing_time VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fee structure table
CREATE TABLE public.fee_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_type VARCHAR(50) NOT NULL, -- 'deposit', 'transfer', 'bill_payment', 'withdrawal'
  fee_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed'
  fee_value DECIMAL(10,6) NOT NULL DEFAULT 0.369, -- 0.369%
  min_fee DECIMAL(20,8) DEFAULT 0.00,
  max_fee DECIMAL(20,8),
  currency currency_type DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default fee structure
INSERT INTO public.fee_structure (feature_type, fee_type, fee_value, min_fee) VALUES
('deposit', 'percentage', 0.369, 1.00),
('transfer', 'percentage', 0.369, 1.00),
('bill_payment', 'percentage', 0.369, 1.00),
('withdrawal', 'percentage', 0.369, 1.00);

-- Create indexes for performance
CREATE INDEX idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX idx_deposits_status ON public.deposits(status);
CREATE INDEX idx_transfers_sender_id ON public.transfers(sender_id);
CREATE INDEX idx_transfers_recipient_id ON public.transfers(recipient_id);
CREATE INDEX idx_transfers_status ON public.transfers(status);
CREATE INDEX idx_bill_payments_user_id ON public.bill_payments(user_id);
CREATE INDEX idx_bill_payments_status ON public.bill_payments(status);
CREATE INDEX idx_reloadly_products_service_type ON public.reloadly_products(service_type);
CREATE INDEX idx_reloadly_products_country ON public.reloadly_products(country);

-- Enable RLS on new tables
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reloadly_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structure ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_methods
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for deposits
CREATE POLICY "Users can view own deposits" ON public.deposits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create deposits" ON public.deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transfers
CREATE POLICY "Users can view own transfers" ON public.transfers
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create transfers" ON public.transfers
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for bill_payments
CREATE POLICY "Users can manage own bill payments" ON public.bill_payments
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reloadly_products (public read)
CREATE POLICY "Anyone can view reloadly products" ON public.reloadly_products
  FOR SELECT USING (true);

-- RLS Policies for fee_structure (public read)
CREATE POLICY "Anyone can view fee structure" ON public.fee_structure
  FOR SELECT USING (true);

-- Function to calculate fees
CREATE OR REPLACE FUNCTION public.calculate_fee(
  p_amount DECIMAL(20,8),
  p_feature_type VARCHAR(50),
  p_currency currency_type DEFAULT 'USD'
)
RETURNS DECIMAL(20,8)
LANGUAGE PLPGSQL
STABLE
AS $$
DECLARE
  fee_config RECORD;
  calculated_fee DECIMAL(20,8);
BEGIN
  -- Get fee configuration
  SELECT fee_type, fee_value, min_fee, max_fee
  INTO fee_config
  FROM public.fee_structure
  WHERE feature_type = p_feature_type
    AND currency = p_currency
    AND is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    -- Default to 0.369% if no config found
    calculated_fee := p_amount * 0.00369;
  ELSE
    IF fee_config.fee_type = 'percentage' THEN
      calculated_fee := p_amount * (fee_config.fee_value / 100);
    ELSE
      calculated_fee := fee_config.fee_value;
    END IF;

    -- Apply min/max limits
    IF fee_config.min_fee IS NOT NULL AND calculated_fee < fee_config.min_fee THEN
      calculated_fee := fee_config.min_fee;
    END IF;

    IF fee_config.max_fee IS NOT NULL AND calculated_fee > fee_config.max_fee THEN
      calculated_fee := fee_config.max_fee;
    END IF;
  END IF;

  RETURN calculated_fee;
END;
$$;

-- Function to process transfers
CREATE OR REPLACE FUNCTION public.process_transfer(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_amount DECIMAL(20,8),
  p_currency currency_type,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  sender_wallet_id UUID;
  recipient_wallet_id UUID;
  fee_amount DECIMAL(20,8);
  net_amount DECIMAL(20,8);
  transfer_id UUID;
  transfer_ref VARCHAR(100);
BEGIN
  -- Get sender wallet
  SELECT id INTO sender_wallet_id
  FROM public.wallets
  WHERE user_id = p_sender_id AND currency = p_currency AND is_active = true;

  -- Get recipient wallet
  SELECT id INTO recipient_wallet_id
  FROM public.wallets
  WHERE user_id = p_recipient_id AND currency = p_currency AND is_active = true;

  IF sender_wallet_id IS NULL OR recipient_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for currency %', p_currency;
  END IF;

  -- Calculate fee
  fee_amount := public.calculate_fee(p_amount, 'transfer', p_currency);
  net_amount := p_amount - fee_amount;

  -- Check sender balance
  IF NOT public.update_wallet_balance(sender_wallet_id, p_amount, 'debit') THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Generate unique reference
  transfer_ref := 'TRF' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 10));

  -- Create transfer record
  INSERT INTO public.transfers (
    sender_id, recipient_id, sender_wallet_id, recipient_wallet_id,
    amount, currency, fee, net_amount, reference, status
  ) VALUES (
    p_sender_id, p_recipient_id, sender_wallet_id, recipient_wallet_id,
    p_amount, p_currency, fee_amount, net_amount, transfer_ref, 'completed'
  ) RETURNING id INTO transfer_id;

  -- Credit recipient wallet
  PERFORM public.update_wallet_balance(recipient_wallet_id, net_amount, 'credit');

  -- Create transaction records
  INSERT INTO public.transactions (user_id, wallet_id, type, status, amount, currency, fee, description, reference)
  VALUES 
    (p_sender_id, sender_wallet_id, 'transfer', 'completed', -p_amount, p_currency, fee_amount, 'Transfer sent: ' || COALESCE(p_description, ''), transfer_ref),
    (p_recipient_id, recipient_wallet_id, 'transfer', 'completed', net_amount, p_currency, 0.00, 'Transfer received: ' || COALESCE(p_description, ''), transfer_ref);

  RETURN transfer_id;
END;
$$;
