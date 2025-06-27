// Common API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  external?: boolean
  children?: NavItem[]
}

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
} 