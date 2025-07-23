# 🚀 Lobocubs Courier Manager - Complete Deployment Guide

## 📁 Project Structure Overview
```
lobocubs-courier-manager/
├── app/                    # Next.js 14 App Router
├── components/             # React Components
├── lib/                    # Utility functions
├── types/                  # TypeScript types
├── hooks/                  # Custom React hooks
├── utils/supabase/         # Supabase configuration
├── supabase/              # Database schema
├── public/                # Static assets
├── package.json           # Dependencies
├── .env.local            # Environment variables
├── middleware.ts         # Route protection
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript config
└── next.config.js        # Next.js config
```

## 🔧 Step 1: Local Development Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- Supabase account
- OpenAI API key (optional but recommended)

### 1.1 Clone Repository
```bash
git clone https://github.com/yourusername/lobocubs-courier-manager.git
cd lobocubs-courier-manager
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Environment Variables
Create `.env.local` file in root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key

# PostEx API (Demo)
POSTEX_API_TOKEN=MzY1NDJmMTdiNWJjNGFmN2IzMGNmMzg5NzMxZGMyNjI6MWYyMTc4MGJiMzIyNGYzY2EwNGM0YTk1NzU2MWM0NWU=
POSTEX_API_URL=https://api.postex.pk/services/integration/api/order

# BlueEx API (Demo)
BLUEEX_API_URL=http://bigazure.com/api/demo/json/serverjson.php
BLUEEX_ACCOUNT=KHI-00000
BLUEEX_USER=demo
BLUEEX_PASSWORD=demo123456

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## 🗄️ Step 2: Supabase Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down Project URL and API keys

### 2.2 Run Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire content from `supabase/schema.sql`
3. Click "Run" to execute

### 2.3 Configure Authentication
1. Go to Authentication → Settings
2. Enable Email/Password
3. Set Site URL to your domain
4. Configure redirect URLs

## 🌐 Step 3: GitHub Repository Setup

### 3.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Lobocubs Courier Manager"
```

### 3.2 Create GitHub Repository
1. Go to GitHub and create new repository
2. Name it `lobocubs-courier-manager`
3. Make it public or private as needed

### 3.3 Push to GitHub
```bash
git remote add origin https://github.com/yourusername/lobocubs-courier-manager.git
git branch -M main
git push -u origin main
```

## 🚀 Step 4: Vercel Deployment

### 4.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository

### 4.2 Configure Environment Variables
In Vercel dashboard, go to Settings → Environment Variables and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
POSTEX_API_TOKEN=your-postex-token
POSTEX_API_URL=https://api.postex.pk/services/integration/api/order
BLUEEX_API_URL=http://bigazure.com/api/demo/json/serverjson.php
BLUEEX_ACCOUNT=your-account
BLUEEX_USER=your-username
BLUEEX_PASSWORD=your-password
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=generate-a-strong-secret
```

### 4.3 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed app

## ⚠️ Common Deployment Errors & Solutions

### Error 1: Module Not Found
**Error**: `Module not found: Can't resolve '@/components/...'`
**Solution**: 
```json
// tsconfig.json - ensure paths are correct
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error 2: Supabase Connection Issues
**Error**: `Invalid API key` or `Connection refused`
**Solution**:
1. Double-check environment variables
2. Ensure Supabase project is active
3. Verify API keys are correct

### Error 3: Build Fails on Vercel
**Error**: `TypeScript compilation errors`
**Solution**:
```bash
# Run locally to check for errors
npm run build
npm run type-check
```

### Error 4: Authentication Not Working
**Error**: Users can't login/signup
**Solution**:
1. Check Supabase Auth settings
2. Verify redirect URLs
3. Ensure RLS policies are correct

### Error 5: GPT Functions Not Working
**Error**: `OpenAI API error`
**Solution**:
1. Verify OpenAI API key
2. Check API usage limits
3. Ensure proper error handling

## 🛡️ Step 5: Security Configuration

### 5.1 Update Supabase Settings
1. Go to Authentication → URL Configuration
2. Add your Vercel domain to allowed redirect URLs
3. Set site URL to your production domain

### 5.2 Environment Security
- Never commit `.env.local` to GitHub
- Use different API keys for production
- Enable API rate limiting

## 🧪 Step 6: Testing & Verification

### 6.1 Test Authentication
1. Visit `/login`
2. Try signing up with new account
3. Test admin login: `shoaiblilcubspk@gmail.com`

### 6.2 Test GPT Features
1. Open GPT Assistant
2. Try commands like:
   - "Track PX123456789"
   - "Show all shipments"
   - "Get PostEx stats"

### 6.3 Test Courier APIs
1. Go to `/couriers`
2. Try creating a new shipment
3. Verify tracking works

## 📱 Step 7: Domain Setup (Optional)

### 7.1 Custom Domain
1. Buy domain (e.g., courier.lobocubs.pk)
2. In Vercel dashboard → Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### 7.2 Update Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://courier.lobocubs.pk
NEXTAUTH_URL=https://courier.lobocubs.pk
```

## 🔍 Step 8: Monitoring & Analytics

### 8.1 Vercel Analytics
- Automatically enabled for deployed apps
- View in Vercel dashboard

### 8.2 Error Monitoring
- Check Vercel Function logs
- Monitor Supabase logs
- Set up Sentry for error tracking (optional)

## 🚨 Critical Files That Must Be Correct

### 1. package.json
```json
{
  "name": "lobocubs-courier-manager",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 2. next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  }
}
module.exports = nextConfig
```

### 3. middleware.ts
```typescript
// Must be in root directory, not in app/ folder
import { type NextRequest, NextResponse } from 'next/server'
// ... rest of middleware code
```

### 4. app/layout.tsx
```typescript
// Must have suppressHydrationWarning for theme
<html lang="en" suppressHydrationWarning>
```

## 📋 Final Checklist

Before going live:
- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Authentication working
- [ ] GPT assistant responding
- [ ] Theme switching works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All API routes working
- [ ] RLS policies active
- [ ] Error handling in place

## 🆘 Troubleshooting

### If Build Fails
1. Check TypeScript errors: `npm run type-check`
2. Verify all imports are correct
3. Ensure all required files exist

### If Authentication Fails
1. Check Supabase RLS policies
2. Verify auth URLs in Supabase settings
3. Test with browser dev tools

### If GPT Doesn't Work
1. Verify OpenAI API key
2. Check function calling syntax
3. Test API routes directly

## 📞 Support

If you encounter issues:
1. Check GitHub Issues
2. Review Vercel deployment logs
3. Check Supabase logs
4. Contact: shoaiblilcubspk@gmail.com

---

🎉 **Congratulations!** Your Lobocubs Courier Manager is now live and ready to handle multi-courier operations with AI-powered assistance!