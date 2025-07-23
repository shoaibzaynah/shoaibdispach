'use client'

import { ThemeProvider as NextThemeProvider } from '@/hooks/useTheme'

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemeProvider>) {
  return (
    <NextThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemeProvider>
  )
}
