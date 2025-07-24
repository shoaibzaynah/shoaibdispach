import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lobocubs Courier Manager',
  description: 'Complete courier management solution'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{backgroundColor: '#0f172a', color: '#f1f5f9'}}>
        {children}
      </body>
    </html>
  )
}
