import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { PageHeader } from '../../components/ui/PageHeader';
import { CalendarGrid } from '../../components/features/availability/CalendarGrid';
import { WeeklyDefaultsCard } from '../../components/features/availability/WeeklyDefaultsCard';
import type { MockData } from '../../types/lawyer.types';

interface AvailabilityPageProps {
  readonly data: MockData;
}

export function AvailabilityPage({ data }: AvailabilityPageProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Availability"
          subtitle="Click any slot to edit · drag to create new availability"
          actions={
            <>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
                Sync Google Calendar
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
                <Plus size={14} strokeWidth={1.5} /> Add block
              </button>
            </>
          }
        />
      </Reveal>

      <Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4 items-start">
        <CalendarGrid
          slots={data.availability}
          weekOffset={weekOffset}
          onPrev={() => setWeekOffset(w => w - 1)}
          onNext={() => setWeekOffset(w => w + 1)}
          onToday={() => setWeekOffset(0)}
        />

        <div className="flex flex-col gap-3">
          <WeeklyDefaultsCard />
          <BookingBufferCard />
          <UtilizationCard />
        </div>
      </div>
      </Reveal>
    </RevealGroup>
  );
}

/* ── Page-local info cards ──────────────────────────────── */

function BookingBufferCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 font-sans mb-2">
        Booking buffer
      </div>
      <div className="font-sans text-[13px] text-navy font-medium mb-1">
        15 minutes between sessions
      </div>
      <div className="font-sans text-[12px] text-gray-600 leading-relaxed">
        So you have time to make notes between consultations.
      </div>
    </div>
  );
}

function UtilizationCard() {
  return (
    <div className="bg-gold-pale rounded-xl p-4 border border-gold/30">
      <div className="font-heading text-[15px] font-semibold text-navy mb-1">78% booked this week</div>
      <div className="font-sans text-[12px] text-gray-800 leading-relaxed">
        You're at peak utilization — consider raising your rate or opening evening slots.
      </div>
    </div>
  );
}
