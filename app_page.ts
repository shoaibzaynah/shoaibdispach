import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if user is admin
    if (['shoaiblilcubspk@gmail.com', 'shoaibzaynah@gmail.com'].includes(user.email || '')) {
      redirect('/admin-dashboard')
    } else {
      redirect('/dashboard')
    }
  } else {
    redirect('/login')
  }
}