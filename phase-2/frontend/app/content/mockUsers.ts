import { UserWithRole } from "../types/role";

export const mockUsers: UserWithRole[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
  },
  {
    id: "user-4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "admin",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
];

// Helper function to get user by ID
export function getUserById(userId: string): UserWithRole | undefined {
  return mockUsers.find((user) => user.id === userId);
}

// Helper function to update user role
export function updateUserRole(userId: string, newRole: UserRole): UserWithRole | null {
  const user = getUserById(userId);
  if (!user) return null;
  
  user.role = newRole;
  // In a real app, this would be saved to backend/database
  // For now, we'll use localStorage to persist changes
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mockUsers");
    const users = stored ? JSON.parse(stored) : mockUsers;
    const updatedUsers = users.map((u: UserWithRole) =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
  }
  
  return user;
}

// Helper function to get all users (with localStorage persistence)
export function getAllUsers(): UserWithRole[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mockUsers");
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize localStorage with mock data
    localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
  }
  return mockUsers;
}

