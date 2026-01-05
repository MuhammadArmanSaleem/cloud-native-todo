# Next.js Styling - Minimalist Techy Design

Styling patterns for creating minimalist, techy aesthetic interfaces in Next.js.

## Minimalist Techy Design Principles

### Design Philosophy

- **Clean and Simple**: Minimal visual clutter, focus on content
- **Techy Aesthetic**: Modern, professional, developer-friendly
- **Ample Whitespace**: Generous spacing for readability
- **Subtle Borders**: Thin, light borders for structure
- **Monochrome Base**: Grays, blacks, whites as foundation
- **Accent Colors**: Strategic use of blue/green for highlights
- **Typography**: Clean, readable fonts with clear hierarchy
- **Subtle Shadows**: Minimal elevation for depth

## Tailwind CSS Configuration

### Minimalist Techy Theme

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist techy palette
        tech: {
          dark: '#0a0a0a',
          gray: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
export default config
```

## Component Styling Patterns

### Card Component (Minimalist)

```tsx
// components/ui/Card.tsx
interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`
      p-6 
      bg-white 
      border border-gray-200 
      rounded-lg 
      hover:border-gray-300 
      transition-colors
      ${className}
    `}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="text-gray-600">{children}</div>
    </div>
  )
}
```

### Button Component (Techy Style)

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false
}: ButtonProps) {
  const baseStyles = "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantStyles = {
    primary: "bg-tech-blue-600 text-white hover:bg-tech-blue-700 focus:ring-tech-blue-500",
    secondary: "bg-tech-gray-100 text-tech-gray-900 hover:bg-tech-gray-200 focus:ring-tech-gray-500",
    ghost: "bg-transparent text-tech-gray-700 hover:bg-tech-gray-100 focus:ring-tech-gray-500"
  }
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### Input Component (Clean Design)

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
        <label className="block text-sm font-medium text-tech-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full 
          px-3 py-2 
          border rounded-md 
          text-tech-gray-900 
          placeholder-tech-gray-400
          focus:outline-none 
          focus:ring-2 
          focus:ring-tech-blue-500 
          focus:border-transparent
          ${error ? 'border-red-300' : 'border-tech-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

## Layout Patterns

### Container with Max Width

```tsx
// components/layout/Container.tsx
interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
```

### Section Spacing

```tsx
// components/layout/Section.tsx
interface SectionProps {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`py-12 md:py-16 lg:py-20 ${className}`}>
      {children}
    </section>
  )
}
```

## Typography Patterns

### Heading Styles

```tsx
// Typography components
export function H1({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h1 className={`text-4xl md:text-5xl font-bold text-tech-gray-900 mb-6 ${className}`}>
      {children}
    </h1>
  )
}

export function H2({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={`text-3xl md:text-4xl font-semibold text-tech-gray-900 mb-4 ${className}`}>
      {children}
    </h2>
  )
}

export function H3({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`text-2xl font-semibold text-tech-gray-900 mb-3 ${className}`}>
      {children}
    </h3>
  )
}

export function P({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={`text-base text-tech-gray-600 leading-relaxed ${className}`}>
      {children}
    </p>
  )
}
```

## Grid and List Patterns

### Minimalist Grid

```tsx
// components/ui/Grid.tsx
interface GridProps {
  items: Array<{ id: string; [key: string]: any }>
  renderItem: (item: any) => React.ReactNode
  columns?: 1 | 2 | 3 | 4
}

export default function Grid({ items, renderItem, columns = 3 }: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  
  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {items.map((item) => (
        <div key={item.id}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
```

### Clean List

```tsx
// components/ui/List.tsx
interface ListItem {
  id: string
  title: string
  description?: string
  action?: React.ReactNode
}

interface ListProps {
  items: ListItem[]
}

export default function List({ items }: ListProps) {
  return (
    <ul className="divide-y divide-tech-gray-200">
      {items.map((item) => (
        <li key={item.id} className="py-4 px-2 hover:bg-tech-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-tech-gray-900">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-tech-gray-500 mt-1">{item.description}</p>
              )}
            </div>
            {item.action && <div>{item.action}</div>}
          </div>
        </li>
      ))}
    </ul>
  )
}
```

## Responsive Design

### Mobile-First Breakpoints

```tsx
// Responsive patterns
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  {/* Content */}
</div>
```

## Color Usage Guidelines

### Primary Colors
- **Background**: `bg-white` or `bg-tech-gray-50`
- **Text Primary**: `text-tech-gray-900`
- **Text Secondary**: `text-tech-gray-600`
- **Borders**: `border-tech-gray-200`
- **Accents**: `text-tech-blue-600` or `bg-tech-blue-600`

### Hover States
- **Subtle**: `hover:bg-tech-gray-50`
- **Medium**: `hover:bg-tech-gray-100`
- **Strong**: `hover:bg-tech-blue-700`

## Best Practices

1. **Consistent Spacing**: Use Tailwind's spacing scale (4, 6, 8, 12, 16, 24)
2. **Subtle Interactions**: Gentle hover effects and transitions
3. **Readable Typography**: Minimum 16px base font size
4. **High Contrast**: Ensure WCAG AA contrast ratios
5. **Consistent Borders**: Use same border width (1px) throughout
6. **Minimal Shadows**: Use sparingly, subtle elevation
7. **Responsive First**: Mobile-first approach with breakpoints
8. **Semantic HTML**: Use proper HTML elements for accessibility

