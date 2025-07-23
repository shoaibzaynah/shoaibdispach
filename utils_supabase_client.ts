import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://mohoeoyfmlefjjueycqv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaG9lb3lmbWxlZmpqdWV5Y3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMzk1ODAsImV4cCI6MjA2ODYxNTU4MH0.qPIfFPNe3nVGQnYWRBQ4lxTjdLhi2g2aiu06rjXUWCM"
  )
}