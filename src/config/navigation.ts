import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export const APP_ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ANALYTICS: "/dashboard?tab=analytics",
  CUSTOMERS: "/dashboard?tab=customers",
  ORDERS: "/dashboard?tab=orders",
  SETTINGS: "/dashboard?tab=settings",
  HELP: "/dashboard?tab=help",
} as const;

export interface NavItemConfig {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  { id: "dashboard", href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard, label: "Dashboard" },
  { id: "analytics", href: APP_ROUTES.ANALYTICS, icon: BarChart3, label: "Analytics" },
  { id: "customers", href: APP_ROUTES.CUSTOMERS, icon: Users, label: "Customers" },
  { id: "orders", href: APP_ROUTES.ORDERS, icon: ShoppingCart, label: "Orders" },
];

export const SYSTEM_NAV_ITEMS: NavItemConfig[] = [
  { id: "settings", href: APP_ROUTES.SETTINGS, icon: Settings, label: "Settings" },
  { id: "help", href: APP_ROUTES.HELP, icon: HelpCircle, label: "Help & Support" },
];

export const NAVIGATION_SECTIONS = {
  MAIN_MENU: "Main Menu",
  SYSTEM: "System",
} as const;
