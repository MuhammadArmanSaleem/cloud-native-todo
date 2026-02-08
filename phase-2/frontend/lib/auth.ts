import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:8000',
});

export const { signIn, signOut, useSession, signUp } = authClient;

// Create useAuth hook that matches expected interface
export const useAuth = () => {
  const { data: session, isPending, error } = useSession();

  // If get-session fails (e.g. 404 when backend not updated), treat as not authenticated so app shows login instead of blank/loading forever
  const hasSession = !error && session;
  const isLoading = isPending && !error;

  return {
    session: hasSession ? {
      user: session.user,
      token: (session.session as any)?.token || ''
    } : null,
    isAuthenticated: !!hasSession,
    isLoading,
    signIn: signIn.email,
    signUp: signUp.email,
    signOut: signOut
  };
};