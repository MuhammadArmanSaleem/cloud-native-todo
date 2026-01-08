# Environment Variables Setup

## Required Environment Variables

The backend requires environment variables to be set in a `.env.local` file.

### Creating .env.local

1. **Create the file** in the `backend/` directory:
   ```bash
   cd backend
   touch .env.local  # or create manually
   ```

2. **Add the following variables**:

```bash
# Neon PostgreSQL Database Connection
DATABASE_URL=bhag
# Better Auth Secret (for JWT token signing/verification)
# Generate a secure random string for production
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production

# API Configuration
API_URL=http://localhost:8000
```

### Security Notes

- `.env.local` is in `.gitignore` and will NOT be committed to git
- Never commit actual credentials to version control
- Use different secrets for development and production
- Rotate database passwords regularly

### Loading Environment Variables

The backend uses `python-dotenv` to load variables from `.env.local`:

```python
from dotenv import load_dotenv
load_dotenv()  # Loads .env.local automatically
```

### Error Handling

If `DATABASE_URL` is not set, the application will raise a clear error message:
```
ValueError: DATABASE_URL environment variable is required. 
Please create a .env.local file in the backend directory with your Neon database connection string.
```

### Testing

To verify your environment variables are loaded:

```bash
cd backend
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('DATABASE_URL:', 'SET' if os.getenv('DATABASE_URL') else 'NOT SET')"
```


