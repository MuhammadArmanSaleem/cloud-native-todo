# Phase 2 Frontend - Next.js Todo App

## Quick Start

**📖 For detailed setup instructions, see [ENV_SETUP.md](./ENV_SETUP.md)**

### Prerequisites

- Node.js 18+ installed
- Backend server running on `http://localhost:8000`

### Quick Commands

1. **Navigate to frontend directory**
   ```bash
   cd phase-2/frontend
   ```

2. **Create `.env.local` file** (if not exists):
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Environment Variables

The frontend requires environment variables in `.env.local`:

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:8000`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Better Auth server URL (default: `http://localhost:8000`)

**Important**: 
- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart the dev server after creating/updating `.env.local`

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup instructions.

## Project Structure

```
frontend/
├── app/
│   ├── components/     # React components
│   │   ├── tasks/      # Task-related components
│   │   └── ui/         # Reusable UI components
│   ├── lib/            # Validation schemas
│   ├── types/          # TypeScript types
│   ├── page.tsx        # Main page
│   └── layout.tsx      # Root layout
├── lib/
│   ├── api.ts          # API client service
│   └── auth.ts         # Better Auth client
└── .env.local          # Environment variables (create this)
```

## API Integration

The frontend connects to the backend via the API client in `lib/api.ts`:

- **Base URL**: Configured via `NEXT_PUBLIC_API_URL`
- **Authentication**: JWT tokens from Better Auth
- **Error Handling**: Automatic error parsing and user-friendly messages

## Development

- **Hot Reload**: Changes automatically refresh in the browser
- **TypeScript**: Full type safety with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **Component Patterns**: Following Next.js App Router best practices

## Troubleshooting

### Environment Variables Not Loading

- Ensure file is named `.env.local` (not `.env` or `.env.local.txt`)
- Restart the Next.js dev server after creating/updating the file
- Check that variables start with `NEXT_PUBLIC_` prefix
- Verify file is in the `frontend/` directory

### API Connection Errors

- Verify backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` matches your backend URL
- Check browser console for CORS errors
- Verify backend CORS allows `http://localhost:3000`

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors: `npm run build`
- Clear `.next` folder and rebuild if needed

## Next Steps

1. **Start Backend**: See `../backend/START_GUIDE.md`
2. **Start Frontend**: `npm run dev`
3. **Test Connection**: Open http://localhost:3000
4. **Check API**: Verify tasks load from backend

