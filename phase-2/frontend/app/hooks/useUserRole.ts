"use client";

import { useAuth } from "@/lib/auth";
import { UserRole, UserWithRole } from "../types/role";
import { getAllUsers, getUserById } from "../content/mockUsers";
import { useState, useEffect } from "react";

export function useUserRole() {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // Get user role from mock data
      const user = getUserById(session.user.id || "");
      if (user) {
        setUserRole(user.role);
      } else {
        // Default to "user" if user not found
        setUserRole("user");
      }
    } else {
      setUserRole("user");
    }
    setIsLoading(false);
  }, [session]);

  const isAdmin = userRole === "admin";
  const isUser = userRole === "user";

  return {
    userRole,
    isAdmin,
    isUser,
    isLoading,
  };
}

export function useAllUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setIsLoading(false);
  }, []);

  const refreshUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  return {
    users,
    isLoading,
    refreshUsers,
  };
}

