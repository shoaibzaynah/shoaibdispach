import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'PKR'): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency === 'PKR' ? 'PKR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateTrackingNumber(courier: string): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${courier.toUpperCase()}${timestamp.slice(-6)}${random}`
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Add +92 prefix if not present
  if (cleaned.startsWith('92')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+92${cleaned.substring(1)}`
  } else if (cleaned.startsWith('3')) {
    return `+92${cleaned}`
  }
  
  return phone
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'text-green-500 bg-green-500/20'
    case 'pending':
      return 'text-yellow-500 bg-yellow-500/20'
    case 'in-transit':
      return 'text-blue-500 bg-blue-500/20'
    case 'cancelled':
      return 'text-red-500 bg-red-500/20'
    case 'returned':
      return 'text-orange-500 bg-orange-500/20'
    default:
      return 'text-gray-500 bg-gray-500/20'
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function calculateDeliveryTime(createdAt: string, deliveredAt?: string): number {
  const created = new Date(createdAt)
  const delivered = deliveredAt ? new Date(deliveredAt) : new Date()
  const diffTime = Math.abs(delivered.getTime() - created.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // Days
}

export function generatePassword(length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function removeEmptyFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      result[key] = obj[key]
    }
  }
  return result
}

export function downloadFile(data: string, filename: string, type = 'text/plain'): void {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
