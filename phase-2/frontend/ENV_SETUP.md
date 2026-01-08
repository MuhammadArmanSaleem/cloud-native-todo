# Frontend Environment Variables Setup

## Required Environment Variables

The frontend requires environment variables to be set in a `.env.local` file.

### Creating .env.local

1. **Create the file** in the `frontend/` directory:
   ```bash
   # On Windows (PowerShell)
   New-Item -ItemType File -Path ".env.local"
   
   # On Mac/Linux
   touch .env.local
   ```

2. **Add the following variables**:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth URL
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

### Important Notes

- **NEXT_PUBLIC_ prefix**: Next.js only exposes environment variables to the browser if they start with `NEXT_PUBLIC_`
- **No quotes needed**: Don't wrap values in quotes
- **Restart required**: After creating/updating `.env.local`, restart the Next.js dev server

### Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth server URL | `http://localhost:8000` |

### Testing

To verify environment variables are loaded:

1. **Check in browser console** (after starting dev server):
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```

2. **Or check the API service**:
   The `lib/api.ts` file uses `process.env.NEXT_PUBLIC_API_URL` and will log the base URL

### Troubleshooting

**Environment variables not loading?**
- Ensure file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
- Restart the Next.js dev server after creating/updating the file
- Check that variables start with `NEXT_PUBLIC_` prefix
- Verify file is in the `frontend/` directory (same level as `package.json`)

**API connection errors?**
- Verify backend is running on `http://localhost:8000`
- Check CORS settings in backend (should allow `http://localhost:3000`)
- Verify `NEXT_PUBLIC_API_URL` matches your backend URL

### Production

For production, set these as environment variables in your hosting platform:
- Vercel: Add in Project Settings → Environment Variables
- Netlify: Add in Site Settings → Environment Variables
- Other platforms: Follow their documentation for environment variables

