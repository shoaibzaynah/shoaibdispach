-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if any (for fresh setup)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS gpt_logs CASCADE;
DROP TABLE IF EXISTS sales_reports CASCADE;
DROP TABLE IF EXISTS courier_dispatches CASCADE;
DROP TABLE IF EXISTS tenant_courier_apis CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Tenants table
CREATE TABLE public.tenants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'suspended')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'tenant' CHECK (role IN ('admin', 'tenant', 'staff')),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant Courier APIs
CREATE TABLE public.tenant_courier_apis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  courier TEXT NOT NULL,
  api_type TEXT NOT NULL CHECK (api_type IN ('booking', 'tracking', 'label', 'status', 'cancel', 'rate')),
  api_url TEXT,
  api_key TEXT,
  password TEXT,
  account_number TEXT,
  sender_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, courier, api_type)
);

-- Courier Dispatches
CREATE TABLE public.courier_dispatches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  tracking_number TEXT UNIQUE NOT NULL,
  courier TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  weight DECIMAL(10,2) DEFAULT 1,
  pieces INTEGER DEFAULT 1,
  cod_amount DECIMAL(10,2) DEFAULT 0,
  product_details TEXT,
  special_instructions TEXT,
  status TEXT DEFAULT 'pending',
  courier_response JSONB,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales Reports
CREATE TABLE public.sales_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  seller_data JSONB,
  totals JSONB,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GPT Logs
CREATE TABLE public.gpt_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  prompt TEXT,
  response TEXT,
  function_called TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_courier_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpt_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for tenants
CREATE POLICY "Users can view own tenant" ON tenants
  FOR SELECT USING (id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for courier_dispatches
CREATE POLICY "Users can view tenant dispatches" ON courier_dispatches
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert tenant dispatches" ON courier_dispatches
  FOR INSERT WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update tenant dispatches" ON courier_dispatches
  FOR UPDATE USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for sales_reports
CREATE POLICY "Users can view tenant sales reports" ON sales_reports
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert tenant sales reports" ON sales_reports
  FOR INSERT WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for tenant_courier_apis
CREATE POLICY "Users can view tenant courier APIs" ON tenant_courier_apis
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage tenant courier APIs" ON tenant_courier_apis
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- RLS Policies for gpt_logs
CREATE POLICY "Users can view tenant GPT logs" ON gpt_logs
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Admin policies (override RLS for admin users)
CREATE POLICY "Admin can view all data" ON courier_dispatches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    new.id, 
    new.email,
    CASE 
      WHEN new.email IN ('shoaiblilcubspk@gmail.com', 'shoaibzaynah@gmail.com') THEN 'admin'
      ELSE 'tenant'
    END
  );
  RETURN new;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_courier_dispatches_tenant_id ON courier_dispatches(tenant_id);
CREATE INDEX idx_courier_dispatches_tracking_number ON courier_dispatches(tracking_number);
CREATE INDEX idx_courier_dispatches_customer_phone ON courier_dispatches(customer_phone);
CREATE INDEX idx_courier_dispatches_status ON courier_dispatches(status);
CREATE INDEX idx_courier_dispatches_created_at ON courier_dispatches(created_at);
CREATE INDEX idx_gpt_logs_tenant_id ON gpt_logs(tenant_id);
CREATE INDEX idx_gpt_logs_created_at ON gpt_logs(created_at);

-- Full text search indexes
CREATE INDEX idx_courier_dispatches_customer_name_gin ON courier_dispatches USING gin(customer_name gin_trgm_ops);
CREATE INDEX idx_courier_dispatches_customer_address_gin ON courier_dispatches USING gin(customer_address gin_trgm_ops);

-- Insert demo data
INSERT INTO public.tenants (id, name, status, plan) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Demo Company', 'active', 'free');

-- Insert demo courier APIs
INSERT INTO public.tenant_courier_apis (tenant_id, courier, api_type, api_url, api_key, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'postex', 'booking', 'https://api.postex.pk/services/integration/api/order', 'demo_key', true),
('550e8400-e29b-41d4-a716-446655440000', 'postex', 'tracking', 'https://api.postex.pk/services/integration/api/order', 'demo_key', true),
('550e8400-e29b-41d4-a716-446655440000', 'blueex', 'booking', 'http://bigazure.com/api/demo/json/serverjson.php', 'demo_key', true),
('550e8400-e29b-41d4-a716-446655440000', 'blueex', 'tracking', 'http://bigazure.com/api/demo/json/serverjson.php', 'demo_key', true);

-- Insert demo shipments
INSERT INTO public.courier_dispatches (
  tenant_id, tracking_number, courier, customer_name, customer_phone, 
  customer_address, destination_city, cod_amount, product_details, status
) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'PX123456789', 'postex', 'Ali Ahmed', '03001234567', 'House 123, Block A, Gulberg, Lahore', 'Karachi', 2500, 'Mobile Phone Case', 'delivered'),
('550e8400-e29b-41d4-a716-446655440000', 'BX987654321', 'blueex', 'Sara Khan', '03009876543', 'Flat 45, F-8, Islamabad', 'Lahore', 1800, 'Books', 'in-transit'),
('550e8400-e29b-41d4-a716-446655440000', 'PX555666777', 'postex', 'Usman Shah', '03005556677', 'Shop 12, Main Market, Faisalabad', 'Rawalpindi', 3200, 'Electronics', 'pending');