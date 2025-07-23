import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Pakistani phone number validation
export function validatePhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/\s+/g, '')
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/
  return phoneRegex.test(cleanPhone)
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.startsWith('92')) {
    return `+92 ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`
  }
  if (cleanPhone.startsWith('03')) {
    return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`
  }
  return phone
}

// Format currency (PKR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

// Generate tracking number
export function generateTrackingNumber(prefix: string = 'LBC'): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${timestamp.slice(-6)}${random}`
}

// Validate tracking number
export function validateTrackingNumber(trackingNumber: string): boolean {
  const trackingRegex = /^[A-Z]{2,4}[0-9A-Z]{8,15}$/
  return trackingRegex.test(trackingNumber.toUpperCase())
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Capitalize first letter
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Generate random color for avatars
export function generateAvatarColor(seed: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Parse CSV data
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n')
  const result: string[][] = []
  
  for (const line of lines) {
    if (line.trim() === '') continue
    const row = line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    result.push(row)
  }
  
  return result
}

// Download file
export function downloadFile(data: string, filename: string, type: string = 'text/csv'): void {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Get status color class
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'status-pending'
    case 'delivered':
      return 'status-delivered'
    case 'cancelled':
      return 'status-cancelled'
    case 'in-transit':
    case 'in_transit':
      return 'status-in-transit'
    default:
      return 'badge-secondary'
  }
}

// Calculate shipping cost (basic formula)
export function calculateShippingCost(
  distance: number,
  weight: number,
  courier: string
): number {
  const baseCost = 150 // PKR
  const distanceCost = distance * 2 // PKR per km
  const weightCost = weight * 10 // PKR per kg
  
  let multiplier = 1
  switch (courier.toLowerCase()) {
    case 'tcs':
      multiplier = 1.2
      break
    case 'postex':
      multiplier = 1.0
      break
    case 'blueex':
      multiplier = 1.1
      break
    default:
      multiplier = 1.0
  }
  
  return Math.round((baseCost + distanceCost + weightCost) * multiplier)
}
