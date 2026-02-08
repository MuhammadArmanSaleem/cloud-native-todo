"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, sessionError } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/tasks");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center text-foreground">
        <div className="mb-2">Loading...</div>
        {sessionError && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 max-w-xs">
            {sessionError}
          </p>
        )}
      </div>
    </div>
  );
}
