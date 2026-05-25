import Link from 'next/link';
import { Calendar, Clock, Lock, Mail, Star, Video } from 'lucide-react';
import { cn } from '@repo/ui';
import type { AvailabilitySlot } from '@repo/shared';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import { CONSULT_META } from './constants';
import { formatDateLabel, formatTime } from './utils';
import type { BookingLawyerProfile, ConsultType } from './types';

interface ConfirmationCardProps {
  readonly lawyer:       BookingLawyerProfile;
  readonly consultType:  ConsultType;
  readonly selectedDay:  string;
  readonly selectedSlot: AvailabilitySlot;
  readonly locale:       string;
}

const WHAT_TO_EXPECT: ReadonlyArray<{
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  accent: 'success' | 'gold';
}> = [
  { icon: Mail,  text: 'A confirmation email has been sent to your inbox with a calendar invite.',    accent: 'success' },
  { icon: Clock, text: "24 hours before your consultation, you'll receive a reminder notification.",  accent: 'success' },
  { icon: Video, text: 'Join your video call from the "My Appointments" tab in your portal.',         accent: 'gold'    },
  { icon: Star,  text: "After your consultation, you'll be invited to leave a review to help other clients.", accent: 'gold' },
];

const PREP_TIPS: ReadonlyArray<string> = [
  'Write down the key facts, dates, and people involved in your case',
  'Gather any relevant documents (contracts, emails, correspondence)',
  'Prepare 2–3 specific questions you want answered',
  'Find a quiet, private place for your call',
];

export function ConfirmationCard({
  lawyer,
  consultType,
  selectedDay,
  selectedSlot,
  locale,
}: ConfirmationCardProps) {
  const { label: consultLabel, icon: ConsultIcon } = CONSULT_META[consultType];

  const infoItems = [
    { icon: Calendar,    label: 'Date',   value: formatDateLabel(selectedDay)                                   },
    { icon: Clock,       label: 'Time',   value: `${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}` },
    { icon: ConsultIcon, label: 'Format', value: consultLabel                                                    },
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
      {/* Navy header */}
      <div className="bg-navy px-9 py-8 flex items-center gap-5">
        <LawyerAvatar initials={lawyer.initials} verified photoUrl={lawyer.photoUrl} size="xl" />
        <div>
          <p className="font-sans text-xs text-gold font-semibold tracking-[0.1em] uppercase mb-1">
            Your Consultation is Confirmed
          </p>
          <h1 className="font-heading text-[26px] font-bold text-white mb-1">{lawyer.fullName}</h1>
          <p className="font-sans text-xs text-white/60 tracking-[0.06em] uppercase">
            {lawyer.primarySpecialization}
          </p>
        </div>
      </div>

      {/* Date / Time / Format row */}
      <div className="px-9 py-7 grid grid-cols-3 gap-6">
        {infoItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-gold-pale flex items-center justify-center shrink-0">
              <Icon className="size-4 text-gold" aria-hidden />
            </div>
            <div>
              <p className="font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase mb-0.5">
                {label}
              </p>
              <p className="font-sans text-sm font-medium text-navy">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video link row */}
      {consultType === 'video' && (
        <div className="mx-9 mb-7 p-3.5 bg-cream rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="size-3.5 text-gray-600" aria-hidden />
            <span className="font-sans text-[13px] text-gray-800">
              Your video link will appear here 10 minutes before the call.
            </span>
          </div>
          <Link
            href={`/${locale}/search`}
            className="px-3.5 py-2 rounded-lg bg-navy text-white font-sans text-xs font-semibold hover:bg-navy-mid transition-colors"
          >
            Join Now
          </Link>
        </div>
      )}

      {/* What to Expect */}
      <div className="px-9 pb-7 border-t border-gray-100 pt-6">
        <h3 className="font-heading text-lg font-semibold text-navy mb-5">What to Expect</h3>
        <div className="flex flex-col gap-3.5">
          {WHAT_TO_EXPECT.map(({ icon: Icon, text, accent }, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <div
                className={cn(
                  'size-9 rounded-full flex items-center justify-center shrink-0',
                  accent === 'success' ? 'bg-success-bg' : 'bg-gold-pale',
                )}
              >
                <Icon
                  className={cn('size-4', accent === 'success' ? 'text-success' : 'text-gold')}
                  aria-hidden
                />
              </div>
              <p className="font-sans text-sm text-gray-800 leading-relaxed pt-2">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prepare */}
      <div className="mx-9 mb-9 bg-navy rounded-xl p-7">
        <h3 className="font-heading text-lg font-semibold text-white mb-3.5">
          Prepare for Your Consultation
        </h3>
        <ul className="flex flex-col gap-2.5">
          {PREP_TIPS.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 font-sans text-[13px] text-white/85 leading-relaxed"
            >
              <span className="text-gold font-bold shrink-0 mt-px">0{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
