import {
  Award,
  Bell,
  CalendarCheck,
  Check,
  Clock,
  DollarSign,
  MessageSquare,
  Shield,
  Star,
} from 'lucide-react';
import type { NotifType } from '../../../routes/notifications/notifications.types';

export interface NotifTypeMeta {
  readonly colorClass: string;
  readonly bgClass: string;
  readonly Icon: React.ElementType;
  readonly label: string;
}

export const NOTIF_TYPE_META: Record<NotifType, NotifTypeMeta> = {
  'booking-request':   { colorClass: 'text-gold',     bgClass: 'bg-gold-pale',    Icon: CalendarCheck, label: 'Booking request' },
  'booking-confirmed': { colorClass: 'text-success',  bgClass: 'bg-success-bg',   Icon: Check,         label: 'Confirmed' },
  'message':           { colorClass: 'text-navy',     bgClass: 'bg-navy/8',       Icon: MessageSquare, label: 'Message' },
  'payout':            { colorClass: 'text-success',  bgClass: 'bg-success-bg',   Icon: DollarSign,    label: 'Payout' },
  'review':            { colorClass: 'text-gold',     bgClass: 'bg-gold-pale',    Icon: Star,          label: 'Review' },
  'system':            { colorClass: 'text-gray-600', bgClass: 'bg-gray-100',     Icon: Shield,        label: 'System' },
  'reminder':          { colorClass: 'text-warning',  bgClass: 'bg-warning-bg',   Icon: Clock,         label: 'Reminder' },
  'milestone':         { colorClass: 'text-gold',     bgClass: 'bg-gold-pale',    Icon: Award,         label: 'Milestone' },
};

export { Bell, Clock, DollarSign, MessageSquare, Star };
