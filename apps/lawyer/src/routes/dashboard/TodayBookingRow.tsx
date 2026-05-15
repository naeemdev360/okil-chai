import { Calendar, Phone, Video } from 'lucide-react';
import { Avatar } from '@repo/ui';
import type { Booking } from '../../types/lawyer.types';

interface TodayBookingRowProps {
  readonly booking: Booking;
  readonly divider?: boolean;
}

export function TodayBookingRow({ booking: b, divider }: TodayBookingRowProps) {
  const TypeIcon = b.type === 'video' ? Video : b.type === 'phone' ? Phone : Calendar;
  const typeLabel = b.type === 'video' ? 'Video' : b.type === 'phone' ? 'Phone' : 'In-person';

  return (
    <div
      className={`grid grid-cols-[60px_1fr_auto] gap-4 items-center px-5 py-3.5 ${divider ? 'border-t border-gray-100' : ''}`}
    >
      <div className="text-center border-r border-gray-100 pr-3">
        <div className="font-heading text-[18px] font-bold text-navy leading-none">{b.timeShort}</div>
        <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-[0.06em] font-sans">{b.ampm}</div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Avatar initials={b.initials} size="sm" />
          <span className="font-sans text-[14px] font-semibold text-navy">{b.client}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 font-sans">
            <TypeIcon size={11} strokeWidth={1.5} /> {typeLabel}
          </span>
        </div>
        <div className="text-[12px] text-gray-600 pl-8 truncate font-sans">{b.topic}</div>
      </div>

      <div>
        {b.type === 'video' ? (
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy text-white text-[13px] font-medium rounded-md hover:bg-navy-mid transition-colors font-sans">
            <Video size={13} strokeWidth={1.5} /> Join
          </button>
        ) : (
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-navy text-[13px] font-medium rounded-md hover:bg-gray-50 transition-colors font-sans">
            Open
          </button>
        )}
      </div>
    </div>
  );
}
