# Frontend Edge Cases

Comprehensive edge case handling for frontend development.

## Data Loading Edge Cases

### Empty States

```tsx
// Handle empty data
{items.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-gray-500">No items found</p>
    <button onClick={handleAdd}>Add Item</button>
  </div>
) : (
  <ItemList items={items} />
)}
```

### Loading States

```tsx
// Handle loading
{loading ? (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : (
  <DataDisplay data={data} />
)}
```

### Error States

```tsx
// Handle errors
{error ? (
  <div className="p-4 bg-red-50 border border-red-200 rounded">
    <p className="text-red-800">{error.message}</p>
    <button onClick={handleRetry}>Retry</button>
  </div>
) : (
  <DataDisplay data={data} />
)}
```

## User Input Edge Cases

### Form Validation

```tsx
// Handle validation edge cases
const [errors, setErrors] = useState<Record<string, string>>({})

const validate = (data: FormData): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  // Empty input
  if (!data.name.trim()) {
    errors.name = 'Name is required'
  }
  
  // Too long
  if (data.name.length > 100) {
    errors.name = 'Name must be less than 100 characters'
  }
  
  // Special characters
  if (!/^[a-zA-Z0-9\s]+$/.test(data.name)) {
    errors.name = 'Name contains invalid characters'
  }
  
  return errors
}
```

### Network Edge Cases

```tsx
// Handle network failures
try {
  const response = await fetch('/api/data')
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const data = await response.json()
  setData(data)
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
    setError({ message: 'Network error. Please check your connection.' })
  } else {
    // Other errors
    setError({ message: error.message })
  }
}
```

## State Management Edge Cases

### Race Conditions

```tsx
// Prevent race conditions
useEffect(() => {
  let cancelled = false
  
  async function fetchData() {
    const data = await fetch('/api/data')
    if (!cancelled) {
      setData(data)
    }
  }
  
  fetchData()
  
  return () => {
    cancelled = true
  }
}, [])
```

### Stale Data

```tsx
// Handle stale data
const [data, setData] = useState(null)
const [version, setVersion] = useState(0)

useEffect(() => {
  let currentVersion = version
    
  async function fetchData() {
    const result = await fetch('/api/data')
        .then(res => res.json())
    
    // Only update if version matches
    if (currentVersion === version) {
      setData(result)
    }
  }
  
  fetchData()
}, [version])
```

## UI/UX Edge Cases

### Responsive Design

```tsx
// Handle responsive edge cases
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768)
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  return () => window.removeEventListener('resize', checkMobile)
}, [])

return (
  <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
    {content}
  </div>
)
```

### Accessibility

```tsx
// Handle keyboard navigation
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
  
  if (e.key === 'Escape') {
    handleClose()
  }
}

<button
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label="Close dialog"
>
  Close
</button>
```

## Best Practices

1. **Always handle empty states** - Never assume data exists
2. **Show loading indicators** - User feedback during async operations
3. **Handle errors gracefully** - Provide retry options
4. **Validate input** - Client-side validation before API calls
5. **Prevent race conditions** - Cleanup effects properly
6. **Handle network failures** - Retry logic and error messages
7. **Responsive design** - Test on multiple screen sizes
8. **Accessibility** - Keyboard navigation, ARIA labels
9. **Performance** - Lazy loading, code splitting
10. **Security** - Input sanitization, XSS prevention

