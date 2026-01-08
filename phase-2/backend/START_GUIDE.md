# Backend Start Guide

Complete step-by-step guide to start the Phase 2 FastAPI backend.

## Prerequisites

Before starting, ensure you have:

- **Python 3.13+** installed
- **uv** package manager (recommended) or **pip**
- **Neon PostgreSQL database** connection string
- **Terminal/Command Prompt** access

### Check Python Version

```bash
python --version
# Should show Python 3.13 or higher
```

### Check if uv is installed

```bash
uv --version
# If not installed, install from: https://github.com/astral-sh/uv
```

## Step 1: Navigate to Backend Directory

```bash
cd phase-2/backend
```

## Step 2: Set Up Environment Variables

### Create `.env.local` file

Create a file named `.env.local` in the `backend/` directory:

```bash
# On Windows (PowerShell)
New-Item -ItemType File -Path ".env.local"

# On Mac/Linux
touch .env.local
```

### Add Environment Variables

Open `.env.local` and add:

```bash
# Neon PostgreSQL Database Connection
DATABASE_URL=bhag

# Better Auth Secret (for JWT token signing/verification)
BETTER_AUTH_SECRET=bhag

# API Configuration
API_URL=http://localhost:8000
```

**Important**: Replace `bhag` with a secure random string.

## Step 3: Install Dependencies

### Option A: Using uv (Recommended)

```bash
uv sync
```

This will:
- Create a virtual environment automatically
- Install all dependencies from `pyproject.toml`
- Set up the project

### Option B: Using pip

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# On Windows (CMD)
venv\Scripts\activate.bat

# On Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -e .
```

## Step 4: Verify Database Connection

Before starting the server, verify your database connection:

```bash
# Using uv
uv run python -c "from database import async_engine; import asyncio; asyncio.run(async_engine.connect()); print('✅ Database connection successful!')"

# Using pip (with venv activated)
python -c "from database import async_engine; import asyncio; asyncio.run(async_engine.connect()); print('✅ Database connection successful!')"
```

If successful, you'll see: `✅ Database connection successful!`

If you get an error, check:
- `.env.local` file exists and has `DATABASE_URL`
- Connection string is correct
- Neon database is active

## Step 5: Start the Server

### Using uv (Recommended)

```bash
uv run uvicorn main:app --reload --port 8000
```

### Using pip (with venv activated)

```bash
uvicorn main:app --reload --port 8000
```

### What to Expect

You should see output like:

```
INFO:     Will watch for changes in these directories: ['C:\\Users\\...\\phase-2\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Step 6: Test the Server

### Health Check

Open your browser or use curl:

```bash
# Browser
http://localhost:8000/health

# curl
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

### API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Root Endpoint

```bash
curl http://localhost:8000/
```

Expected response:
```json
{"message": "Todo API - Phase 2 Backend"}
```

## Step 7: Test Database Connection

The server will automatically create database tables on startup. Check the console for:

```
INFO:     Application startup complete.
```

If you see database errors, check:
- Database connection string in `.env.local`
- Neon database is accessible
- Network/firewall settings

## Troubleshooting

### Error: `DATABASE_URL environment variable is required`

**Solution**: 
- Ensure `.env.local` exists in `backend/` directory
- Check that `DATABASE_URL` is set in `.env.local`
- Verify `python-dotenv` is installed (it's in dependencies)

### Error: `ModuleNotFoundError: No module named 'sqlmodel'`

**Solution**:
- Install dependencies: `uv sync` or `pip install -e .`
- Activate virtual environment if using pip

### Error: `Multiple top-level modules discovered in a flat-layout`

**Error Message**:
```
error: Multiple top-level modules discovered in a flat-layout: ['auth', 'database', 'main', 'models'].
```

**Solution**:
- This error has been fixed in `pyproject.toml` by explicitly listing modules
- If you see this error, ensure your `pyproject.toml` includes:
  ```toml
  [tool.setuptools]
  py-modules = ["auth", "database", "main", "models"]
  ```
- Then run `uv sync` again

### Error: `Connection refused` or `Could not connect to database`

**Solution**:
- Verify Neon database is active in Neon dashboard
- Check connection string format (should start with `postgresql+asyncpg://`)
- SSL is automatically configured - you don't need `?sslmode=require` in the connection string
- Test connection string separately

### Error: `TypeError: connect() got an unexpected keyword argument 'sslmode'`

**Error Message**:
```
TypeError: connect() got an unexpected keyword argument 'sslmode'
```

**Solution**:
- This error occurs because asyncpg doesn't accept `sslmode` in the connection string
- The code automatically removes `sslmode` from the URL and configures SSL via `connect_args`
- Your connection string can include `?sslmode=require` - it will be automatically handled
- Or use a clean connection string without SSL parameters: `postgresql+asyncpg://user:password@host/database`

### Error: `Port 8000 already in use`

**Solution**:
- Use a different port: `uvicorn main:app --reload --port 8001`
- Or stop the process using port 8000

### Server not reloading on file changes

**Solution**:
- Ensure `--reload` flag is included
- Check file permissions
- Restart the server manually

## Quick Start Commands Summary

```bash
# 1. Navigate to backend
cd phase-2/backend

# 2. Create .env.local (if not exists)
# Add DATABASE_URL and BETTER_AUTH_SECRET

# 3. Install dependencies
uv sync

# 4. Start server
uv run uvicorn main:app --reload --port 8000
```

## Next Steps

Once the backend is running:

1. **Test API endpoints** using the Swagger UI at http://localhost:8000/docs
2. **Start the frontend** (see `phase-2/frontend/README.md`)
3. **Verify authentication** works with Better Auth
4. **Test CRUD operations** for tasks

## Development Tips

- **Auto-reload**: The `--reload` flag automatically restarts the server when you change code
- **Debug mode**: Set `echo=True` in `database.py` to see SQL queries
- **API testing**: Use the interactive docs at `/docs` to test endpoints
- **Logs**: Check console output for errors and request logs

## Production Deployment

For production:
- Remove `--reload` flag
- Set proper `BETTER_AUTH_SECRET` (use secure random string)
- Use environment variables (not `.env.local`)
- Configure proper CORS origins
- Set up proper logging
- Use production-grade ASGI server (Gunicorn + Uvicorn workers)

## Need Help?

- Check `README.md` for project overview
- Check `DATABASE_SETUP.md` for database configuration
- Check `ENV_SETUP.md` for environment variables
- Review FastAPI docs: https://fastapi.tiangolo.com

