# Next.js Anti-Patterns

Common mistakes and anti-patterns to avoid in Next.js development.

## Component Anti-Patterns

### ❌ Missing Keys in Maps

```tsx
// BAD: Missing key prop
export default function ItemList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li>{item.name}</li>  // Missing key!
      ))}
    </ul>
  )
}

// ✅ GOOD: Proper key prop
export default function ItemList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### ❌ Using Index as Key

```tsx
// BAD: Using index as key
{items.map((item, index) => (
  <li key={index}>{item.name}</li>  // Can cause issues with reordering
))}

// ✅ GOOD: Use unique identifier
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

### ❌ Unnecessary Client Components

```tsx
// BAD: Client component when not needed
'use client'

export default function StaticContent() {
  return <div>This doesn't need client-side JavaScript</div>
}

// ✅ GOOD: Server Component (default)
export default function StaticContent() {
  return <div>This doesn't need client-side JavaScript</div>
}
```

### ❌ Prop Drilling

```tsx
// BAD: Passing props through many levels
function App() {
  const user = { id: '1', name: 'John' }
  return <Layout user={user} />
}

function Layout({ user }) {
  return <Header user={user} />
}

function Header({ user }) {
  return <UserMenu user={user} />
}

// ✅ GOOD: Use Context or composition
'use client'
import { createContext, useContext } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children, user }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
```

## Data Fetching Anti-Patterns

### ❌ Fetching in Client Components Unnecessarily

```tsx
// BAD: Fetching in Client Component when Server Component would work
'use client'

import { useEffect, useState } from 'react'

export default function Posts() {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts)
  }, [])
  
  return <div>{/* render posts */}</div>
}

// ✅ GOOD: Fetch in Server Component
export default async function Posts() {
  const posts = await fetch('/api/posts').then(res => res.json())
  return <div>{/* render posts */}</div>
}
```

### ❌ Not Handling Loading States

```tsx
// BAD: No loading state
export default function DataDisplay() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData().then(setData)
  }, [])
  
  return <div>{data.name}</div>  // Error if data is null
}

// ✅ GOOD: Handle loading state
export default function DataDisplay() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div>Loading...</div>
  if (!data) return <div>No data</div>
  
  return <div>{data.name}</div>
}
```

## TypeScript Anti-Patterns

### ❌ Using `any` Type

```tsx
// BAD: Using any
function processData(data: any) {
  return data.value
}

// ✅ GOOD: Use proper types
interface Data {
  value: string
}

function processData(data: Data) {
  return data.value
}
```

### ❌ Missing Prop Types

```tsx
// BAD: No prop types
export default function Card({ title, children }) {
  return <div>{title}{children}</div>
}

// ✅ GOOD: Proper TypeScript interfaces
interface CardProps {
  title: string
  children: React.ReactNode
}

export default function Card({ title, children }: CardProps) {
  return <div>{title}{children}</div>
}
```

## Styling Anti-Patterns

### ❌ Inline Styles

```tsx
// BAD: Inline styles
<div style={{ padding: '20px', backgroundColor: 'blue' }}>Content</div>

// ✅ GOOD: Tailwind classes or CSS Modules
<div className="p-5 bg-blue-600">Content</div>
```

### ❌ Global CSS for Components

```tsx
// BAD: Global CSS affecting all components
// globals.css
.card { padding: 20px; }

// ✅ GOOD: CSS Modules or Tailwind
// Card.module.css
.card { padding: 20px; }
```

## Performance Anti-Patterns

### ❌ Not Optimizing Images

```tsx
// BAD: Regular img tag
<img src="/image.jpg" alt="Description" />

// ✅ GOOD: Next.js Image component
import Image from 'next/image'
<Image src="/image.jpg" alt="Description" width={500} height={300} />
```

### ❌ Large Bundle Sizes

```tsx
// BAD: Importing entire library
import _ from 'lodash'

// ✅ GOOD: Import only what you need
import debounce from 'lodash/debounce'
```

## Accessibility Anti-Patterns

### ❌ Missing Alt Text

```tsx
// BAD: No alt text
<img src="/image.jpg" />

// ✅ GOOD: Descriptive alt text
<img src="/image.jpg" alt="A beautiful sunset over the ocean" />
```

### ❌ Non-semantic HTML

```tsx
// BAD: Using divs for everything
<div onClick={handleClick}>Click me</div>

// ✅ GOOD: Semantic HTML
<button onClick={handleClick}>Click me</button>
```

## Common Mistakes Summary

1. **Missing keys** - Always provide unique keys in maps
2. **Unnecessary client components** - Use Server Components by default
3. **Prop drilling** - Use Context or composition
4. **Fetching in Client Components** - Fetch in Server Components when possible
5. **No loading states** - Always handle loading and error states
6. **Using `any`** - Use proper TypeScript types
7. **Missing prop types** - Define interfaces for all props
8. **Inline styles** - Use Tailwind or CSS Modules
9. **Unoptimized images** - Use Next.js Image component
10. **Accessibility issues** - Use semantic HTML and ARIA attributes

