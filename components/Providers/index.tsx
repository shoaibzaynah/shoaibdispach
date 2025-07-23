'use client'

import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-background text-foreground border border-border',
          duration: 4000,
        }}
      />
    </ThemeProvider>
  )
}
