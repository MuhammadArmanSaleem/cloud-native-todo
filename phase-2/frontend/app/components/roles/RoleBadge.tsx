"use client";

import { UserRole } from "../../types/role";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface RoleBadgeProps {
  role?: UserRole | null;
  size?: "sm" | "md" | "lg";
}

export default function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];
  const safeRole = role ?? "user";
  const rolesCopy = t.roles;

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const roleStyles: Record<string, string> = {
    admin: "bg-primary text-primary-foreground",
    user: "bg-muted text-muted-foreground",
  };

  const style = roleStyles[safeRole] ?? roleStyles.user;
  const label = rolesCopy?.roleLabel?.(safeRole) ?? safeRole;
  const text = safeRole === "admin" ? rolesCopy?.admin : rolesCopy?.user;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md ${sizeClasses[size]} ${style}`}
      aria-label={label}
    >
      {text ?? safeRole}
    </span>
  );
}


