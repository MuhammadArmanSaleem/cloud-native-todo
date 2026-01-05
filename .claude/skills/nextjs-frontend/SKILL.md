---
name: nextjs-frontend
description: |
  Build modern Next.js frontend applications with minimalist techy design, robust component patterns using props and maps, TypeScript, and App Router best practices.
  Use when users ask to create Next.js UI, build React components, implement frontend interfaces, design minimalist techy interfaces, or develop modern web applications with Next.js.
---

# Next.js Frontend Builder

Create production-ready Next.js frontend applications with minimalist techy aesthetics and robust component patterns.

## What This Skill Does

- Creates Next.js applications with App Router structure
- Implements reusable components with props and TypeScript
- Uses maps for data-driven component rendering
- Applies minimalist techy design patterns
- Sets up Server and Client Components properly
- Implements data fetching patterns
- Configures Tailwind CSS for minimalist styling
- Creates responsive, accessible UI components
- Implements component composition patterns

## What This Skill Does NOT Do

- Backend API development
- Database design or integration
- Mobile app development (React Native)
- Desktop application development
- Deploy applications to production (but provides config examples)

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing Next.js structure, component patterns, styling approach, TypeScript usage, project conventions |
| **Conversation** | User's specific requirements, UI components needed, design preferences, data structure, constraints |
| **Skill References** | Next.js patterns from `references/` (components, props, maps, styling, App Router, best practices) |
| **User Guidelines** | Project-specific conventions, design system, team standards, coding style preferences |

Ensure all required context is gathered before implementing.
Only ask user for THEIR specific requirements (domain expertise is in this skill).

---

## Required Clarifications

Ask about USER'S context (not domain knowledge):

1. **Project scope**: "New Next.js app or adding to existing project?"
2. **Components**: "What UI components do you need? (buttons, cards, lists, forms, etc.)"
3. **Data structure**: "What data will components display? (arrays, objects, API responses)"
4. **Styling approach**: "Tailwind CSS, CSS Modules, or both?"
5. **Constraints**: "Any specific requirements? (TypeScript version, Next.js version, design system)"

---

## Output Specification

### Application Structure

```
project/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css           # Global styles
│   ├── components/          # Shared components
│   │   ├── ui/              # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── List.tsx
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   └── [routes]/            # App Router routes
│       └── page.tsx
├── lib/                     # Utilities
│   └── utils.ts
├── types/                   # TypeScript types
│   └── index.ts
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json           # TypeScript config
└── package.json
```

### Code Standards

- TypeScript throughout with proper type definitions
- Server Components by default, Client Components when needed
- Props interfaces for all components
- Maps for data-driven rendering
- Minimalist techy design aesthetic
- Responsive and accessible components
- Component composition over inheritance

---

## Domain Standards

### Must Follow

- **TypeScript First**: Always use TypeScript with proper interfaces
- **Props Interfaces**: Define explicit prop types for all components
- **Server Components Default**: Use Server Components unless interactivity needed
- **Client Components Marked**: Always add `'use client'` directive when needed
- **Maps for Lists**: Use `.map()` for rendering arrays of data
- **Key Props**: Always provide unique `key` props in maps
- **Component Composition**: Build complex UIs from simple components
- **Minimalist Design**: Clean, techy aesthetic with ample whitespace
- **Accessibility**: Proper semantic HTML and ARIA attributes
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Frontend Validation**: Validate all forms before API calls to reduce costs
- **Input Sanitization**: Sanitize user input to prevent XSS and injection attacks
- **Security Checks**: Validate for dangerous patterns before sending to API
- **RBAC Implementation**: Implement Role-Based Access Control for route and component protection
- **Permission-Based UI**: Show/hide features based on user roles and permissions

### Must Avoid

- **Any Types**: Avoid `any`; use proper TypeScript types
- **Missing Keys**: Never omit `key` prop in `.map()` calls
- **Client Components Unnecessarily**: Don't use `'use client'` unless needed
- **Inline Styles**: Prefer Tailwind classes or CSS Modules
- **Prop Drilling**: Use composition or context for deep prop passing
- **Uncontrolled Components**: Use controlled components with state
- **Missing Error Boundaries**: Handle errors gracefully
- **Accessibility Neglect**: Always consider screen readers and keyboard navigation

---

## Implementation Workflow

1. **Project Setup**
   - Initialize Next.js with TypeScript
   - Configure Tailwind CSS
   - Set up project structure

2. **Type Definitions**
   - Define TypeScript interfaces for data
   - Create prop types for components
   - Set up shared types

3. **Component Architecture**
   - Design component hierarchy
   - Create reusable UI components
   - Implement layout components

4. **Data Handling**
   - Set up data fetching (Server Components)
   - Create data transformation utilities
   - Implement props passing patterns

5. **Styling**
   - Apply minimalist techy design
   - Configure Tailwind theme
   - Create reusable style patterns

6. **Component Implementation**
   - Build components with props
   - Use maps for data rendering
   - Implement composition patterns

7. **Testing & Refinement**
   - Test component rendering
   - Verify responsive behavior
   - Check accessibility

---

## Common Patterns

### Component with Props

```tsx
// types/index.ts
export interface Item {
  id: string
  title: string
  description?: string
}

// components/ui/Card.tsx
interface CardProps {
  item: Item
  onClick?: () => void
}

export default function Card({ item, onClick }: CardProps) {
  return (
    <div 
      className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
      {item.description && (
        <p className="mt-2 text-gray-600">{item.description}</p>
      )}
    </div>
  )
}
```

### Using Maps for Data Rendering

```tsx
// app/page.tsx
import Card from '@/components/ui/Card'
import { Item } from '@/types'

async function getItems(): Promise<Item[]> {
  const res = await fetch('https://api.example.com/items')
  return res.json()
}

export default async function Page() {
  const items = await getItems()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
```

### Server Component with Client Component

```tsx
// app/components/ItemList.tsx (Server Component)
import ItemCard from './ItemCard'
import { Item } from '@/types'

interface ItemListProps {
  items: Item[]
}

export default function ItemList({ items }: ItemListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

// app/components/ItemCard.tsx (Client Component)
'use client'

import { useState } from 'react'
import { Item } from '@/types'

interface ItemCardProps {
  item: Item
}

export default function ItemCard({ item }: ItemCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  
  return (
    <div className="p-4 border rounded-lg">
      <h3>{item.title}</h3>
      <button onClick={() => setIsLiked(!isLiked)}>
        {isLiked ? 'Liked' : 'Like'}
      </button>
    </div>
  )
}
```

See `references/` for detailed patterns and examples.

---

## Output Checklist

Before delivering, verify:

- [ ] Next.js App Router structure follows best practices
- [ ] All components have TypeScript interfaces for props
- [ ] Maps used correctly with unique keys
- [ ] Server/Client Components properly separated
- [ ] Minimalist techy design applied consistently
- [ ] Responsive design implemented
- [ ] Accessibility considerations addressed
- [ ] TypeScript types properly defined
- [ ] Component composition used effectively
- [ ] Code follows project conventions
- [ ] Tailwind CSS configured correctly
- [ ] **Form validation implemented** - All forms validate before API calls
- [ ] **Input sanitization** - User input sanitized to prevent XSS/injection
- [ ] **Security checks** - Dangerous patterns detected before API calls
- [ ] **Cost optimization** - Invalid requests prevented from reaching API

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/component-patterns.md` | Component architecture, props, composition, reusable patterns |
| `references/data-handling.md` | Data fetching, maps, props passing, Server/Client Components |
| `references/app-router.md` | App Router patterns, routing, layouts, Server Components |
| `references/styling.md` | Minimalist techy design, Tailwind CSS, responsive design |
| `references/typescript.md` | TypeScript patterns, interfaces, type safety, prop types |
| `references/form-validation.md` | **Form validation, input sanitization, security checks, cost reduction through frontend validation** |
| `references/rbac.md` | **Role-Based Access Control, route protection, component-level RBAC, permission-based features** |
| `references/best-practices.md` | Production patterns, performance, accessibility, testing |
| `references/anti-patterns.md` | Common mistakes to avoid |

