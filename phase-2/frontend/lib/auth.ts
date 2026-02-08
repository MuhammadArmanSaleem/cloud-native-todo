"use client";

import { createAuthClient } from 'better-auth/react';
import { useState, useEffect } from 'react';

// Absolute origin required (no relative URL) – avoids "Invalid URL /get-session"
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      "http://localhost:3000";

const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signOut, useSession, signUp } = authClient;

const SESSION_LOAD_TIMEOUT_MS = 6000;

// Create useAuth hook that matches expected interface; stops loading after timeout if backend unreachable
export const useAuth = () => {
  const { data: session, isPending, error } = useSession();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isPending || error) return;
    const t = setTimeout(() => setTimedOut(true), SESSION_LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isPending, error]);

  // If get-session fails or times out (e.g. backend not running), treat as not authenticated
  const hasSession = !error && !timedOut && session;
  const isLoading = isPending && !error && !timedOut;

  return {
    session: hasSession ? {
      user: session.user,
      token: (session.session as any)?.token || ''
    } : null,
    isAuthenticated: !!hasSession,
    isLoading,
    sessionError: timedOut ? 'Backend unreachable. Is the backend running on port 8001?' : null,
    signIn: signIn.email,
    signUp: signUp.email,
    signOut: signOut
  };
};