# Next.js Best Practices

Production-ready patterns and best practices for Next.js applications.

## Component Organization

### File Structure

```
components/
├── ui/              # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── layout/          # Layout components
│   ├── Header.tsx
│   └── Footer.tsx
└── features/        # Feature-specific components
    └── auth/
        └── LoginForm.tsx
```

### Component Naming

- Use PascalCase for component files: `UserCard.tsx`
- Match component name to file name: `export default function UserCard()`
- Use descriptive names: `ProductCard` not `Card`

## Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image'

export default function ProductImage({ src, alt }: { src: string, alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={500}
      loading="lazy"
      placeholder="blur"
    />
  )
}
```

### Code Splitting

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable SSR if needed
})

export default function Page() {
  return <HeavyComponent />
}
```

### Memoization

```tsx
'use client'

import { memo, useMemo } from 'react'

interface ExpensiveListProps {
  items: Item[]
}

const ExpensiveList = memo(function ExpensiveList({ items }: ExpensiveListProps) {
  const processedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      processed: expensiveOperation(item)
    }))
  }, [items])
  
  return (
    <ul>
      {processedItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
})
```

## Accessibility

### Semantic HTML

```tsx
// Good: Semantic HTML
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

// Bad: Divs everywhere
<div>
  <div>
    <div>Home</div>
    <div>About</div>
  </div>
</div>
```

### ARIA Attributes

```tsx
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  ×
</button>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### Keyboard Navigation

```tsx
'use client'

import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])
  
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  
  return (
    <div role="dialog" aria-modal="true">
      <button ref={closeButtonRef} onClick={onClose}>Close</button>
    </div>
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
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  )
}
```

### Try-Catch in Server Components

```tsx
export default async function Page() {
  try {
    const data = await fetchData()
    return <div>{data}</div>
  } catch (error) {
    return <div>Error loading data</div>
  }
}
```

## SEO

### Metadata

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
  openGraph: {
    title: 'My Page',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
}

export default function Page() {
  return <div>Content</div>
}
```

### Dynamic Metadata

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.id)
  
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

## State Management

### Server State

```tsx
// Fetch in Server Components
export default async function Page() {
  const data = await fetchData()
  return <DataDisplay data={data} />
}
```

### Client State

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

## Testing

### Component Testing

```tsx
// __tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import Button from '@/components/ui/Button'

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button label="Click" onClick={handleClick} />)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Best Practices Summary

1. **Server Components First** - Use Server Components by default
2. **Minimize Client Components** - Only use when interactivity needed
3. **Type Everything** - Use TypeScript for all components
4. **Optimize Images** - Use Next.js Image component
5. **Code Split** - Use dynamic imports for heavy components
6. **Accessible** - Semantic HTML and ARIA attributes
7. **Error Handling** - Error boundaries and try-catch
8. **SEO** - Proper metadata and semantic HTML
9. **Performance** - Memoization, lazy loading, code splitting
10. **Testing** - Unit and integration tests

