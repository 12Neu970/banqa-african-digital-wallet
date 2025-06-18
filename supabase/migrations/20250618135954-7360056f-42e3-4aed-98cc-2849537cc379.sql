
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create enums for various status types
CREATE TYPE public.kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.currency_type AS ENUM ('NGN', 'KES', 'GHS', 'ZAR', 'XOF', 'USDT', 'USD', 'EUR', 'GBP');
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment', 'airtime', 'bills', 'cards', 'rewards');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.card_type AS ENUM ('virtual', 'physical');
CREATE TYPE public.card_status AS ENUM ('active', 'frozen', 'blocked', 'expired');
CREATE TYPE public.user_role AS ENUM ('user', 'agent', 'admin', 'super_admin');
CREATE TYPE public.job_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE public.application_status AS ENUM ('pending', 'reviewing', 'accepted', 'rejected');
CREATE TYPE public.service_type AS ENUM ('airtime', 'data', 'electricity', 'tv', 'gaming', 'betting', 'gift_cards', 'flights');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  date_of_birth DATE,
  country VARCHAR(3), -- ISO country code
  nin VARCHAR(50),
  bvn VARCHAR(20),
  kyc_status kyc_status DEFAULT 'pending',
  kyc_documents JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Wallets table for multi-currency support
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  currency currency_type NOT NULL,
  balance DECIMAL(20,8) DEFAULT 0.00,
  locked_balance DECIMAL(20,8) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id),
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  amount DECIMAL(20,8) NOT NULL,
  currency currency_type NOT NULL,
  fee DECIMAL(20,8) DEFAULT 0.00,
  description TEXT,
  reference VARCHAR(100) UNIQUE,
  external_reference VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  recipient_id UUID REFERENCES public.profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Virtual and Physical Cards
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id),
  card_type card_type NOT NULL,
  status card_status DEFAULT 'active',
  card_number VARCHAR(19), -- Encrypted
  card_name VARCHAR(100),
  expiry_month INTEGER,
  expiry_year INTEGER,
  cvv VARCHAR(4), -- Encrypted
  spending_limit DECIMAL(20,8) DEFAULT 1000000.00,
  balance DECIMAL(20,8) DEFAULT 0.00,
  is_frozen BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service providers for utilities
CREATE TABLE public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  service_type service_type NOT NULL,
  country VARCHAR(3),
  provider_code VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs board
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.profiles(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  country VARCHAR(3),
  salary_min DECIMAL(15,2),
  salary_max DECIMAL(15,2),
  currency currency_type DEFAULT 'USD',
  job_type VARCHAR(50), -- full-time, part-time, contract, remote
  status job_status DEFAULT 'active',
  requirements TEXT[],
  benefits TEXT[],
  application_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  cover_letter TEXT,
  documents JSONB DEFAULT '{}', -- Store document URLs/paths
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Payment proofs for verification
CREATE TABLE public.payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.transactions(id),
  proof_type VARCHAR(50), -- screenshot, receipt, bank_statement
  original_image_url TEXT,
  verified_image_url TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent operations for offline support
CREATE TABLE public.agent_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.profiles(id),
  customer_id UUID REFERENCES public.profiles(id),
  operation_type VARCHAR(50), -- topup, withdrawal, payment
  amount DECIMAL(20,8),
  currency currency_type,
  status transaction_status DEFAULT 'pending',
  commission DECIMAL(20,8) DEFAULT 0.00,
  reference VARCHAR(100),
  location JSONB, -- GPS coordinates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings groups (Ajo/Esusu)
CREATE TABLE public.savings_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  creator_id UUID REFERENCES public.profiles(id),
  target_amount DECIMAL(20,8),
  currency currency_type DEFAULT 'NGN',
  contribution_amount DECIMAL(20,8),
  frequency VARCHAR(20), -- daily, weekly, monthly
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  member_limit INTEGER DEFAULT 50,
  current_members INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings group members
CREATE TABLE public.savings_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.savings_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_contributed DECIMAL(20,8) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(group_id, user_id)
);

-- Rewards and loyalty system
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type VARCHAR(50), -- referral, transaction, daily_login, kyc_complete
  points DECIMAL(10,2) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI assistant logs for n8n integration
CREATE TABLE public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  session_id VARCHAR(255),
  message TEXT,
  response TEXT,
  intent VARCHAR(100),
  confidence DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_phone ON public.profiles(phone);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_wallets_user_currency ON public.wallets(user_id, currency);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_cards_user_id ON public.cards(user_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_country ON public.jobs(country);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for wallets
CREATE POLICY "Users can view own wallets" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallets" ON public.wallets
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for cards
CREATE POLICY "Users can manage own cards" ON public.cards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all cards" ON public.cards
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can manage own jobs" ON public.jobs
  FOR ALL USING (auth.uid() = employer_id);

CREATE POLICY "Admins can manage all jobs" ON public.jobs
  FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for job applications
CREATE POLICY "Users can view own applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Users can create applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Employers can view applications for their jobs" ON public.job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = job_applications.job_id 
      AND jobs.employer_id = auth.uid()
    )
  );

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_code_val VARCHAR(20);
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
    
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update wallet balance safely
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  p_wallet_id UUID,
  p_amount DECIMAL(20,8),
  p_operation VARCHAR(10) -- 'credit' or 'debit'
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  IF p_operation = 'credit' THEN
    UPDATE public.wallets 
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE id = p_wallet_id;
  ELSIF p_operation = 'debit' THEN
    UPDATE public.wallets 
    SET balance = balance - p_amount,
        updated_at = NOW()
    WHERE id = p_wallet_id AND balance >= p_amount;
    
    IF NOT FOUND THEN
      RETURN FALSE; -- Insufficient balance
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$;
