"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserWithRole, UserRole } from "../../types/role";
import { useAllUsers } from "../../hooks/useUserRole";
import { updateUserRole } from "../../content/mockUsers";
import RoleBadge from "./RoleBadge";
import RoleSelector from "./RoleSelector";
import Toast from "../ui/Toast";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";
import { useUserRole } from "../../hooks/useUserRole";

export default function UserRolesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = uiCopy[language];
  const { userRole, isAdmin, isLoading: roleLoading } = useUserRole();
  const { users, isLoading: usersLoading, refreshUsers } = useAllUsers();
  const [changingRoles, setChangingRoles] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Redirect if not admin
  if (!roleLoading && !isAdmin) {
    router.push("/tasks");
    return (
      <div className="p-6">
        <p className="text-destructive">{t.roles.accessDenied}</p>
      </div>
    );
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setChangingRoles((prev) => new Set(prev).add(userId));
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const updated = updateUserRole(userId, newRole);
      if (updated) {
        refreshUsers();
        setToast({
          message: t.roles.roleUpdated(updated.name, newRole),
          type: "success",
          isVisible: true,
        });
      } else {
        setToast({
          message: t.roles.updateError,
          type: "error",
          isVisible: true,
        });
      }
    } catch (error) {
      setToast({
        message: t.roles.updateError,
        type: "error",
        isVisible: true,
      });
    } finally {
      setChangingRoles((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  if (roleLoading || usersLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">{t.roles.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
          {t.roles.title}
        </h1>
        <p className="text-muted-foreground">{t.roles.description}</p>
      </div>

      {users.length === 0 ? (
        <div className="p-6 bg-card border border-border rounded-lg text-center">
          <p className="text-muted-foreground">{t.roles.emptyState}</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    {t.roles.userName}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    {t.roles.email}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    {t.roles.currentRole}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    {t.roles.changeRole}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleSelector
                        currentRole={user.role}
                        onRoleChange={(newRole) => handleRoleChange(user.id, newRole)}
                        isLoading={changingRoles.has(user.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}

