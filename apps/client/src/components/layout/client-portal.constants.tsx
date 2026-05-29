import type { DarkNavSection } from '@repo/ui';
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Gavel,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Scale,
  Settings,
} from 'lucide-react';
import { brand } from '../../lib/brand';

export const CLIENT_PORTAL_NAV_SECTIONS: readonly DarkNavSection[] = [
  {
    label: 'My Portal',
    items: [
      { key: '/dashboard',     label: 'Dashboard',       icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
      { key: '/appointments',  label: 'My Appointments', icon: <Calendar size={16} strokeWidth={1.5} /> },
      { key: '/cases',         label: 'My Cases',        icon: <Gavel size={16} strokeWidth={1.5} /> },
      { key: '/saved',         label: 'Saved Lawyers',   icon: <Heart size={16} strokeWidth={1.5} /> },
      { key: '/messages',      label: 'Messages',        icon: <MessageSquare size={16} strokeWidth={1.5} /> },
      { key: '/documents',     label: 'Documents',       icon: <FileText size={16} strokeWidth={1.5} /> },
      { key: '/payments',      label: 'Payments',        icon: <CreditCard size={16} strokeWidth={1.5} /> },
      { key: '/notifications', label: 'Notifications',   icon: <Bell size={16} strokeWidth={1.5} /> },
    ],
  },
  {
    label: 'Account',
    items: [
      { key: '/settings', label: 'Settings', icon: <Settings size={16} strokeWidth={1.5} /> },
    ],
  },
];

export const CLIENT_PORTAL_LOGO = (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded bg-gold flex items-center justify-center shrink-0">
      <Scale size={18} strokeWidth={1.8} className="text-navy" />
    </div>
    <div>
      <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gold font-sans leading-none mb-0.5">
        Client Portal
      </div>
      <div className="font-heading text-[17px] font-semibold text-white leading-tight">
        {brand.name}
      </div>
    </div>
  </div>
);
