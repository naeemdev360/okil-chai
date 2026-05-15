import {
  Bell,
  Calendar,
  CalendarCheck,
  DollarSign,
  Eye,
  Folder,
  Home,
  MessageSquare,
  Scale,
  Settings,
  Sparkles,
  Star,
  UserCheck,
  Video,
} from 'lucide-react';
import type { DarkNavSection } from '@repo/ui';

export const LAWYER_NAV_SECTIONS: readonly DarkNavSection[] = [
  {
    label: 'Workspace',
    items: [
      { key: 'dashboard',     label: 'Dashboard',     icon: <Home size={16} strokeWidth={1.5} /> },
      { key: 'bookings',      label: 'Bookings',      icon: <CalendarCheck size={16} strokeWidth={1.5} />, badge: 'NEW' },
      { key: 'consult',       label: 'Consult room',  icon: <Video size={16} strokeWidth={1.5} />, live: true },
      { key: 'availability',  label: 'Availability',  icon: <Calendar size={16} strokeWidth={1.5} /> },
      { key: 'messages',      label: 'Messages',      icon: <MessageSquare size={16} strokeWidth={1.5} />, count: 7 },
      { key: 'documents',     label: 'Documents',     icon: <Folder size={16} strokeWidth={1.5} /> },
      { key: 'reviews',       label: 'Reviews',       icon: <Star size={16} strokeWidth={1.5} /> },
      { key: 'earnings',      label: 'Earnings',      icon: <DollarSign size={16} strokeWidth={1.5} /> },
      { key: 'profile',       label: 'Profile',       icon: <UserCheck size={16} strokeWidth={1.5} /> },
      { key: 'listing',       label: 'Public listing',icon: <Eye size={16} strokeWidth={1.5} /> },
      { key: 'notifications', label: 'Notifications', icon: <Bell size={16} strokeWidth={1.5} />, count: 7 },
    ],
  },
  {
    label: 'Account',
    items: [
      { key: 'settings', label: 'Settings', icon: <Settings size={16} strokeWidth={1.5} /> },
    ],
  },
];

export const LAWYER_PORTAL_LOGO = (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded bg-gold flex items-center justify-center shrink-0">
      <Scale size={18} strokeWidth={1.8} className="text-navy" />
    </div>
    <div>
      <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gold font-sans leading-none mb-0.5">
        Lawyer Portal
      </div>
      <div className="font-heading text-[17px] font-semibold text-white leading-tight">
        LegalConnect
      </div>
    </div>
  </div>
);

export const LAWYER_SIDEBAR_PRO_TIP = (
  <div className="mx-1 p-3.5 rounded-md bg-gold/12 border border-gold/24">
    <div className="flex items-center gap-1.5 mb-1.5">
      <Sparkles size={12} className="text-gold" />
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gold font-sans">
        Pro tip
      </span>
    </div>
    <p className="text-[12px] text-white/85 leading-relaxed font-sans">
      Set 2–3 buffer slots between sessions to keep clients happy.
    </p>
  </div>
);
