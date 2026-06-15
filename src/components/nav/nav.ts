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
  { label: 'Panel', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Entrenos', href: '/workouts', icon: Dumbbell },
  { label: 'Nutrición', href: '/nutrition', icon: Apple },
  { label: 'Cuerpo', href: '/body', icon: Activity },
  { label: 'Metas', href: '/goals', icon: ClipboardList },
  { label: 'Ajustes', href: '/settings', icon: Settings }
];
