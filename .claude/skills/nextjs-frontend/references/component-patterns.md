# Next.js Component Patterns

Component architecture patterns for building robust, reusable Next.js components.

## Component Structure

### Basic Component with Props

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export default function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors"
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
```

### Component with Children

```tsx
// components/ui/Card.tsx
interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`p-6 bg-white border border-gray-200 rounded-lg ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}
```

## Using Maps for Data Rendering

### Basic Map Pattern

```tsx
// types/index.ts
export interface User {
  id: string
  name: string
  email: string
  role: string
}

// components/UserList.tsx
import { User } from '@/types'

interface UserListProps {
  users: User[]
}

export default function UserList({ users }: UserListProps) {
  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user.id} className="p-4 border rounded">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <span className="text-xs text-blue-600">{user.role}</span>
        </li>
      ))}
    </ul>
  )
}
```

### Map with Conditional Rendering

```tsx
// components/ItemGrid.tsx
interface Item {
  id: string
  title: string
  status: 'active' | 'inactive'
}

interface ItemGridProps {
  items: Item[]
}

export default function ItemGrid({ items }: ItemGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{item.title}</h3>
          {item.status === 'active' ? (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              Active
            </span>
          ) : (
            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
              Inactive
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
```

### Map with Nested Components

```tsx
// components/ui/ProductCard.tsx
interface Product {
  id: string
  name: string
  price: number
  image?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-blue-600 font-medium mt-2">${product.price}</p>
      </div>
    </div>
  )
}

// components/ProductGrid.tsx
import ProductCard from './ui/ProductCard'
import { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## Component Composition

### Compound Components

```tsx
// components/ui/Accordion.tsx
interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export default function Accordion({ children, className = '' }: AccordionProps) {
  return (
    <div className={`border rounded-lg ${className}`}>
      {children}
    </div>
  )
}

// components/ui/AccordionItem.tsx
'use client'

import { useState } from 'react'

interface AccordionItemProps {
  title: string
  children: React.ReactNode
}

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b last:border-b-0">
      <button
        className="w-full px-4 py-3 text-left font-semibold flex justify-between items-center hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-gray-600">
          {children}
        </div>
      )}
    </div>
  )
}

// Usage
<Accordion>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2">Content 2</AccordionItem>
</Accordion>
```

### Render Props Pattern

```tsx
// components/ui/DataList.tsx
interface DataListProps<T> {
  data: T[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
}

export default function DataList<T>({ 
  data, 
  renderItem, 
  emptyMessage = 'No items found' 
}: DataListProps<T>) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
  }
  
  return (
    <ul className="space-y-2">
      {data.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage
<DataList
  data={users}
  renderItem={(user) => (
    <div className="p-4 border rounded">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )}
/>
```

## Props Patterns

### Optional Props with Defaults

```tsx
interface CardProps {
  title: string
  subtitle?: string
  image?: string
  actions?: React.ReactNode
  variant?: 'default' | 'compact' | 'featured'
}

export default function Card({
  title,
  subtitle,
  image,
  actions,
  variant = 'default'
}: CardProps) {
  const variantStyles = {
    default: 'p-6',
    compact: 'p-4',
    featured: 'p-8 border-2 border-blue-500'
  }
  
  return (
    <div className={`border rounded-lg ${variantStyles[variant]}`}>
      {image && <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg" />}
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
      {actions && <div className="mt-4">{actions}</div>}
    </div>
  )
}
```

### Spread Props Pattern

```tsx
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
```

## Best Practices

1. **Always define prop interfaces** - TypeScript interfaces for all props
2. **Use meaningful prop names** - Clear, descriptive names
3. **Provide default values** - For optional props when appropriate
4. **Use maps correctly** - Always include unique `key` prop
5. **Compose components** - Build complex UIs from simple components
6. **Keep components focused** - Single responsibility principle
7. **Extract reusable logic** - Custom hooks for shared state/effects
8. **Document complex props** - JSDoc comments for complex interfaces

