import type { CaseHearingResponse } from '@repo/shared';
import { Badge } from '@repo/ui';
import { Calendar, MapPin } from 'lucide-react';
import { formatDateTime } from '../utils/cases.utils';

interface HearingListProps {
  readonly hearings: readonly CaseHearingResponse[];
}

export function HearingList({ hearings }: HearingListProps) {
  if (hearings.length === 0) {
    return <p className="text-[13px] text-gray-500 font-sans">No hearings scheduled.</p>;
  }

  const now = new Date();

  return (
    <ul className="flex flex-col gap-3">
      {hearings.map((h) => {
        const isPast = h.scheduledAt < now;
        return (
          <li key={h.id} className="rounded-lg border border-gray-100 p-3.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge variant={isPast ? 'cancelled' : 'available'}>
                {h.hearingType.toLowerCase()}
              </Badge>
              <span className="font-heading text-[14px] font-semibold text-navy inline-flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDateTime(h.scheduledAt)}
              </span>
            </div>
            {h.venue && (
              <p className="text-[12px] text-gray-600 font-sans inline-flex items-center gap-1.5">
                <MapPin size={12} /> {h.venue}
              </p>
            )}
            {h.notes && <p className="text-[13px] text-gray-700 font-sans mt-2">{h.notes}</p>}
            {h.outcome && (
              <p className="text-[13px] text-gray-700 font-sans mt-2">
                <span className="font-semibold text-navy">Outcome:</span> {h.outcome}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
