import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:8000',
});

export const { signIn, signOut, useSession } = authClient;

// Create useAuth hook that matches expected interface
export const useAuth = () => {
  const session = useSession();
  return {
    session: session.data ? {
      user: session.data.user,
      token: (session.data.session as any)?.token || ''
    } : null,
    signIn: signIn.email,
    signOut: signOut
  };
};