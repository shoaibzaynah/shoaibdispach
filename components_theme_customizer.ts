'use client'

import { useState, useEffect } from 'react'
import { Palette, Download, Upload, RotateCcw, Check, Copy } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface ColorScheme {
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
    muted: string
    border: string
    destructive: string
  }
}

const presetSchemes: ColorScheme[] = [
  {
    name: 'Ocean Blue',
    colors: {
      background: '216 34% 6%',
      foreground: '213 31% 91%',
      primary: '217 91% 60%',
      secondary: '216 34% 17%',
      accent: '216 34% 17%',
      muted: '216 34% 17%',
      border: '216 34% 17%',
      destructive: '0 63% 31%'
    }
  },
  {
    name: 'Forest Green',
    colors: {
      background: '152 39% 6%',
      foreground: '150 30% 91%',
      primary: '142 76% 36%',
      secondary: '152 39% 17%',
      accent: '152 39% 17%',
      muted: '152 39% 17%',
      border: '152 39% 17%',
      destructive: '0 63% 31%'
    }
  },
  {
    name: 'Royal Purple',
    colors: {
      background: '263 39% 6%',
      foreground: '261 30% 91%',
      primary: '263 70% 50%',
      secondary: '263 39% 17%',
      accent: '263 39% 17%',
      muted: '263 39% 17%',
      border: '263 39% 17%',
      destructive: '0 63% 31%'
    }
  },
  {
    name: 'Sunset Orange',
    colors: {
      background: '24 39% 6%',
      foreground: '22 30% 91%',
      primary: '21 90% 48%',
      secondary: '24 39% 17%',
      accent: '24 39% 17%',
      muted: '24 39% 17%',
      border: '24 39% 17%',
      destructive: '0 63% 31%'
    }
  }
]

export function ThemeCustomizer() {
  const { theme, actualTheme } = useTheme()
  const [customColors, setCustomColors] = useState(presetSchemes[0].colors)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [isCustomizing, setIsCustomizing] = useState(false)

  useEffect(() => {
    // Load saved custom colors
    const saved = localStorage.getItem('lobocubs-custom-colors')
    if (saved) {
      try {
        setCustomColors(JSON.parse(saved))
        setIsCustomizing(true)
      } catch (error) {
        console.error('Failed to load custom colors:', error)
      }
    }
  }, [])

  const applyColors = (colors: ColorScheme['colors']) => {
    const root = document.documentElement
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    setCustomColors(colors)
    localStorage.setItem('lobocubs-custom-colors', JSON.stringify(colors))
    setIsCustomizing(true)
  }

  const resetToDefault = () => {
    const root = document.documentElement
    Object.keys(customColors).forEach(key => {
      root.style.removeProperty(`--${key}`)
    })
    localStorage.removeItem('lobocubs-custom-colors')
    setIsCustomizing(false)
    setActivePreset(null)
    toast.success('Reset to default theme')
  }

  const exportTheme = () => {
    const themeData = {
      name: 'Custom Theme',
      colors: customColors,
      baseTheme: actualTheme,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lobocubs-theme-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Theme exported successfully')
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string)
        if (themeData.colors) {
          applyColors(themeData.colors)
          setActivePreset(null)
          toast.success(`Imported theme: ${themeData.name || 'Custom'}`)
        } else {
          throw new Error('Invalid theme file')
        }
      } catch (error) {
        toast.error('Failed to import theme')
      }
    }
    reader.readAsText(file)
  }

  const copyThemeCSS = () => {
    const cssVars = Object.entries(customColors)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n')
    
    const css = `:root {\n${cssVars}\n}`
    
    navigator.clipboard.writeText(css).then(() => {
      toast.success('CSS variables copied to clipboard')
    }).catch(() => {
      toast.error('Failed to copy CSS')
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">Theme Customizer</h3>
            <p className="text-sm text-muted-foreground">
              Customize your app's appearance
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefault}
            className="button-outline button-sm"
            disabled={!isCustomizing}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={exportTheme}
            className="button-outline button-sm"
            disabled={!isCustomizing}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="button-outline button-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importTheme}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preset Schemes */}
      <div>
        <h4 className="font-medium mb-3">Preset Color Schemes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presetSchemes.map((scheme) => (
            <motion.button
              key={scheme.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                applyColors(scheme.colors)
                setActivePreset(scheme.name)
              }}
              className={cn(
                "p-4 rounded-lg border bg-card text-left transition-all",
                activePreset === scheme.name
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{scheme.name}</span>
                {activePreset === scheme.name && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex gap-1">
                {Object.entries(scheme.colors).slice(0, 6).map(([key, value]) => (
                  <div
                    key={key}
                    className="w-6 h-6 rounded border"
                    style={{
                      backgroundColor: `hsl(${value})`
                    }}
                    title={key}
                  />
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Custom Colors</h4>
          <button
            onClick={copyThemeCSS}
            className="button-ghost button-sm"
            disabled={!isCustomizing}
          >
            <Copy className="w-4 h-4" />
            Copy CSS
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(customColors).map(([key, value]) => {
            const colorValue = `hsl(${value})`
            return (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(value)}
                    onChange={(e) => {
                      const hslValue = hexToHsl(e.target.value)
                      const newColors = {
                        ...customColors,
                        [key]: hslValue
                      }
                      applyColors(newColors)
                      setActivePreset(null)
                    }}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const newColors = {
                          ...customColors,
                          [key]: e.target.value
                        }
                        setCustomColors(newColors)
                      }}
                      onBlur={() => {
                        applyColors(customColors)
                        setActivePreset(null)
                      }}
                      className="input text-xs font-mono"
                      placeholder="h s l"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Preview */}
      <div className="border rounded-lg p-4 bg-card">
        <h4 className="font-medium mb-3">Preview</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button className="button-primary button-sm">Primary Button</button>
            <button className="button-secondary button-sm">Secondary</button>
            <button className="button-outline button-sm">Outline</button>
          </div>
          <div className="p-3 bg-muted rounded">
            <p className="text-sm">This is muted background text</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-sm">This is a card with border</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v.replace('%', '')))
  const sNorm = s / 100
  const lNorm = l / 100
  
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = lNorm - c / 2
  
  let r = 0, g = 0, b = 0
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}