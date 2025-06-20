export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_logs: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          intent: string | null
          message: string | null
          metadata: Json | null
          response: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          intent?: string | null
          message?: string | null
          metadata?: Json | null
          response?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          intent?: string | null
          message?: string | null
          metadata?: Json | null
          response?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_operations: {
        Row: {
          agent_id: string | null
          amount: number | null
          commission: number | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          customer_id: string | null
          id: string
          location: Json | null
          operation_type: string | null
          reference: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
        }
        Insert: {
          agent_id?: string | null
          amount?: number | null
          commission?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          customer_id?: string | null
          id?: string
          location?: Json | null
          operation_type?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Update: {
          agent_id?: string | null
          amount?: number | null
          commission?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          customer_id?: string | null
          id?: string
          location?: Json | null
          operation_type?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_operations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_operations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_configurations: {
        Row: {
          api_key_encrypted: string
          api_secret_encrypted: string | null
          created_at: string
          id: string
          is_active: boolean
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted: string
          api_secret_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string
          api_secret_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          balance: number
          bank_code: string
          bank_name: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_type"]
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          balance?: number
          bank_code: string
          bank_name: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          balance?: number
          bank_code?: string
          bank_name?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bill_payments: {
        Row: {
          amount: number
          bill_type: Database["public"]["Enums"]["service_type"]
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          customer_id: string
          delivered_at: string | null
          delivery_status: string | null
          fee: number | null
          flutterwave_tx_ref: string | null
          id: string
          metadata: Json | null
          payment_method_id: string | null
          processed_at: string | null
          reloadly_transaction_id: string | null
          service_provider_id: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          total_amount: number
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          bill_type: Database["public"]["Enums"]["service_type"]
          created_at?: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          customer_id: string
          delivered_at?: string | null
          delivery_status?: string | null
          fee?: number | null
          flutterwave_tx_ref?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          processed_at?: string | null
          reloadly_transaction_id?: string | null
          service_provider_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          total_amount: number
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          bill_type?: Database["public"]["Enums"]["service_type"]
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"]
          customer_id?: string
          delivered_at?: string | null
          delivery_status?: string | null
          fee?: number | null
          flutterwave_tx_ref?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          processed_at?: string | null
          reloadly_transaction_id?: string | null
          service_provider_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          total_amount?: number
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_payments_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_payments_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          balance: number | null
          card_name: string | null
          card_number: string | null
          card_type: Database["public"]["Enums"]["card_type"]
          created_at: string | null
          cvv: string | null
          expiry_month: number | null
          expiry_year: number | null
          id: string
          is_frozen: boolean | null
          spending_limit: number | null
          status: Database["public"]["Enums"]["card_status"] | null
          updated_at: string | null
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          balance?: number | null
          card_name?: string | null
          card_number?: string | null
          card_type: Database["public"]["Enums"]["card_type"]
          created_at?: string | null
          cvv?: string | null
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_frozen?: boolean | null
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          balance?: number | null
          card_name?: string | null
          card_number?: string | null
          card_type?: Database["public"]["Enums"]["card_type"]
          created_at?: string | null
          cvv?: string | null
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_frozen?: boolean | null
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_wallets: {
        Row: {
          balance: number
          created_at: string
          crypto_currency: Database["public"]["Enums"]["crypto_currency"]
          id: string
          is_active: boolean
          private_key_encrypted: string
          public_key: string
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          balance?: number
          created_at?: string
          crypto_currency: Database["public"]["Enums"]["crypto_currency"]
          id?: string
          is_active?: boolean
          private_key_encrypted: string
          public_key: string
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          balance?: number
          created_at?: string
          crypto_currency?: Database["public"]["Enums"]["crypto_currency"]
          id?: string
          is_active?: boolean
          private_key_encrypted?: string
          public_key?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      deposits: {
        Row: {
          amount: number
          created_at: string | null
          crypto_hash: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          fee: number | null
          flutterwave_tx_ref: string | null
          id: string
          metadata: Json | null
          net_amount: number
          payment_method_id: string | null
          processed_at: string | null
          provider_reference: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          crypto_hash?: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          fee?: number | null
          flutterwave_tx_ref?: string | null
          id?: string
          metadata?: Json | null
          net_amount: number
          payment_method_id?: string | null
          processed_at?: string | null
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          crypto_hash?: string | null
          currency?: Database["public"]["Enums"]["currency_type"]
          fee?: number | null
          flutterwave_tx_ref?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number
          payment_method_id?: string | null
          processed_at?: string | null
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deposits_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structure: {
        Row: {
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          feature_type: string
          fee_type: string
          fee_value: number
          id: string
          is_active: boolean | null
          max_fee: number | null
          min_fee: number | null
        }
        Insert: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          feature_type: string
          fee_type?: string
          fee_value?: number
          id?: string
          is_active?: boolean | null
          max_fee?: number | null
          min_fee?: number | null
        }
        Update: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          feature_type?: string
          fee_type?: string
          fee_value?: number
          id?: string
          is_active?: boolean | null
          max_fee?: number | null
          min_fee?: number | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string | null
          applied_at: string | null
          cover_letter: string | null
          documents: Json | null
          id: string
          job_id: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          documents?: Json | null
          id?: string
          job_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          documents?: Json | null
          id?: string
          job_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          country: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          description: string | null
          employer_id: string | null
          id: string
          job_type: string | null
          location: string | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          country?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          employer_id?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          country?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          employer_id?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          details: Json
          id: string
          is_active: boolean | null
          is_default: boolean | null
          provider: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          provider: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          provider?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proofs: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          original_image_url: string | null
          proof_type: string | null
          transaction_id: string | null
          user_id: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          verified_image_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          original_image_url?: string | null
          proof_type?: string | null
          transaction_id?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          verified_image_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          original_image_url?: string | null
          proof_type?: string | null
          transaction_id?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          verified_image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bvn: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          kyc_documents: Json | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          last_name: string | null
          nin: string | null
          phone: string
          referral_code: string | null
          referred_by: string | null
          updated_at: string | null
        }
        Insert: {
          bvn?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_name?: string | null
          nin?: string | null
          phone: string
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string | null
        }
        Update: {
          bvn?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_name?: string | null
          nin?: string | null
          phone?: string
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      real_time_transactions: {
        Row: {
          account_id: string | null
          account_type: Database["public"]["Enums"]["account_type"]
          amount: number
          blockchain_hash: string | null
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          processed_at: string | null
          provider_reference: string | null
          status: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          account_type: Database["public"]["Enums"]["account_type"]
          amount: number
          blockchain_hash?: string | null
          created_at?: string
          currency: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          provider_reference?: string | null
          status?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          account_type?: Database["public"]["Enums"]["account_type"]
          amount?: number
          blockchain_hash?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          provider_reference?: string | null
          status?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      reloadly_products: {
        Row: {
          country: string
          created_at: string | null
          currency: string | null
          denomination_type: string | null
          fixed_amounts: number[] | null
          id: string
          is_active: boolean | null
          last_synced: string | null
          max_amount: number | null
          metadata: Json | null
          min_amount: number | null
          name: string
          processing_time: string | null
          provider_code: string | null
          reloadly_product_id: number
          service_type: Database["public"]["Enums"]["service_type"]
        }
        Insert: {
          country: string
          created_at?: string | null
          currency?: string | null
          denomination_type?: string | null
          fixed_amounts?: number[] | null
          id?: string
          is_active?: boolean | null
          last_synced?: string | null
          max_amount?: number | null
          metadata?: Json | null
          min_amount?: number | null
          name: string
          processing_time?: string | null
          provider_code?: string | null
          reloadly_product_id: number
          service_type: Database["public"]["Enums"]["service_type"]
        }
        Update: {
          country?: string
          created_at?: string | null
          currency?: string | null
          denomination_type?: string | null
          fixed_amounts?: number[] | null
          id?: string
          is_active?: boolean | null
          last_synced?: string | null
          max_amount?: number | null
          metadata?: Json | null
          min_amount?: number | null
          name?: string
          processing_time?: string | null
          provider_code?: string | null
          reloadly_product_id?: number
          service_type?: Database["public"]["Enums"]["service_type"]
        }
        Relationships: []
      }
      rewards: {
        Row: {
          action_type: string | null
          description: string | null
          earned_at: string | null
          id: string
          metadata: Json | null
          points: number
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          points: number
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_group_members: {
        Row: {
          group_id: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          total_contributed: number | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          total_contributed?: number | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          total_contributed?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "savings_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "savings_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "savings_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_groups: {
        Row: {
          contribution_amount: number | null
          created_at: string | null
          creator_id: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          current_members: number | null
          end_date: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          member_limit: number | null
          name: string
          start_date: string | null
          target_amount: number | null
        }
        Insert: {
          contribution_amount?: number | null
          created_at?: string | null
          creator_id?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          current_members?: number | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          member_limit?: number | null
          name: string
          start_date?: string | null
          target_amount?: number | null
        }
        Update: {
          contribution_amount?: number | null
          created_at?: string | null
          creator_id?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          current_members?: number | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          member_limit?: number | null
          name?: string
          start_date?: string | null
          target_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "savings_groups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          country: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          provider_code: string | null
          service_type: Database["public"]["Enums"]["service_type"]
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          provider_code?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          provider_code?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          description: string | null
          external_reference: string | null
          fee: number | null
          id: string
          metadata: Json | null
          processed_at: string | null
          recipient_id: string | null
          reference: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          description?: string | null
          external_reference?: string | null
          fee?: number | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          recipient_id?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"]
          description?: string | null
          external_reference?: string | null
          fee?: number | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          recipient_id?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          amount: number
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          description: string | null
          fee: number | null
          id: string
          net_amount: number
          processed_at: string | null
          recipient_email: string | null
          recipient_id: string | null
          recipient_phone: string | null
          recipient_wallet_id: string | null
          reference: string | null
          sender_id: string | null
          sender_wallet_id: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          description?: string | null
          fee?: number | null
          id?: string
          net_amount: number
          processed_at?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          recipient_wallet_id?: string | null
          reference?: string | null
          sender_id?: string | null
          sender_wallet_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"]
          description?: string | null
          fee?: number | null
          id?: string
          net_amount?: number
          processed_at?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          recipient_wallet_id?: string | null
          reference?: string | null
          sender_id?: string | null
          sender_wallet_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "transfers_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_recipient_wallet_id_fkey"
            columns: ["recipient_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_sender_wallet_id_fkey"
            columns: ["sender_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          id: string
          is_active: boolean | null
          locked_balance: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency: Database["public"]["Enums"]["currency_type"]
          id?: string
          is_active?: boolean | null
          locked_balance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          is_active?: boolean | null
          locked_balance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_fee: {
        Args: {
          p_amount: number
          p_feature_type: string
          p_currency?: Database["public"]["Enums"]["currency_type"]
        }
        Returns: number
      }
      generate_account_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      process_transfer: {
        Args: {
          p_sender_id: string
          p_recipient_id: string
          p_amount: number
          p_currency: Database["public"]["Enums"]["currency_type"]
          p_description?: string
        }
        Returns: string
      }
      update_wallet_balance: {
        Args: { p_wallet_id: string; p_amount: number; p_operation: string }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "bank" | "crypto"
      application_status: "pending" | "reviewing" | "accepted" | "rejected"
      card_status: "active" | "frozen" | "blocked" | "expired"
      card_type: "virtual" | "physical"
      crypto_currency:
        | "BTC"
        | "ETH"
        | "USDT"
        | "USDC"
        | "BNB"
        | "ADA"
        | "DOT"
        | "MATIC"
      currency_type:
        | "NGN"
        | "KES"
        | "GHS"
        | "ZAR"
        | "XOF"
        | "USDT"
        | "USD"
        | "EUR"
        | "GBP"
      job_status: "active" | "closed" | "draft"
      kyc_status: "pending" | "verified" | "rejected"
      service_type:
        | "airtime"
        | "data"
        | "electricity"
        | "tv"
        | "gaming"
        | "betting"
        | "gift_cards"
        | "flights"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "transfer"
        | "payment"
        | "airtime"
        | "bills"
        | "cards"
        | "rewards"
      user_role: "user" | "agent" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["bank", "crypto"],
      application_status: ["pending", "reviewing", "accepted", "rejected"],
      card_status: ["active", "frozen", "blocked", "expired"],
      card_type: ["virtual", "physical"],
      crypto_currency: [
        "BTC",
        "ETH",
        "USDT",
        "USDC",
        "BNB",
        "ADA",
        "DOT",
        "MATIC",
      ],
      currency_type: [
        "NGN",
        "KES",
        "GHS",
        "ZAR",
        "XOF",
        "USDT",
        "USD",
        "EUR",
        "GBP",
      ],
      job_status: ["active", "closed", "draft"],
      kyc_status: ["pending", "verified", "rejected"],
      service_type: [
        "airtime",
        "data",
        "electricity",
        "tv",
        "gaming",
        "betting",
        "gift_cards",
        "flights",
      ],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      transaction_type: [
        "deposit",
        "withdrawal",
        "transfer",
        "payment",
        "airtime",
        "bills",
        "cards",
        "rewards",
      ],
      user_role: ["user", "agent", "admin", "super_admin"],
    },
  },
} as const
