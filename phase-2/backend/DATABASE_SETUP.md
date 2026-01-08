# Database Setup Guide

## Neon PostgreSQL Connection

The backend is configured to use Neon PostgreSQL database. The connection string has been set up in the code.

### Connection String Format

For Neon PostgreSQL with asyncpg, use this format:
```
postgresql+asyncpg://user:password@host/database?sslmode=require
```

### Current Configuration

The connection string is configured in:
- `database.py` - Default connection string
- `main.py` - Fallback connection string

**Current Neon Connection:**
```
bhag
```

### Environment Variable Setup

For production, create a `.env` file in the `backend/` directory:

```bash
# .env file (create this file, it's in .gitignore)
DATABASE_URL=bhag sslmode=require
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production
```

### Connection Pool Settings

The engine is configured with:
- `pool_pre_ping=True` - Verifies connections before use (important for serverless)
- `pool_size=5` - Base connection pool size
- `max_overflow=10` - Maximum overflow connections
- `sslmode=require` - SSL required for Neon

### Testing the Connection

To test if the connection works:

```bash
cd backend
python -c "from database import async_engine; import asyncio; asyncio.run(async_engine.connect())"
```

Or run the FastAPI server:
```bash
cd backend
uvicorn main:app --reload
```

The server will attempt to connect to the database on startup.

### Troubleshooting

1. **Connection Refused**: Check if the Neon database is active in the Neon dashboard
2. **SSL Error**: Ensure `sslmode=require` is in the connection string
3. **Authentication Failed**: Verify username and password in the connection string
4. **Pool Exhausted**: Increase `pool_size` or `max_overflow` if needed

### Security Notes

- Never commit `.env` files to git (already in .gitignore)
- Rotate database passwords regularly
- Use environment variables in production
- Consider using Neon's connection pooling for better performance


