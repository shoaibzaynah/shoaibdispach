import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'Lobocubs Courier Manager',
    template: '%s | Lobocubs Courier Manager'
  },
  description: 'Complete courier management solution for modern businesses. Track shipments, manage bookings, and grow your business with our powerful platform.',
  keywords: ['courier', 'logistics', 'shipment tracking', 'TCS', 'PostEx', 'BlueEx', 'Pakistan'],
  authors: [{ name: 'Lobocubs Team' }],
  creator: 'Lobocubs',
  metadataBase: new URL('https://courier.lobocubs.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://courier.lobocubs.com',
    title: 'Lobocubs Courier Manager',
    description: 'Complete courier management solution for modern businesses',
    siteName: 'Lobocubs Courier Manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lobocubs Courier Manager',
    description: 'Complete courier management solution for modern businesses',
    creator: '@lobocubs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
