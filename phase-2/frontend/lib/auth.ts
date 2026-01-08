import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:8000',
});

export const { signIn, signOut, useSession, signUp } = authClient;

// Create useAuth hook that matches expected interface
export const useAuth = () => {
  const { data: session, isPending } = useSession();
  
  return {
    session: session ? {
      user: session.user,
      token: (session.session as any)?.token || ''
    } : null,
    isAuthenticated: !!session,
    isLoading: isPending,
    signIn: signIn.email,
    signUp: signUp.email,
    signOut: signOut
  };
};