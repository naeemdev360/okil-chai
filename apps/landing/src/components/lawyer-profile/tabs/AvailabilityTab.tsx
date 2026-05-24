'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Button, SurfaceCard, TogglePill } from '@repo/ui';
import type { LawyerPublicProfileResponse } from '@repo/shared';

interface AvailabilityTabProps {
  readonly lawyer: LawyerPublicProfileResponse;
}

function buildWeekDays() {
  const days: { label: string; date: string; iso: string; available: boolean }[] = [];
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      label: DAY_LABELS[d.getDay()]!,
      date: `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`,
      iso,
      available: d.getDay() !== 0 && d.getDay() !== 6,
    });
  }
  return days;
}

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] as const;

export function AvailabilityTab({ lawyer }: AvailabilityTabProps) {
  const locale = useLocale();
  const [selectedDay,  setSelectedDay]  = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const weekDays = buildWeekDays();

  const monthLabel = weekDays[0]
    ? new Date(weekDays[0].iso).toLocaleString('en', { month: 'long', year: 'numeric' })
    : '';

  return (
    <SurfaceCard radius="xl" elevation="sm">
      <h3 className="font-heading text-xl font-semibold text-navy mb-5">
        Available Slots — This Week
      </h3>

      <p className="font-sans text-xs font-semibold tracking-[0.06em] uppercase text-gray-600 mb-3">
        {monthLabel}
      </p>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {weekDays.map((day) => (
          <TogglePill
            key={day.iso}
            variant="card"
            size="card"
            active={selectedDay === day.iso}
            disabled={!day.available}
            onClick={() => { setSelectedDay(day.iso); setSelectedTime(null); }}
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
          <div className="grid grid-cols-3 gap-2 mb-6">
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
          <Link
            href={`/${locale}/book/${lawyer.id}?day=${selectedDay}&time=${encodeURIComponent(selectedTime)}`}
          >
            Continue to Booking
          </Link>
        ) : (
          <span>Select a day and time to continue</span>
        )}
      </Button>
    </SurfaceCard>
  );
}
