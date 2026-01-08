"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems, adminNavigationItems } from "../../content/navigation";
import { useUserRole } from "../../hooks/useUserRole";

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useUserRole();

  const allNavItems = isAdmin 
    ? [...navigationItems, ...adminNavigationItems]
    : navigationItems;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      <nav className="flex flex-col gap-2 p-4">
        {allNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


