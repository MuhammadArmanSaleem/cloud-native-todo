"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/tasks");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground">Loading...</div>
    </div>
  );
}
