import { useState } from 'react';
import { Calendar, Check, Clock, Phone, Video, X } from 'lucide-react';
import { Avatar } from '@repo/ui';
import type { Booking } from '../../../types/lawyer.types';

type RowState = 'idle' | 'accepting' | 'declining' | 'accepted' | 'declined';

interface PendingRequestRowProps {
  readonly booking: Booking;
  readonly divider?: boolean;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
}

export function PendingRequestRow({ booking: b, divider, onAccept, onDecline }: PendingRequestRowProps) {
  const [state, setState] = useState<RowState>('idle');

  const handleAccept = () => {
    setState('accepting');
    setTimeout(() => { setState('accepted'); onAccept(); }, 350);
  };

  const handleDecline = () => {
    setState('declining');
    setTimeout(() => { setState('declined'); onDecline(); }, 350);
  };

  const TypeIcon = b.type === 'video' ? Video : b.type === 'phone' ? Phone : Calendar;

  return (
    <div
      className={[
        'px-4 py-3.5 transition-all duration-200',
        divider ? 'border-t border-gray-100' : '',
        state === 'accepted' ? 'bg-success-bg' : state === 'declined' ? 'bg-error-bg' : 'bg-white',
        (state === 'accepted' || state === 'declined') ? 'opacity-80' : '',
      ].join(' ')}
    >
      <div className="flex gap-2.5 items-start">
        <Avatar initials={b.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-sans text-[14px] font-semibold text-navy">{b.client}</span>
            <span className="text-[11px] text-gray-400">· {b.submitted ?? 'just now'}</span>
          </div>
          <div className="text-[12px] text-gray-600 leading-snug mb-1.5">{b.topic}</div>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-600 mb-2">
            <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-sm">
              <Calendar size={10} /> {b.requestedFor}
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-sm">
              <TypeIcon size={10} /> {b.type}
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-sm">
              <Clock size={10} /> {b.duration}
            </span>
            <span className="inline-flex items-center gap-1 bg-gold-pale text-navy font-semibold px-2 py-0.5 rounded-sm">
              ${b.fee}
            </span>
          </div>

          {state === 'idle' && (
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={handleAccept}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-success text-white text-[12px] font-medium rounded font-sans hover:opacity-90 transition-opacity"
              >
                <Check size={12} /> Accept
              </button>
              <button
                onClick={handleDecline}
                className="inline-flex items-center gap-1 px-2.5 py-1 border border-error/40 text-error text-[12px] font-medium rounded bg-white font-sans hover:bg-error-bg transition-colors"
              >
                <X size={12} /> Decline
              </button>
              <button className="inline-flex items-center px-2.5 py-1 text-gray-600 text-[12px] font-medium rounded font-sans hover:bg-gray-50 transition-colors">
                Suggest new time
              </button>
            </div>
          )}
          {state === 'accepting' && <p className="text-[12px] text-success font-medium">Confirming…</p>}
          {state === 'declining' && <p className="text-[12px] text-error font-medium">Declining…</p>}
          {state === 'accepted' && (
            <p className="inline-flex items-center gap-1 text-[12px] text-success font-semibold">
              <Check size={12} /> Booking confirmed — client notified.
            </p>
          )}
          {state === 'declined' && (
            <p className="inline-flex items-center gap-1 text-[12px] text-error font-semibold">
              <X size={12} /> Declined — client notified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
