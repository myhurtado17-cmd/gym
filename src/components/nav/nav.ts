import {
  Activity,
  Apple,
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  Settings
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts', href: '/workouts', icon: Dumbbell },
  { label: 'Nutrition', href: '/nutrition', icon: Apple },
  { label: 'Body', href: '/body', icon: Activity },
  { label: 'Goals', href: '/goals', icon: ClipboardList },
  { label: 'Settings', href: '/settings', icon: Settings }
];
