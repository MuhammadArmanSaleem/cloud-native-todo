# Frontend Guidelines - Phase II

## Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **API Client**: Custom client with JWT handling

## Project Structure

```
frontend/
├── app/                # Next.js App Router pages
│   ├── (auth)/        # Authentication pages
│   ├── (dashboard)/   # Main app pages
│   └── layout.tsx     # Root layout
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components
│   └── features/     # Feature-specific components
├── lib/              # Utilities and helpers
│   ├── api.ts        # API client
│   └── auth.ts       # Better Auth configuration
├── types/            # TypeScript types
└── public/           # Static assets
```

## Patterns

### Server vs Client Components

- **Use Server Components by default** (better performance)
- **Client Components only when needed**:
  - User interactions (onClick, onChange)
  - Browser APIs (localStorage, window)
  - State management (useState, useEffect)
  - Event listeners

### API Client

All backend calls should use the API client:

```typescript
import { api } from '@/lib/api'

// Get tasks
const tasks = await api.getTasks()

// Create task
const newTask = await api.createTask({ title: "New task" })

// Update task
await api.updateTask(taskId, { completed: true })
```

The API client automatically:
- Includes JWT token in headers
- Handles authentication errors
- Provides type-safe methods

### Component Structure

- `/components/ui` - Base UI components (buttons, inputs, cards)
- `/components/features` - Feature-specific components (TaskList, TaskForm)
- Follow existing component patterns
- Use props and maps for data rendering

## Styling

- Use Tailwind CSS classes
- No inline styles
- Follow existing component patterns
- Responsive design (mobile-first)
- Minimalist techy design aesthetic

## Authentication

Better Auth handles:
- User signup/signin
- Session management
- JWT token generation
- Token storage

Access user in components:
```typescript
import { auth } from '@/lib/auth'

const session = await auth.getSession()
const user = session?.user
```

## Forms

- Use client-side validation
- Show validation errors immediately
- Reduce API calls with frontend validation
- Follow form validation patterns from `nextjs-frontend` skill

## State Management

- Server Components for data fetching
- Client Components for interactivity
- React hooks (useState, useEffect) when needed
- Consider React Query for complex state

## Best Practices

1. **Type Safety**: Use TypeScript for all components
2. **Error Handling**: Handle API errors gracefully
3. **Loading States**: Show loading indicators
4. **Empty States**: Handle empty data gracefully
5. **Accessibility**: Use semantic HTML and ARIA attributes
6. **Performance**: Optimize images, use Next.js Image component

## Available Skills

When building frontend features:
- Use `frontend-sdd-orchestrator` for complete features
- Follow SpecKit Plus workflow
- Use Context7 for latest Next.js patterns
- Reference `nextjs-frontend` skill patterns

