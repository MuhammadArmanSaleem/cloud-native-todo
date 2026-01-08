"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import EmailNotificationSettings from "../notifications/EmailNotificationSettings";
import { useAuth } from "@/lib/auth";
import { ProfileFormValues } from "../../lib/validators/profileSchema";
import Toast from "../ui/Toast";

export default function ProfilePage() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading profile...</div>
      </div>
    );
  }

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - in real app, this would call Better Auth updateUser
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate profile update
      console.log("Profile update:", {
        name: values.name,
        email: values.email,
        passwordChanged: !!values.password,
      });

      // Show success toast
      setToast({
        message: "Profile updated successfully",
        type: "success",
        isVisible: true,
      });
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please try again.");
      setToast({
        message: "Failed to update profile",
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    name: session.user.name || session.user.email?.split("@")[0] || "",
    email: session.user.email || "",
    password: undefined,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
          Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
          Edit Profile
        </h2>
        <ProfileForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Email Notification Settings */}
      <EmailNotificationSettings />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}

