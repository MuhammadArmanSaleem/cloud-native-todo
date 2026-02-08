# Backend Database Connection Fix

## Issues Found

### 1. Database Connection Error
**Error**: `socket.gaierror: [Errno 11001] getaddrinfo failed`

**Root Cause**: 
- Missing `.env.local` file in `backend/` directory
- `DATABASE_URL` environment variable is not set or has invalid hostname

**Fix Applied**:
- ✅ Updated `main.py` lifespan to handle database connection errors gracefully
- ✅ Created `env.local.example` template file
- ✅ Server will now start even if database connection fails (with warning)

### 2. Frontend-Backend Connection Status

**Status**: ⚠️ **DISCONNECTED**

**Evidence**:
- Frontend `app/tasks/page.tsx` is using `mockTasks` instead of real API calls
- Frontend has `lib/api.ts` with `todoApi` service configured for `http://localhost:8000`
- Backend is not running (fails to start due to database connection)
- Frontend API service exists but is not being used in the tasks page

**Frontend Configuration**:
- API Base URL: `http://localhost:8000` (default)
- API Service: `lib/api.ts` - `TodoApiService` class
- Current Usage: Frontend uses mock data (`mockTasks`) instead of API

**Backend Status**:
- Backend fails to start due to database connection error
- Once database is configured, backend will run on `http://localhost:8000`

## How to Fix Database Connection

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the `backend/` directory:

```bash
cd phase-2/backend
# On Windows PowerShell
New-Item -ItemType File -Path ".env.local"
```

### Step 2: Add Database Connection String

Open `.env.local` and add your Neon PostgreSQL connection string:

```bash
# Neon PostgreSQL Database Connection
# Format: postgresql+asyncpg://user:password@host/database
DATABASE_URL=postgresql+asyncpg://your-user:your-password@your-host.neon.tech/your-database

# Better Auth Secret (for JWT token signing/verification)
# Generate a secure random string: openssl rand -hex 32
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production

# API Configuration
API_URL=http://localhost:8000
```

**Important**: 
- Replace `your-user`, `your-password`, `your-host`, and `your-database` with your actual Neon database credentials
- Get your connection string from the Neon dashboard
- The connection string should NOT include `?sslmode=require` (SSL is configured automatically)

### Step 3: Restart Backend Server

```bash
cd phase-2/backend
uvicorn main:app --reload --port 8000
```

You should see:
```
✅ Database connection successful and tables created/verified
INFO:     Application startup complete.
```

## Frontend-Backend Reconnection

Once the backend is running:

1. **Backend must be running** on `http://localhost:8000`
2. **Frontend needs to switch from mock data to real API**:
   - Update `app/tasks/page.tsx` to use `todoApi` instead of `mockTasks`
   - Import and use the API service from `lib/api.ts`
   - Handle authentication tokens properly

**Current State**:
- ✅ Frontend API service is configured correctly
- ✅ Backend API endpoints are ready
- ❌ Frontend is using mock data instead of API
- ❌ Backend is not running (database connection issue)

## Next Steps

1. **Fix database connection** (create `.env.local` with valid `DATABASE_URL`)
2. **Start backend server** (should start successfully after database fix)
3. **Update frontend** to use real API instead of mock data
4. **Test connection** between frontend and backend
