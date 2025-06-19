
-- Create enum for account types
CREATE TYPE account_type AS ENUM ('bank', 'crypto');

-- Create enum for crypto currencies
CREATE TYPE crypto_currency AS ENUM ('BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'DOT', 'MATIC');

-- Create bank accounts table
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_name VARCHAR(100) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  bank_code VARCHAR(10) NOT NULL,
  currency currency_type NOT NULL DEFAULT 'NGN',
  balance DECIMAL(20,8) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crypto wallets table
CREATE TABLE public.crypto_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crypto_currency crypto_currency NOT NULL,
  wallet_address VARCHAR(100) UNIQUE NOT NULL,
  private_key_encrypted TEXT NOT NULL,
  public_key TEXT NOT NULL,
  balance DECIMAL(20,8) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, crypto_currency)
);

-- Create real-time transactions table
CREATE TABLE public.real_time_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID,
  account_type account_type NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  provider_reference VARCHAR(100),
  blockchain_hash VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create API configurations table for user API keys
CREATE TABLE public.api_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  api_secret_encrypted TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Enable RLS on all tables
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;

-- RLS policies for bank_accounts
CREATE POLICY "Users can view their own bank accounts" ON public.bank_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bank accounts" ON public.bank_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bank accounts" ON public.bank_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for crypto_wallets
CREATE POLICY "Users can view their own crypto wallets" ON public.crypto_wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own crypto wallets" ON public.crypto_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own crypto wallets" ON public.crypto_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for real_time_transactions
CREATE POLICY "Users can view their own transactions" ON public.real_time_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON public.real_time_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for api_configurations
CREATE POLICY "Users can manage their own API configs" ON public.api_configurations
  FOR ALL USING (auth.uid() = user_id);

-- Function to generate unique account number
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS VARCHAR(20)
LANGUAGE plpgsql
AS $$
DECLARE
  account_num VARCHAR(20);
  exists_check BOOLEAN;
BEGIN
  LOOP
    account_num := '30' || LPAD(FLOOR(RANDOM() * 100000000)::text, 8, '0');
    SELECT EXISTS(SELECT 1 FROM public.bank_accounts WHERE account_number = account_num) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN account_num;
END;
$$;

-- Function to create bank account for new users
CREATE OR REPLACE FUNCTION create_user_bank_account()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  account_num VARCHAR(20);
  user_name VARCHAR(200);
BEGIN
  -- Generate unique account number
  account_num := generate_account_number();
  
  -- Get user name from metadata
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name',
    'Banqa User'
  );
  
  -- Create bank account
  INSERT INTO public.bank_accounts (
    user_id,
    account_number,
    account_name,
    bank_name,
    bank_code,
    currency
  ) VALUES (
    NEW.id,
    account_num,
    user_name,
    'Banqa Digital Bank',
    'BQ001',
    'NGN'
  );
  
  RETURN NEW;
END;
$$;

-- Update the existing handle_new_user trigger to include bank account creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  referral_code_val VARCHAR(20);
  account_num VARCHAR(20);
  user_name VARCHAR(200);
BEGIN
  -- Generate unique referral code
  referral_code_val := 'BQ' || UPPER(SUBSTRING(REPLACE(NEW.id::text, '-', ''), 1, 8));
  
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    phone, 
    first_name, 
    last_name, 
    email,
    referral_code
  ) VALUES (
    NEW.id,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email'),
    referral_code_val
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  
  -- Create default wallets for major African currencies
  INSERT INTO public.wallets (user_id, currency) VALUES 
    (NEW.id, 'NGN'),
    (NEW.id, 'KES'),
    (NEW.id, 'GHS'),
    (NEW.id, 'ZAR'),
    (NEW.id, 'XOF'),
    (NEW.id, 'USDT');
  
  -- Generate unique account number
  account_num := generate_account_number();
  
  -- Get user name from metadata
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name',
    'Banqa User'
  );
  
  -- Create bank account
  INSERT INTO public.bank_accounts (
    user_id,
    account_number,
    account_name,
    bank_name,
    bank_code,
    currency
  ) VALUES (
    NEW.id,
    account_num,
    user_name,
    'Banqa Digital Bank',
    'BQ001',
    'NGN'
  );
    
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable realtime for all new tables
ALTER TABLE public.bank_accounts REPLICA IDENTITY FULL;
ALTER TABLE public.crypto_wallets REPLICA IDENTITY FULL;
ALTER TABLE public.real_time_transactions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bank_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crypto_wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.real_time_transactions;
