import * as React from 'react';
import { cn } from '../../utils/cn';
import { NotificationIcon } from './NotificationIcon';
import type { NotificationItem } from './notification.types';

interface NotificationPreviewProps {
  readonly notification: NotificationItem;
}

export function NotificationPreview({ notification: n }: NotificationPreviewProps) {
  return (
    <div
      className={cn(
        'relative flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors duration-150',
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

      <NotificationIcon type={n.type} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p
            className={cn(
              'font-sans text-[13px] text-navy leading-tight',
              n.isRead ? 'font-normal' : 'font-semibold',
            )}
          >
            {n.title}
          </p>
          <span className="font-sans text-[11px] text-gray-400 whitespace-nowrap shrink-0">
            {n.time}
          </span>
        </div>
        <p className="font-sans text-xs text-gray-600 leading-[1.5] truncate">
          {n.description}
        </p>
      </div>
    </div>
  );
}
