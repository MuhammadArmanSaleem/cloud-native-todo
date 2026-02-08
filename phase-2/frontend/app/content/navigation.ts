export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Tasks",
    href: "/tasks",
  },
  {
    label: "Chat",
    href: "/chat",
  },
  {
    label: "Profile",
    href: "/profile",
  },
  {
    label: "Settings",
    href: "/profile",
  },
];

// Admin-only navigation items
export const adminNavigationItems: NavigationItem[] = [
  {
    label: "User Roles",
    href: "/roles",
  },
];

