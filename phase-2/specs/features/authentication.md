# Feature: User Authentication

## User Stories

- As a user, I can sign up for a new account
- As a user, I can sign in to my account
- As a user, I can sign out
- As a user, my session persists across page refreshes
- As a user, I can only access my own tasks

## Acceptance Criteria

### Sign Up
- Email is required and must be valid
- Password is required (min 8 characters)
- Name is optional
- Email must be unique
- User is automatically signed in after signup

### Sign In
- Email and password required
- Invalid credentials show error message
- Successful login creates session and JWT token
- JWT token stored securely

### Sign Out
- Clears session and JWT token
- Redirects to login page

### Session Management
- Session persists across page refreshes
- JWT token included in all API requests
- Expired tokens trigger re-authentication

### Authorization
- All API endpoints require valid JWT token
- Requests without token receive 401 Unauthorized
- Each user only sees/modifies their own tasks
- Task ownership enforced on every operation

## Technology

- **Frontend**: Better Auth
- **Backend**: JWT token verification
- **Shared Secret**: `BETTER_AUTH_SECRET` environment variable

## Security

- Passwords are hashed (Better Auth handles this)
- JWT tokens expire automatically
- Tokens signed with shared secret
- Stateless authentication (no shared DB sessions)

## API Integration

See `@specs/api/rest-endpoints.md` for authentication requirements.

