export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          subdomain: string | null
          status: 'active' | 'blocked' | 'suspended'
          plan: 'free' | 'basic' | 'pro' | 'enterprise'
          settings: any
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subdomain?: string | null
          status?: 'active' | 'blocked' | 'suspended'
          plan?: 'free' | 'basic' | 'pro' | 'enterprise'
          settings?: any
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string | null
          status?: 'active' | 'blocked' | 'suspended'
          plan?: 'free' | 'basic' | 'pro' | 'enterprise'
          settings?: any
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'tenant' | 'staff'
          tenant_id: string | null
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'tenant' | 'staff'
          tenant_id?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'tenant' | 'staff'
          tenant_id?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tenant_courier_apis: {
        Row: {
          id: string
          tenant_id: string
          courier: string
          api_type: 'booking' | 'tracking' | 'label' | 'status' | 'cancel' | 'rate'
          api_url: string | null
          api_key: string | null
          password: string | null
          account_number: string | null
          sender_info: any | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          courier: string
          api_type: 'booking' | 'tracking' | 'label' | 'status' | 'cancel' | 'rate'
          api_url?: string | null
          api_key?: string | null
          password?: string | null
          account_number?: string | null
          sender_info?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          courier?: string
          api_type?: 'booking' | 'tracking' | 'label' | 'status' | 'cancel' | 'rate'
          api_url?: string | null
          api_key?: string | null
          password?: string | null
          account_number?: string | null
          sender_info?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courier_dispatches: {
        Row: {
          id: string
          tenant_id: string
          tracking_number: string
          courier: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          customer_address: string
          destination_city: string
          weight: number
          pieces: number
          cod_amount: number
          product_details: string | null
          special_instructions: string | null
          status: string
          courier_response: any | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          tracking_number: string
          courier: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          customer_address: string
          destination_city: string
          weight?: number
          pieces?: number
          cod_amount?: number
          product_details?: string | null
          special_instructions?: string | null
          status?: string
          courier_response?: any | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          tracking_number?: string
          courier?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          customer_address?: string
          destination_city?: string
          weight?: number
          pieces?: number
          cod_amount?: number
          product_details?: string | null
          special_instructions?: string | null
          status?: string
          courier_response?: any | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales_reports: {
        Row: {
          id: string
          tenant_id: string
          report_date: string
          seller_data: any | null
          totals: any | null
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          report_date: string
          seller_data?: any | null
          totals?: any | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          report_date?: string
          seller_data?: any | null
          totals?: any | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gpt_logs: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          feature: string
          prompt: string | null
          response: string | null
          tokens_used: number | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          feature: string
          prompt?: string | null
          response?: string | null
          tokens_used?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string
          feature?: string
          prompt?: string | null
          response?: string | null
          tokens_used?: number | null
          created_at?: string
        }
      }
    }
  }
}