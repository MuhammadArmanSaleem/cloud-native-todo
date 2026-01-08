export type UserRole = 'admin' | 'user';

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface RoleChange {
  userId: string;
  newRole: UserRole;
  changedAt: string;
}

