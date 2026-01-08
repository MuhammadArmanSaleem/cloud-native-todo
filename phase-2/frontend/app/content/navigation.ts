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
    label: "Profile",
    href: "/profile",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

