import * as React from 'react';
import { CalendarDays, Clock, CreditCard, MessageSquare, Shield, Star, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { NotificationType } from './notification.types';

interface IconMeta {
  readonly icon: LucideIcon;
  readonly bg: string;
  readonly color: string;
  readonly filled?: boolean;
}

const ICON_MAP: Record<NotificationType, IconMeta> = {
  booking:   { icon: CalendarDays,  bg: 'bg-success-bg',  color: 'text-success'  },
  message:   { icon: MessageSquare, bg: 'bg-[#EEF1F8]',   color: 'text-navy'     },
  reminder:  { icon: Clock,         bg: 'bg-warning-bg',  color: 'text-warning'  },
  review:    { icon: Star,          bg: 'bg-gold-pale',   color: 'text-gold',    filled: true },
  payment:   { icon: CreditCard,    bg: 'bg-gray-50',     color: 'text-gray-600' },
  cancelled: { icon: XCircle,       bg: 'bg-error-bg',    color: 'text-error'    },
  system:    { icon: Shield,        bg: 'bg-[#EEF1F8]',   color: 'text-navy'     },
};

interface NotificationIconProps {
  readonly type: NotificationType;
  readonly size?: 'sm' | 'md';
}

export function NotificationIcon({ type, size = 'md' }: NotificationIconProps) {
  const { icon: Icon, bg, color, filled } = ICON_MAP[type];
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center rounded-full shrink-0',
        size === 'sm' ? 'w-9 h-9' : 'w-11 h-11',
        bg,
      )}
    >
      <Icon
        className={cn(size === 'sm' ? 'size-4' : 'size-5', color)}
        fill={filled ? 'currentColor' : 'none'}
      />
    </span>
  );
}
