'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Button, SurfaceCard, TogglePill } from '@repo/ui';
import type { Lawyer } from '../../../lib/search/mock-lawyers';

const WEEK_DAYS = [
  { label: 'Mon', date: 'Apr 28', available: true  },
  { label: 'Tue', date: 'Apr 29', available: true  },
  { label: 'Wed', date: 'Apr 30', available: false },
  { label: 'Thu', date: 'May 1',  available: true  },
  { label: 'Fri', date: 'May 2',  available: true  },
  { label: 'Sat', date: 'May 3',  available: false },
] as const;

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '10:30 AM', '2:00 PM', '3:00 PM', '3:30 PM', '4:00 PM',
] as const;

interface AvailabilityTabProps {
  readonly lawyer: Lawyer;
}

export function AvailabilityTab({ lawyer }: AvailabilityTabProps) {
  const locale = useLocale();
  const [selectedDay,  setSelectedDay]  = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDaySelect = (date: string) => {
    setSelectedDay(date);
    setSelectedTime(null);
  };

  return (
    <SurfaceCard radius="xl" elevation="sm">
      <h3 className="font-heading text-xl font-semibold text-navy mb-5">
        Available Slots — This Week
      </h3>

      <p className="font-sans text-xs font-semibold tracking-[0.06em] uppercase text-gray-600 mb-3">
        April / May 2026
      </p>
      <div className="grid grid-cols-6 gap-2 mb-6">
        {WEEK_DAYS.map((day) => (
          <TogglePill
            key={day.date}
            variant="card"
            size="card"
            active={selectedDay === day.date}
            disabled={!day.available}
            onClick={() => handleDaySelect(day.date)}
            className="py-2.5"
          >
            <span className="text-[10px] opacity-70 mb-0.5">{day.label}</span>
            <span className="font-semibold text-xs">{day.date}</span>
          </TogglePill>
        ))}
      </div>

      {selectedDay && (
        <>
          <p className="font-sans text-xs font-semibold tracking-[0.06em] uppercase text-gray-600 mb-3">
            Available Times
          </p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {TIME_SLOTS.map((time) => (
              <TogglePill
                key={time}
                variant="default"
                size="md"
                active={selectedTime === time}
                onClick={() => setSelectedTime(time)}
                className="py-2.5 rounded-lg w-full justify-center"
              >
                {time}
              </TogglePill>
            ))}
          </div>
        </>
      )}

      <Button
        variant="gold"
        size="lg"
        disabled={!selectedDay || !selectedTime}
        className="w-full justify-center disabled:opacity-40"
        asChild={Boolean(selectedDay && selectedTime)}
      >
        {selectedDay && selectedTime ? (
          <Link href={`/${locale}/book/${lawyer.id}?day=${selectedDay}&time=${encodeURIComponent(selectedTime)}`}>
            Continue to Booking
          </Link>
        ) : (
          <span>Select a day and time to continue</span>
        )}
      </Button>
    </SurfaceCard>
  );
}
