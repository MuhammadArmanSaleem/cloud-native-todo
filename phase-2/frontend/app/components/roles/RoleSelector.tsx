"use client";

import { UserRole } from "../../types/role";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function RoleSelector({
  currentRole,
  onRoleChange,
  disabled = false,
  isLoading = false,
}: RoleSelectorProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];

  return (
    <select
      value={currentRole}
      onChange={(e) => onRoleChange(e.target.value as UserRole)}
      disabled={disabled || isLoading}
      className="px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={t.roles.selectRole}
    >
      <option value="user">{t.roles.user}</option>
      <option value="admin">{t.roles.admin}</option>
    </select>
  );
}

