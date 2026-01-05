# Next.js Form Validation & Security

Comprehensive form validation patterns to reduce API costs, improve security, and enhance user experience.

## Why Frontend Validation Matters

1. **Cost Reduction**: Prevent invalid API calls, reducing server load and API costs
2. **Security**: Validate and sanitize input before sending to API
3. **User Experience**: Provide immediate feedback without waiting for server response
4. **Performance**: Reduce unnecessary network requests
5. **Data Quality**: Ensure only valid data reaches the backend

## Basic Form Validation

### Simple Validation Pattern

```tsx
// components/forms/ContactForm.tsx
'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation function
  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!data.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (data.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }

    // Email validation
    if (!data.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Message validation
    if (!data.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (data.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (data.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate before API call
    const validationErrors = validate(formData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return // Stop here - don't call API
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // Success - reset form
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      alert('Form submitted successfully!')
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

## Real-Time Validation

### On-Blur Validation

```tsx
'use client'

import { useState } from 'react'

interface FormFieldProps {
  name: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  validate?: (value: string) => string | undefined
}

export default function FormField({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  validate
}: FormFieldProps) {
  const [touched, setTouched] = useState(false)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true)
    if (onBlur) onBlur(e)
  }

  const displayError = touched && error

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border rounded-md ${
          displayError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {displayError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

## Schema-Based Validation

### Using Zod for Validation

```tsx
// lib/validations.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// components/forms/ContactForm.tsx
'use client'

import { useState } from 'react'
import { contactFormSchema, ContactFormData } from '@/lib/validations'

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate with Zod - prevents API call if invalid
    const result = contactFormSchema.safeParse(formData)
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message
        }
      })
      setErrors(fieldErrors)
      return // Stop - don't call API
    }

    // Validation passed - safe to call API
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data) // Validated data
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setFormData({ name: '', email: '', message: '' })
      setErrors({})
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Input Sanitization

### Sanitize Before Validation

```tsx
// lib/sanitize.ts
export function sanitizeString(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')
  
  // Remove script tags and content
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '')
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // Trim whitespace
  return sanitized.trim()
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Usage in form
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  
  // Sanitize before setting state
  const sanitized = name === 'email' 
    ? sanitizeEmail(value)
    : sanitizeString(value)
  
  setFormData(prev => ({ ...prev, [name]: sanitized }))
}
```

## Security Validation

### XSS Prevention

```tsx
// lib/security.ts
export function isSafeInput(input: string): boolean {
  // Check for script tags
  if (/<script/i.test(input)) return false
  
  // Check for event handlers
  if (/on\w+\s*=/i.test(input)) return false
  
  // Check for javascript: URLs
  if (/javascript:/i.test(input)) return false
  
  // Check for data: URLs that could be dangerous
  if (/data:text\/html/i.test(input)) return false
  
  return true
}

// Usage
const validate = (data: FormData): FormErrors => {
  const errors: FormErrors = {}
  
  // Security check
  if (!isSafeInput(data.name)) {
    errors.name = 'Invalid characters detected'
    return errors // Stop validation early
  }
  
  // Continue with other validations...
  return errors
}
```

### SQL Injection Prevention (Frontend)

```tsx
// lib/security.ts
export function containsSQLInjection(input: string): boolean {
  const dangerousPatterns = [
    /['";]/g,           // Quotes and semicolons
    /--/g,              // SQL comments
    /\/\*/g,            // SQL comments
    /\b(DROP|DELETE|INSERT|UPDATE|ALTER|EXEC|EXECUTE)\b/gi  // SQL keywords
  ]
  
  return dangerousPatterns.some(pattern => pattern.test(input))
}

// Usage in validation
if (containsSQLInjection(data.message)) {
  errors.message = 'Invalid characters detected'
  return errors // Prevent API call
}
```

## Cost Optimization Patterns

### Debounced Validation

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'

export default function SearchForm() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search to reduce API calls
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 3) {
        setResults([])
        return // Don't search for short queries
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300), // Wait 300ms after user stops typing
    []
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isSearching && <p>Searching...</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Validation Before API Call

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Step 1: Sanitize input
  const sanitized = {
    name: sanitizeString(formData.name),
    email: sanitizeEmail(formData.email),
    message: sanitizeString(formData.message)
  }
  
  // Step 2: Validate (prevents API call if invalid)
  const validationErrors = validate(sanitized)
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return // STOP HERE - No API call
  }
  
  // Step 3: Security check
  if (!isSafeInput(sanitized.message)) {
    setErrors({ message: 'Invalid content detected' })
    return // STOP HERE - No API call
  }
  
  // Step 4: Only call API if all checks pass
  setIsSubmitting(true)
  try {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized) // Safe, validated data
    })
  } finally {
    setIsSubmitting(false)
  }
}
```

## Complete Form Example

### Production-Ready Form Component

```tsx
// components/forms/SecureForm.tsx
'use client'

import { useState } from 'react'
import { sanitizeString, sanitizeEmail, isSafeInput } from '@/lib/security'
import { contactFormSchema } from '@/lib/validations'
import { z } from 'zod'

interface FormData {
  name: string
  email: string
  message: string
}

export default function SecureForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (data: FormData): Record<string, string> => {
    const result = contactFormSchema.safeParse(data)
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message
        }
      })
      return fieldErrors
    }
    
    return {}
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // 1. Sanitize all inputs
    const sanitized: FormData = {
      name: sanitizeString(formData.name),
      email: sanitizeEmail(formData.email),
      message: sanitizeString(formData.message)
    }
    
    // 2. Security check
    if (!isSafeInput(sanitized.message)) {
      setErrors({ message: 'Invalid content detected' })
      return // Prevent API call
    }
    
    // 3. Validate schema
    const validationErrors = validate(sanitized)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return // Prevent API call
    }
    
    // 4. All checks passed - safe to call API
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized)
      })

      if (!response.ok) {
        const errorData = await response.json()
        setErrors({ submit: errorData.message || 'Submission failed' })
        return
      }

      // Success
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      alert('Form submitted successfully!')
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Sanitize on change
    const sanitized = name === 'email' 
      ? sanitizeEmail(value)
      : sanitizeString(value)
    
    setFormData(prev => ({ ...prev, [name]: sanitized }))
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields with validation */}
      {errors.submit && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

## Best Practices

1. **Always Validate Before API Calls** - Prevent invalid requests
2. **Sanitize Input** - Remove dangerous content before validation
3. **Use Schema Validation** - Libraries like Zod for type-safe validation
4. **Real-Time Feedback** - Show errors as user types (on blur)
5. **Debounce Expensive Operations** - Reduce API calls for search/autocomplete
6. **Security Checks** - Validate for XSS, injection attacks
7. **Client-Side First** - Validate on client, but never trust client-only
8. **Clear Error Messages** - Help users fix issues quickly
9. **Disable Submit During Validation** - Prevent duplicate submissions
10. **Sanitize on Change** - Clean input as user types

## Cost Reduction Benefits

- **Reduced API Calls**: Invalid requests never reach the server
- **Lower Server Load**: Less processing for invalid data
- **Better UX**: Immediate feedback without network delay
- **Bandwidth Savings**: Only send valid data over network
- **Error Prevention**: Catch issues before they cost resources

