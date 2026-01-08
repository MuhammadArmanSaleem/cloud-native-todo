"use client";

import { UserRole } from "../../types/role";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface RoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md" | "lg";
}

export default function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const roleStyles = {
    admin: "bg-primary text-primary-foreground",
    user: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md ${sizeClasses[size]} ${roleStyles[role]}`}
      aria-label={t.roles.roleLabel(role)}
    >
      {role === "admin" ? t.roles.admin : t.roles.user}
    </span>
  );
}

