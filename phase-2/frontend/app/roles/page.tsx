"use client";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import UserRolesPage from "../components/roles/UserRolesPage";

export default function RolesPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <UserRolesPage />
      </div>
    </ProtectedRoute>
  );
}

