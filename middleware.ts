import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    "https://mohoeoyfmlefjjueycqv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaG9lb3lmbWxlZmpqdWV5Y3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMzk1ODAsImV4cCI6MjA2ODYxNTU4MH0.qPIfFPNe3nVGQnYWRBQ4lxTjdLhi2g2aiu06rjXUWCM",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - require authentication
  const protectedRoutes = [
    '/dashboard',
    '/couriers',
    '/tracking',
    '/reports',
    '/sales',
    '/settings'
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin only routes
  if (request.nextUrl.pathname.startsWith('/admin-dashboard')) {
    if (!user || !['shoaiblilcubspk@gmail.com', 'shoaibzaynah@gmail.com'].includes(user.email || '')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if ((request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/signup')) && user) {
    // Check if user is admin
    if (['shoaiblilcubspk@gmail.com', 'shoaibzaynah@gmail.com'].includes(user.email || '')) {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}