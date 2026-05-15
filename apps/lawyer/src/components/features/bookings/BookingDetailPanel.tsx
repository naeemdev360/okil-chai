import { useState } from 'react';
import { Calendar, Check, Download, Mail, MessageSquare, Phone, ShieldCheck, Video, X } from 'lucide-react';
import { Avatar, Badge } from '@repo/ui';
import { BookingStatusBadge } from './BookingStatusBadge';
import { SectionLabel } from '../../ui/SectionLabel';
import { KVRow } from '../../ui/KVRow';
import type { Booking, BookingStatus } from '../../../types/lawyer.types';

interface BookingDetailPanelProps {
  readonly booking: Booking;
  readonly onStatusChange: (id: number, status: BookingStatus) => void;
}

export function BookingDetailPanel({ booking: b, onStatusChange }: BookingDetailPanelProps) {
  const [declineMode, setDeclineMode] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const TypeIcon = b.type === 'video' ? Video : b.type === 'phone' ? Phone : Calendar;
  const typeLabel = b.type === 'video' ? 'Video call' : b.type === 'phone' ? 'Phone call' : 'In-person';

  const submitDecline = () => {
    if (!declineReason.trim()) return;
    onStatusChange(b.id, 'declined');
    setDeclineMode(false);
    setDeclineReason('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-7 py-5 border-b border-gray-100 flex gap-5 items-start flex-wrap">
        <Avatar initials={b.initials} size="xl" />
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h3 className="font-heading text-[22px] font-semibold text-navy">{b.client}</h3>
            <BookingStatusBadge status={b.status} />
            {b.priority === 'urgent' && <Badge variant="cancelled">Urgent</Badge>}
          </div>
          <div className="flex gap-4 text-[13px] text-gray-600 flex-wrap mb-1.5">
            <span className="inline-flex items-center gap-1.5"><Mail size={13} strokeWidth={1.5} />{b.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={13} strokeWidth={1.5} />{b.phone}</span>
          </div>
          <div className="text-[12px] text-gray-400 font-sans">
            Submitted {b.submitted ?? 'just now'}
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
          <MessageSquare size={13} strokeWidth={1.5} /> Message client
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 px-7 py-6">
        <div>
          <SectionLabel>Consultation details</SectionLabel>
          <KVRow label="When" value={<strong className="text-navy">{b.requestedFor}</strong>} />
          <KVRow label="Duration" value={b.duration} />
          <KVRow label="Format" value={
            <span className="inline-flex items-center gap-1.5">
              <TypeIcon size={13} strokeWidth={1.5} /> {typeLabel}
            </span>
          } />
          <KVRow label="Practice area" value={b.area} />
          <KVRow
            label="Fee"
            value={<span className="font-heading text-[18px] font-bold text-navy">${b.fee}</span>}
            last
          />

          <div className="mt-5">
            <SectionLabel>Client message</SectionLabel>
            <div className="bg-cream rounded-md p-4 font-sans text-[14px] text-gray-800 leading-relaxed border-l-[3px] border-l-gold">
              {b.brief}
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>Client context</SectionLabel>
          <KVRow label="Member since" value={b.memberSince} />
          <KVRow
            label="Past bookings"
            value={`${b.pastBookings} (${b.pastWithYou} with you)`}
          />
          <KVRow label="Location" value={b.location} last />

          {b.attachments && b.attachments.length > 0 && (
            <div className="mt-5">
              <SectionLabel>Attachments</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {b.attachments.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 border border-gray-100 rounded-md">
                    <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                      <Download size={14} className="text-navy" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-navy font-medium font-sans truncate">{a.name}</div>
                      <div className="text-[11px] text-gray-400 font-sans">{a.size}</div>
                    </div>
                    <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Download size={13} className="text-gray-600" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 p-4 bg-success-bg border border-success/30 rounded-md flex gap-2.5">
            <ShieldCheck size={18} className="text-success shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-[12px] text-success leading-relaxed font-sans">
              <strong>Payment authorized.</strong> ${b.fee} held by LegalConnect Escrow. Released after consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-7 py-4 bg-gray-50 border-t border-gray-100">
        {declineMode ? (
          <div className="flex gap-2.5 items-center flex-wrap">
            <input
              placeholder="Brief reason (visible to client) — e.g. conflict of interest"
              value={declineReason}
              onChange={e => setDeclineReason(e.target.value)}
              className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-md border-[1.5px] border-gray-200 font-sans text-[13px] outline-none focus:border-navy transition-colors"
            />
            <button
              onClick={() => { setDeclineMode(false); setDeclineReason(''); }}
              className="px-3.5 py-2.5 font-sans text-[14px] text-gray-600 hover:text-navy transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitDecline}
              className="px-4 py-2.5 bg-error text-white rounded-md font-sans text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              Send decline
            </button>
          </div>
        ) : b.status === 'pending' ? (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button className="px-4 py-2.5 border border-gray-200 bg-white rounded-md font-sans text-[14px] text-gray-800 font-medium hover:bg-gray-50 transition-colors">
              Suggest a different time
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setDeclineMode(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-error/40 bg-white rounded-md font-sans text-[14px] text-error font-medium hover:bg-error-bg transition-colors"
            >
              <X size={14} /> Decline
            </button>
            <button
              onClick={() => onStatusChange(b.id, 'confirmed')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-success text-white rounded-md font-sans text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              <Check size={14} /> Accept booking
            </button>
          </div>
        ) : b.status === 'confirmed' ? (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button className="px-4 py-2.5 border border-error/40 bg-white rounded-md font-sans text-[14px] text-error font-medium hover:bg-error-bg transition-colors">
              Cancel booking
            </button>
            <div className="flex-1" />
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 bg-white rounded-md font-sans text-[14px] text-navy font-medium hover:bg-gray-50 transition-colors">
              <Calendar size={14} /> Reschedule
            </button>
            {b.type === 'video' && (
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-navy text-white rounded-md font-sans text-[14px] font-medium hover:bg-navy-mid transition-colors">
                <Video size={14} /> Join consultation
              </button>
            )}
            {b.type === 'phone' && (
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-navy text-white rounded-md font-sans text-[14px] font-medium hover:bg-navy-mid transition-colors">
                <Phone size={14} /> Mark as called
              </button>
            )}
            {b.type === 'in-person' && (
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-navy text-white rounded-md font-sans text-[14px] font-medium hover:bg-navy-mid transition-colors">
                <Check size={14} /> Mark complete
              </button>
            )}
          </div>
        ) : b.status === 'completed' ? (
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-sans text-[13px] text-gray-600">
              Consultation completed — payment released to your balance.
            </span>
            <div className="flex-1" />
            <button className="px-4 py-2.5 border border-gray-200 bg-white rounded-md font-sans text-[14px] text-navy font-medium hover:bg-gray-50">View invoice</button>
            <button className="px-4 py-2.5 bg-navy text-white rounded-md font-sans text-[14px] font-medium hover:bg-navy-mid">Send follow-up</button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 font-sans text-[13px] text-gray-600">
            <X size={14} className="text-error" /> Declined {b.declinedAt ?? 'recently'}.
            {b.declineReason && <span className="text-gray-800">"{b.declineReason}"</span>}
          </div>
        )}
      </div>
    </div>
  );
}
