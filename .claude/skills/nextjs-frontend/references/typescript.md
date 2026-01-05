# Next.js TypeScript Patterns

TypeScript patterns and best practices for Next.js applications.

## Type Definitions

### Basic Interfaces

```tsx
// types/index.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

export interface Post {
  id: string
  title: string
  content: string
  author: User
  published: boolean
  tags: string[]
}
```

### Component Props Types

```tsx
// components/ui/Card.tsx
interface CardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function Card({ 
  title, 
  subtitle, 
  children, 
  onClick,
  className = '' 
}: CardProps) {
  return (
    <div className={`p-6 border rounded-lg ${className}`} onClick={onClick}>
      <h3 className="text-xl font-semibold">{title}</h3>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      {children}
    </div>
  )
}
```

### Generic Types

```tsx
// components/ui/List.tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
  emptyMessage?: string
}

export default function List<T>({ 
  items, 
  renderItem, 
  keyExtractor,
  emptyMessage = 'No items' 
}: ListProps<T>) {
  if (items.length === 0) {
    return <p>{emptyMessage}</p>
  }
  
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

// Usage
<List
  items={users}
  renderItem={(user) => <div>{user.name}</div>}
  keyExtractor={(user) => user.id}
/>
```

## Page Props

### Page Component Types

```tsx
// app/posts/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { category } = await searchParams
  
  const post = await getPost(id)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

### Layout Props

```tsx
// app/layout.tsx
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## API Route Types

### API Route Handler

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface User {
  id: string
  name: string
  email: string
}

export async function GET(request: NextRequest) {
  const users: User[] = await getUsers()
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body: Omit<User, 'id'> = await request.json()
  const user = await createUser(body)
  return NextResponse.json(user, { status: 201 })
}
```

## Utility Types

### Type Utilities

```tsx
// types/utils.ts
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Usage
interface User {
  id: string
  name: string
  email?: string
  role?: string
}

type UserWithEmail = RequiredFields<User, 'email'>
// { id: string, name: string, email: string, role?: string }

type UserWithoutId = Omit<User, 'id'>
// { name: string, email?: string, role?: string }
```

## Form Types

### Form Data Types

```tsx
// types/forms.ts
export interface ContactFormData {
  name: string
  email: string
  message: string
  subject?: string
}

export interface FormErrors {
  [key: string]: string | undefined
}

// components/ContactForm.tsx
'use client'

import { useState } from 'react'
import { ContactFormData, FormErrors } from '@/types/forms'

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    subject: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Validation and submission
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Event Handler Types

### Event Types

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

export default function Button({ onClick, onFocus, children }: ButtonProps) {
  return (
    <button onClick={onClick} onFocus={onFocus}>
      {children}
    </button>
  )
}

// Input events
interface InputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}
```

## Async Function Types

### Async Data Fetching

```tsx
// lib/api.ts
export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

export async function fetchUsers(): Promise<ApiResponse<User[]>> {
  try {
    const res = await fetch('/api/users')
    const data = await res.json()
    return { data, status: res.status }
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500 
    }
  }
}
```

## Type Guards

### Type Checking

```tsx
// lib/utils.ts
export function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  )
}

// Usage
function processUser(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.email)
  }
}
```

## Best Practices

1. **Always Type Props** - Define interfaces for all component props
2. **Use TypeScript Strict Mode** - Enable strict type checking
3. **Avoid `any`** - Use `unknown` and type guards instead
4. **Type Async Functions** - Explicitly type return values
5. **Use Utility Types** - Leverage `Omit`, `Pick`, `Partial`, etc.
6. **Type Event Handlers** - Use React event types
7. **Type API Responses** - Define interfaces for API data
8. **Use Type Guards** - For runtime type checking

