# Next.js Data Handling Patterns

Data fetching, passing, and rendering patterns in Next.js App Router.

## Server Components (Default)

### Fetching Data in Server Components

```tsx
// app/posts/page.tsx
interface Post {
  id: string
  title: string
  content: string
  author: string
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // or 'force-cache' for static
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <p className="text-sm text-gray-500">By {post.author}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
```

### Passing Data from Server to Client Components

```tsx
// app/components/PostList.tsx (Server Component)
import PostCard from './PostCard'
import { Post } from '@/types'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// app/components/PostCard.tsx (Client Component)
'use client'

import { useState } from 'react'
import { Post } from '@/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  
  return (
    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.content}</p>
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isLiked ? 'Liked' : 'Like'}
      </button>
    </div>
  )
}

// app/page.tsx
import PostList from './components/PostList'
import { Post } from '@/types'

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function Page() {
  const posts = await getPosts()
  
  return (
    <div>
      <h1>Blog Posts</h1>
      <PostList posts={posts} />
    </div>
  )
}
```

## Client Components

### Using useState and useEffect

```tsx
'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user')
        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])
  
  if (loading) {
    return <div className="p-4">Loading...</div>
  }
  
  if (!user) {
    return <div className="p-4">User not found</div>
  }
  
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  )
}
```

### Client Component with Props

```tsx
'use client'

import { useState } from 'react'

interface CounterProps {
  initialValue?: number
  step?: number
}

export default function Counter({ 
  initialValue = 0, 
  step = 1 
}: CounterProps) {
  const [count, setCount] = useState(initialValue)
  
  return (
    <div className="p-6 border rounded-lg">
      <p className="text-2xl font-bold mb-4">Count: {count}</p>
      <div className="space-x-2">
        <button
          onClick={() => setCount(count - step)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Decrease
        </button>
        <button
          onClick={() => setCount(count + step)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Increase
        </button>
      </div>
    </div>
  )
}
```

## Data Transformation

### Transforming Data Before Rendering

```tsx
// lib/utils.ts
export interface RawItem {
  id: number
  name: string
  category: string
  price: number
}

export interface ProcessedItem {
  id: string
  name: string
  category: string
  formattedPrice: string
}

export function processItems(rawItems: RawItem[]): ProcessedItem[] {
  return rawItems.map((item) => ({
    id: item.id.toString(),
    name: item.name,
    category: item.category,
    formattedPrice: `$${item.price.toFixed(2)}`
  }))
}

// app/items/page.tsx
import { processItems, ProcessedItem } from '@/lib/utils'

async function getItems() {
  const res = await fetch('https://api.example.com/items')
  const rawItems = await res.json()
  return processItems(rawItems)
}

export default async function ItemsPage() {
  const items = await getItems()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item: ProcessedItem) => (
          <div key={item.id} className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.category}</p>
            <p className="text-blue-600 font-medium mt-2">{item.formattedPrice}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Filtering and Sorting Data

```tsx
// components/FilteredList.tsx
interface Item {
  id: string
  name: string
  category: string
  price: number
}

interface FilteredListProps {
  items: Item[]
  category?: string
  sortBy?: 'name' | 'price'
}

export default function FilteredList({ 
  items, 
  category, 
  sortBy = 'name' 
}: FilteredListProps) {
  // Filter items
  const filtered = category
    ? items.filter(item => item.category === category)
    : items
  
  // Sort items
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price
    }
    return a.name.localeCompare(b.name)
  })
  
  return (
    <ul className="space-y-2">
      {sorted.map((item) => (
        <li key={item.id} className="p-4 border rounded">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.category}</p>
          <p className="text-blue-600">${item.price}</p>
        </li>
      ))}
    </ul>
  )
}
```

## Error Handling

### Error Boundaries

```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}
```

### Loading States

```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}
```

## Best Practices

1. **Fetch in Server Components** - Use Server Components for data fetching when possible
2. **Pass serializable props** - Props to Client Components must be serializable
3. **Use maps with keys** - Always provide unique keys in `.map()` calls
4. **Handle loading states** - Show loading indicators during data fetching
5. **Handle errors gracefully** - Use error boundaries and try-catch
6. **Transform data early** - Process data in Server Components before passing to Client
7. **Cache appropriately** - Use `cache` option in fetch for performance
8. **Type everything** - Use TypeScript interfaces for all data structures

