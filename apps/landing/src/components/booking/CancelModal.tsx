'use client';

import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { cn } from '@repo/ui';

export interface CancelModalProps {
  readonly lawyerName: string;
  readonly day: string;
  readonly time: string;
  readonly onConfirm: (reason: string) => void;
  readonly onDismiss: () => void;
}

const REASONS = [
  'Schedule conflict',
  'Found another lawyer',
  'Issue resolved',
  'Need to reschedule',
  'Other',
] as const;

export function CancelModal({ lawyerName, day, time, onConfirm, onDismiss }: CancelModalProps) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-navy/50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-[480px] w-full shadow-xl">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="font-heading text-[22px] font-semibold text-navy mb-1">
              Cancel Appointment
            </h2>
            <p className="font-sans text-sm text-gray-600">This action cannot be undone.</p>
          </div>
          <button type="button" onClick={onDismiss} className="p-1 text-gray-400 hover:text-navy">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="bg-cream rounded-xl p-3.5 mb-5">
          <p className="font-sans text-sm font-semibold text-navy mb-1">{lawyerName}</p>
          <p className="font-sans text-[13px] text-gray-600">{day} · {time}</p>
        </div>

        <p className="font-sans text-xs font-semibold text-navy mb-2.5">Reason for cancellation</p>
        <div className="flex flex-col gap-2 mb-4">
          {REASONS.map((r) => (
            <label
              key={r}
              className={cn(
                'flex items-center gap-2.5 cursor-pointer px-3.5 py-2.5 rounded-lg border-[1.5px] transition-all duration-150',
                reason === r ? 'border-navy bg-navy/5' : 'border-gray-200 bg-white',
              )}
            >
              <input
                type="radio"
                name="cancel-reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="accent-navy"
              />
              <span className="font-sans text-[13px] text-navy">{r}</span>
            </label>
          ))}
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-warning-bg rounded-lg border border-warning/30 mb-5">
          <Info className="size-4 text-warning mt-0.5 shrink-0" aria-hidden />
          <p className="font-sans text-xs text-gray-800 leading-relaxed">
            <strong className="text-warning">Refund policy:</strong> Cancellations made 24+ hours
            before receive a full refund. Within 24 hours, a 50% cancellation fee applies.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 font-sans text-sm text-gray-600 hover:text-navy hover:border-navy transition-colors"
          >
            Keep Appointment
          </button>
          <button
            type="button"
            disabled={!reason}
            onClick={() => reason && onConfirm(reason)}
            className="flex-1 py-2.5 rounded-lg font-sans text-sm font-semibold bg-error text-white disabled:opacity-40 hover:bg-error/90 transition-colors"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
