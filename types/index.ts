export interface User {
  id: string
  email: string
  role: 'admin' | 'tenant' | 'staff'
  tenant_id?: string | null
  full_name?: string | null
  phone?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  name: string
  subdomain?: string | null
  status: 'active' | 'blocked' | 'suspended'
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  settings?: any
  logo_url?: string | null
  created_at: string
  updated_at: string
}

export interface CourierAPI {
  id: string
  tenant_id: string
  courier: string
  api_type: 'booking' | 'tracking' | 'label' | 'status' | 'cancel' | 'rate'
  api_url?: string | null
  api_key?: string | null
  password?: string | null
  account_number?: string | null
  sender_info?: any | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Dispatch {
  id: string
  tenant_id: string
  tracking_number: string
  courier: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  customer_address: string
  destination_city: string
  weight: number
  pieces: number
  cod_amount: number
  product_details?: string | null
  special_instructions?: string | null
  status: string
  courier_response?: any | null
  delivered_at?: string | null
  created_at: string
  updated_at: string
}

export interface SalesReport {
  id: string
  tenant_id: string
  report_date: string
  seller_data?: any | null
  totals?: any | null
  file_url?: string | null
  created_at: string
  updated_at: string
}

export interface GPTLog {
  id: string
  tenant_id: string
  user_id: string
  feature: string
  prompt?: string | null
  response?: string | null
  tokens_used?: number | null
  created_at: string
}

// Courier-specific types
export interface CourierCity {
  id: string
  name: string
  code?: string
}

export interface CourierBookingRequest {
  customer_name: string
  customer_phone: string
  customer_address: string
  destination_city: string
  weight?: number
  pieces?: number
  cod_amount?: number
  product_details?: string
  special_instructions?: string
}

export interface CourierBookingResponse {
  success: boolean
  tracking_number?: string
  error?: string
  courier_reference?: string
  label_url?: string
}

export interface CourierTrackingResponse {
  success: boolean
  status?: string
  tracking_history?: any[]
  current_location?: string
  estimated_delivery?: string
  error?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm {
  email: string
  password: string
  full_name: string
  company_name: string
  phone: string
}

export interface DispatchForm {
  courier: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address: string
  destination_city: string
  weight?: number
  pieces?: number
  cod_amount?: number
  product_details?: string
  special_instructions?: string
}

// Dashboard stats
export interface DashboardStats {
  total_shipments: number
  pending_shipments: number
  delivered_shipments: number
  total_cod: number
  success_rate: number
  recent_shipments: Dispatch[]
}

// GPT Assistant types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface GPTRequest {
  messages: ChatMessage[]
  feature?: string
}

// File upload types
export interface UploadedFile {
  file: File
  preview?: string
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}
