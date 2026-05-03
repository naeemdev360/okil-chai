import * as React from 'react';
import { cn } from '../../utils/cn';
import { NotificationIcon } from './NotificationIcon';
import type { NotificationItem } from './notification.types';

interface NotificationRowProps {
  readonly notification: NotificationItem;
  readonly renderLink?: (href: string, label: string) => React.ReactNode;
}

function defaultRenderLink(href: string, label: string): React.ReactNode {
  return (
    <a
      href={href}
      className="inline-block mt-[10px] font-sans text-[13px] font-semibold text-navy underline underline-offset-[3px] hover:opacity-70 transition-opacity"
    >
      {label} →
    </a>
  );
}

export function NotificationRow({ notification: n, renderLink = defaultRenderLink }: NotificationRowProps) {
  return (
    <div
      className={cn(
        'relative flex items-start gap-4 px-6 py-4 border-b border-gray-100 transition-colors duration-150',
        !n.isRead
          ? 'border-l-[3px] border-l-gold bg-gold/5'
          : 'border-l-[3px] border-l-transparent',
      )}
    >
      {!n.isRead && (
        <span
          aria-hidden="true"
          className="absolute top-[18px] right-4 w-2 h-2 rounded-full bg-gold"
        />
      )}

      <NotificationIcon type={n.type} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p
            className={cn(
              'font-sans text-sm text-navy leading-snug',
              n.isRead ? 'font-normal' : 'font-semibold',
            )}
          >
            {n.title}
          </p>
          <span className="font-sans text-[11px] text-gray-400 whitespace-nowrap shrink-0">
            {n.time}
          </span>
        </div>
        <p className="font-sans text-[13px] text-gray-600 leading-[1.5]">{n.description}</p>
        {n.actionLabel && n.actionHref && renderLink(n.actionHref, n.actionLabel)}
      </div>
    </div>
  );
}
