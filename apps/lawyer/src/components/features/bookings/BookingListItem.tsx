import { Calendar, Phone, Video } from 'lucide-react';
import { Avatar } from '@repo/ui';
import { BookingStatusBadge } from './BookingStatusBadge';
import type { Booking } from '../../../types/lawyer.types';

interface BookingListItemProps {
  readonly booking: Booking;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly divider?: boolean;
}

export function BookingListItem({ booking: b, isSelected, onClick, divider }: BookingListItemProps) {
  const TypeIcon = b.type === 'video' ? Video : b.type === 'phone' ? Phone : Calendar;

  return (
    <button
      onClick={onClick}
      className={[
        'block w-full text-left px-4 py-3.5 cursor-pointer border-l-[3px] transition-colors',
        divider ? 'border-t border-gray-100' : '',
        isSelected ? 'bg-gold-pale border-l-gold' : 'bg-white border-l-transparent hover:bg-gray-50',
      ].join(' ')}
    >
      <div className="flex gap-2.5 items-start">
        <Avatar initials={b.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2 mb-1">
            <span className="font-sans text-[14px] font-semibold text-navy truncate min-w-0 flex-1">
              {b.client}
            </span>
            <span className="shrink-0"><BookingStatusBadge status={b.status} /></span>
          </div>
          <div className="text-[12px] text-gray-600 mb-1 truncate font-sans">{b.topic}</div>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 font-sans">
            <TypeIcon size={11} strokeWidth={1.5} />
            {b.requestedFor}
          </div>
        </div>
      </div>
    </button>
  );
}
