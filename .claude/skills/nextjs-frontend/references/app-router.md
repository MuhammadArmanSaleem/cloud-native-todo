# Next.js App Router Patterns

App Router patterns and best practices for Next.js 13+ applications.

## File-Based Routing

### Basic Route Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page (/)
├── about/
│   └── page.tsx       # /about
├── blog/
│   ├── page.tsx       # /blog
│   └── [slug]/
│       └── page.tsx   # /blog/[slug]
└── dashboard/
    ├── layout.tsx     # Layout for /dashboard/*
    └── page.tsx        # /dashboard
```

### Dynamic Routes

```tsx
// app/posts/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

### Catch-All Routes

```tsx
// app/docs/[...slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params
  const path = slug.join('/')
  
  return <div>Documentation for: {path}</div>
}
```

## Layouts

### Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My App',
  description: 'A modern web application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Nested Layouts

```tsx
// app/dashboard/layout.tsx
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

## Server Components

### Default Server Components

```tsx
// app/products/page.tsx
interface Product {
  id: string
  name: string
  price: number
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Server Component with Metadata

```tsx
// app/posts/[id]/page.tsx
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

## Client Components

### Marking Client Components

```tsx
// app/components/InteractiveButton.tsx
'use client'

import { useState } from 'react'

export default function InteractiveButton() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

### Client Component with Props

```tsx
// app/components/Counter.tsx
'use client'

import { useState } from 'react'

interface CounterProps {
  initialValue?: number
}

export default function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
}
```

## Data Fetching

### Fetch with Caching

```tsx
// app/posts/page.tsx
async function getPosts() {
  // Revalidate every hour
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### Fetch with No Cache

```tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // Always fetch fresh data
  })
  return res.json()
}
```

## Loading and Error States

### Loading UI

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-200 rounded"></div>
      ))}
    </div>
  )
}
```

### Error Handling

```tsx
// app/posts/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Route Groups

### Organizing Routes

```
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx       # /
│   └── about/
│       └── page.tsx   # /about
└── (dashboard)/
    ├── layout.tsx
    └── dashboard/
        └── page.tsx   # /dashboard
```

## Best Practices

1. **Server Components by Default** - Use Server Components unless interactivity needed
2. **Minimize Client Components** - Only use `'use client'` when necessary
3. **Fetch in Server Components** - Fetch data in Server Components, pass as props
4. **Use TypeScript** - Type all props and params
5. **Handle Loading States** - Provide loading.tsx files
6. **Handle Errors** - Provide error.tsx files
7. **Metadata** - Use generateMetadata for SEO
8. **Layouts** - Use nested layouts for shared UI

