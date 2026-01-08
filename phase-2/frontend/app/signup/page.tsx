"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignupForm from "../components/auth/SignupForm";
import { useAuth } from "@/lib/auth";
import { SignupFormValues } from "../lib/validators/authSchema";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/tasks");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp({
        email: values.email,
        password: values.password,
        name: values.email.split("@")[0], // Use email prefix as name
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
        return;
      }

      // Success - redirect to tasks page
      router.push("/tasks");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Sign Up
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Create an account to start managing your tasks
          </p>

          <SignupForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

