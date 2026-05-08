import type { SidebarNavItem } from '@okil-chai/ui';
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from 'lucide-react';

export const CLIENT_PORTAL_NAV_ITEMS: readonly SidebarNavItem[] = [
  { key: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { key: '/appointments', label: 'My Appointments', icon: <Calendar size={18} />, count: 3 },
  { key: '/saved', label: 'Saved Lawyers', icon: <Heart size={18} />, count: 7 },
  { key: '/messages', label: 'Messages', icon: <MessageSquare size={18} />, count: 2 },
  { key: '/documents', label: 'Documents', icon: <FileText size={18} /> },
  { key: '/payments', label: 'Payments', icon: <CreditCard size={18} /> },
  { key: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { key: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export const CLIENT_PORTAL_QUICK_LINKS = [
  { label: 'Help Center', href: '/help' },
  { label: 'Contact Support', href: '/contact' },
  { label: 'Safety & Privacy', href: '/privacy' },
] as const;

export const CLIENT_PORTAL_LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Settings', href: '/cookies' },
] as const;
