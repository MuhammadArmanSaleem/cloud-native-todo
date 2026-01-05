# Next.js Frontend RBAC (Role-Based Access Control)

Comprehensive RBAC implementation patterns for Next.js frontend applications.

## RBAC Overview

Role-Based Access Control (RBAC) on the frontend controls what UI elements, routes, and features users can access based on their roles and permissions. This provides a better user experience and prevents unauthorized access attempts.

## User Context and Roles

### User Type Definition

```tsx
// types/user.ts
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'moderator' | 'user' | 'guest'
  permissions?: string[]
}

export type UserRole = User['role']
```

### User Context Provider

```tsx
// contexts/UserContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/user'

interface UserContextType {
  user: User | null
  isLoading: boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
  hasPermission: (permission: string) => boolean
  canAccess: (requiredRole: UserRole | UserRole[], requiredPermission?: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.role)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.role === 'admin') return true // Admins have all permissions
    return user.permissions?.includes(permission) ?? false
  }

  const canAccess = (requiredRole: UserRole | UserRole[], requiredPermission?: string): boolean => {
    if (!user) return false
    
    // Check role
    if (!hasRole(requiredRole)) return false
    
    // Check permission if specified
    if (requiredPermission && !hasPermission(requiredPermission)) return false
    
    return true
  }

  return (
    <UserContext.Provider value={{ user, isLoading, hasRole, hasPermission, canAccess }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
```

## Route Protection

### Protected Route Component

```tsx
// components/auth/ProtectedRoute.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { UserRole } from '@/types/user'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: string
  fallback?: React.ReactNode
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback
}: ProtectedRouteProps) {
  const { user, isLoading, canAccess } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return fallback || <div>Please log in to access this page.</div>
  }

  if (requiredRole || requiredPermission) {
    if (!canAccess(requiredRole || [], requiredPermission)) {
      return fallback || (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      )
    }
  }

  return <>{children}</>
}
```

### Route Protection in Layout

```tsx
// app/admin/layout.tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-xl font-semibold py-4">Admin Dashboard</h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
```

## Component-Level RBAC

### Conditional Rendering Based on Role

```tsx
// components/ui/RoleGuard.tsx
'use client'

import { useUser } from '@/contexts/UserContext'
import { UserRole } from '@/types/user'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: string
  fallback?: React.ReactNode
}

export default function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback = null
}: RoleGuardProps) {
  const { canAccess } = useUser()

  if (requiredRole || requiredPermission) {
    if (!canAccess(requiredRole || [], requiredPermission)) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// Usage
<RoleGuard requiredRole="admin">
  <AdminPanel />
</RoleGuard>

<RoleGuard requiredRole={['admin', 'moderator']} requiredPermission="moderate:posts">
  <ModerationTools />
</RoleGuard>
```

### Button with Role Check

```tsx
// components/ui/ProtectedButton.tsx
'use client'

import { useUser } from '@/contexts/UserContext'
import { UserRole } from '@/types/user'
import Button from './Button'

interface ProtectedButtonProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: string
  onClick?: () => void
  className?: string
}

export default function ProtectedButton({
  children,
  requiredRole,
  requiredPermission,
  onClick,
  className
}: ProtectedButtonProps) {
  const { canAccess } = useUser()

  if (requiredRole || requiredPermission) {
    if (!canAccess(requiredRole || [], requiredPermission)) {
      return null // Don't render button
    }
  }

  return (
    <Button onClick={onClick} className={className}>
      {children}
    </Button>
  )
}
```

## Menu/Navigation RBAC

### Role-Based Navigation

```tsx
// components/layout/Navigation.tsx
'use client'

import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'

export default function Navigation() {
  const { hasRole } = useUser()

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <Link href="/" className="py-4 text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link href="/posts" className="py-4 text-gray-700 hover:text-gray-900">
            Posts
          </Link>
          
          {hasRole(['admin', 'moderator']) && (
            <Link href="/moderate" className="py-4 text-gray-700 hover:text-gray-900">
              Moderate
            </Link>
          )}
          
          {hasRole('admin') && (
            <Link href="/admin" className="py-4 text-gray-700 hover:text-gray-900">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
```

## API Call Protection

### Protected API Hook

```tsx
// hooks/useProtectedFetch.ts
'use client'

import { useUser } from '@/contexts/UserContext'
import { UserRole } from '@/types/user'
import { useState } from 'react'

interface UseProtectedFetchOptions {
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: string
}

export function useProtectedFetch<T>(
  url: string,
  options: UseProtectedFetchOptions = {}
) {
  const { canAccess } = useUser()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    // Check permissions before API call
    if (options.requiredRole || options.requiredPermission) {
      if (!canAccess(options.requiredRole || [], options.requiredPermission)) {
        setError('Insufficient permissions')
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied')
        } else {
          setError('Failed to fetch data')
        }
        return
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchData }
}
```

## Permission-Based Features

### Feature Flag Component

```tsx
// components/ui/FeatureFlag.tsx
'use client'

import { useUser } from '@/contexts/UserContext'

interface FeatureFlagProps {
  children: React.ReactNode
  permission: string
  fallback?: React.ReactNode
}

export default function FeatureFlag({
  children,
  permission,
  fallback = null
}: FeatureFlagProps) {
  const { hasPermission } = useUser()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Usage
<FeatureFlag permission="moderate:posts">
  <ModerationPanel />
</FeatureFlag>
```

## Form Field Protection

### Conditional Form Fields

```tsx
// components/forms/PostForm.tsx
'use client'

import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'

export default function PostForm() {
  const { hasPermission } = useUser()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
    featured: false
  })

  return (
    <form>
      <input
        name="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
      />
      
      <textarea
        name="content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="Content"
      />

      {/* Only admins can publish */}
      {hasPermission('publish:posts') && (
        <label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          />
          Publish
        </label>
      )}

      {/* Only admins can feature */}
      {hasPermission('feature:posts') && (
        <label>
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          Feature
        </label>
      )}

      <button type="submit">Submit</button>
    </form>
  )
}
```

## Complete RBAC Example

### Full Implementation

```tsx
// app/layout.tsx
import { UserProvider } from '@/contexts/UserContext'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}

// app/admin/page.tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminDashboard from '@/components/admin/Dashboard'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}

// components/admin/Dashboard.tsx
'use client'

import { useUser } from '@/contexts/UserContext'
import RoleGuard from '@/components/ui/RoleGuard'
import ProtectedButton from '@/components/ui/ProtectedButton'

export default function AdminDashboard() {
  const { user } = useUser()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      <div className="mt-8 space-y-4">
        <RoleGuard requiredRole="admin" requiredPermission="manage:users">
          <section className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <ProtectedButton
              requiredPermission="delete:users"
              onClick={() => console.log('Delete users')}
            >
              Delete Users
            </ProtectedButton>
          </section>
        </RoleGuard>

        <RoleGuard requiredRole={['admin', 'moderator']}>
          <section className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Content Moderation</h2>
            <ProtectedButton
              requiredPermission="moderate:posts"
              onClick={() => console.log('Moderate posts')}
            >
              Moderate Posts
            </ProtectedButton>
          </section>
        </RoleGuard>
      </div>
    </div>
  )
}
```

## Best Practices

1. **Client-Side is Not Secure** - Always validate on backend; frontend RBAC is for UX only
2. **Consistent Checks** - Use same role/permission names as backend
3. **Graceful Degradation** - Hide features user can't access, don't show errors
4. **Loading States** - Show loading while checking permissions
5. **Error Handling** - Handle 403 errors gracefully
6. **Cache User Data** - Cache user role/permissions to reduce API calls
7. **Type Safety** - Use TypeScript for role/permission types
8. **Reusable Components** - Create reusable RBAC components

