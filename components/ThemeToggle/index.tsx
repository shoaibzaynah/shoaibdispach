'use client'

import { Moon, Sun, Monitor, Palette } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ThemeToggle({ 
  variant = 'icon', 
  size = 'md', 
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme, actualTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ] as const

  const currentTheme = themes.find(t => t.key === theme)
  const CurrentIcon = currentTheme?.icon || Sun

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  if (variant === 'icon') {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(nextTheme)}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
          sizeClasses[size]
        )}
        title={`Switch to ${nextTheme} theme`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CurrentIcon className={iconSizes[size]} />
          </motion.div>
        </AnimatePresence>
      </motion.button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors px-3 py-2",
            showLabel ? "min-w-24" : sizeClasses[size]
          )}
        >
          <CurrentIcon className={iconSizes[size]} />
          {showLabel && (
            <span className="text-sm font-medium">{currentTheme?.label}</span>
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 min-w-48 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
              >
                {themes.map((themeOption) => {
                  const IconComponent = themeOption.icon
                  const isActive = theme === themeOption.key
                  
                  return (
                    <motion.button
                      key={themeOption.key}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      onClick={() => {
                        setTheme(themeOption.key)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="flex-1 text-left">{themeOption.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="active-theme"
                          className="w-2 h-2 rounded-full bg-primary"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.button>
                  )
                })}
                
                <div className="h-px bg-border my-1" />
                
                <div className="px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Current: <span className="font-medium capitalize">{actualTheme}</span>
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Inline variant
  return (
    <div className="flex items-center gap-2 p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        <div>
          <p className="font-medium">Theme</p>
          <p className="text-sm text-muted-foreground">
            Choose your preferred theme
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 ml-auto">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon
          const isActive = theme === themeOption.key
          
          return (
            <motion.button
              key={themeOption.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(themeOption.key)}
              className={cn(
                "relative p-2 rounded-lg border transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                  : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
              )}
              title={`${themeOption.label} theme`}
            >
              <IconComponent className="w-4 h-4" />
              {isActive && (
                <motion.div
                  layoutId="active-theme-inline"
                  className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
                  style={{ x: '-50%' }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
