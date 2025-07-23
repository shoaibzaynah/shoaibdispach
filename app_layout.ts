import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { GPTAssistant } from '@/components/GPTAssistant'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lobocubs Courier Manager',
  description: 'AI-powered multi-courier management system for Pakistan',
  keywords: 'courier, logistics, Pakistan, PostEx, BlueEx, TCS, shipping, AI',
  authors: [{ name: 'Lobocubs Team' }],
  creator: 'Lobocubs',
  publisher: 'Lobocubs',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0070f3',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Lobocubs Courier Manager',
    description: 'AI-powered multi-courier management system for Pakistan',
    url: 'https://courier.lobocubs.pk',
    siteName: 'Lobocubs Courier Manager',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lobocubs Courier Manager',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lobocubs Courier Manager',
    description: 'AI-powered multi-courier management system for Pakistan',
    creator: '@lobocubs',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarnings>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <GPTAssistant />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}