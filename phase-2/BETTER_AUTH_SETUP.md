# Better Auth Setup Guide

## Current Status

The frontend is configured to use Better Auth, but the backend doesn't have Better Auth endpoints set up yet. You're seeing 404 errors for `/api/auth/sign-in/email`.

## Options

### Option 1: Set Up Better Auth Server (Recommended)

Better Auth can run as a separate service or be integrated into your FastAPI backend. You'll need to:

1. **Install Better Auth server package** (if using Node.js/TypeScript server)
2. **Or integrate Better Auth into FastAPI** (requires Python Better Auth implementation)

### Option 2: Use Simple JWT Authentication (Current Setup)

The backend currently uses JWT tokens. You can:

1. **Create a simple auth endpoint** in FastAPI for sign-in/sign-up
2. **Return JWT tokens** that match what Better Auth expects
3. **Update frontend** to use the custom auth endpoints

### Option 3: Mock Better Auth for Development

For development, you can create mock endpoints in FastAPI that return the expected Better Auth format.

## Quick Fix: Add Basic Auth Endpoints

Add these endpoints to `backend/main.py`:

```python
@app.post("/api/auth/sign-in/email")
async def sign_in_email(email: str, password: str):
    # TODO: Implement actual authentication
    # For now, return a mock response
    return {
        "user": {"id": "1", "email": email},
        "session": {"token": "mock_token"}
    }
```

## Next Steps

1. **Decide on authentication approach**:
   - Full Better Auth server setup
   - Simple JWT with custom endpoints
   - Mock endpoints for development

2. **Update backend** with chosen approach

3. **Test authentication flow**

## Resources

- Better Auth Docs: https://www.better-auth.com/docs
- FastAPI Authentication: https://fastapi.tiangolo.com/tutorial/security/

