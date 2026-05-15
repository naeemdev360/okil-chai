import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlotPopover } from './SlotPopover';
import type { AvailabilitySlot } from '../../../types/lawyer.types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);
const DAY_DATES = [27, 28, 29, 30, 1, 2, 3] as const;

const SLOT_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  available: { bg: 'bg-success-bg', border: 'border-l-success',   text: 'text-navy'  },
  booked:    { bg: 'bg-navy',       border: 'border-l-gold',      text: 'text-white' },
  blocked:   { bg: 'bg-gray-100',   border: 'border-l-gray-400',  text: 'text-navy'  },
  pending:   { bg: 'bg-warning-bg', border: 'border-l-warning',   text: 'text-navy'  },
};

const DEFAULT_STYLE = SLOT_STYLE['available']!;

function fmtHour(h: number): string {
  const am = h < 12;
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}:00 ${am ? 'AM' : 'PM'}`;
}

interface PopoverState {
  slot: AvailabilitySlot & { dayLabel: string };
  top: number;
  left: number;
}

interface CalendarGridProps {
  readonly slots: readonly AvailabilitySlot[];
  readonly weekOffset: number;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onToday: () => void;
}

export function CalendarGrid({ slots, weekOffset, onPrev, onNext, onToday }: CalendarGridProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null);

  const slotAt = (day: string, hour: number) =>
    slots.find(s => s.day === day && hour >= s.start && hour < s.end);

  const handleSlotClick = (slot: AvailabilitySlot, e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const grid = btn.closest<HTMLElement>('.cal-grid')!;
    const btnRect = btn.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    setPopover({
      slot: { ...slot, dayLabel: slot.day },
      top: btnRect.top - gridRect.top + btnRect.height + 4,
      left: Math.min(btnRect.left - gridRect.left, gridRect.width - 290),
    });
  };

  const monthLabel =
    weekOffset === 0 ? 'Apr 27 – May 3, 2026'
    : weekOffset > 0 ? `+${weekOffset}w`
    : `${weekOffset}w`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 relative cal-grid">
      {/* Week nav */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-[17px] font-semibold text-navy">{monthLabel}</h3>
        <div className="flex gap-1.5">
          <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white rounded hover:bg-gray-50 transition-colors text-gray-600">
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
          <button onClick={onToday} className="px-3 h-8 border border-gray-200 bg-white rounded font-sans text-[12px] text-navy font-medium hover:bg-gray-50 transition-colors">
            Today
          </button>
          <button onClick={onNext} className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white rounded hover:bg-gray-50 transition-colors text-gray-600">
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-0.5" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
        <div />
        {DAYS.map((d, i) => {
          const date = DAY_DATES[i] ?? 0;
          return (
            <div key={d} className="text-center pb-2">
              <div className="font-sans text-[10px] text-gray-400 font-semibold tracking-[0.08em] uppercase">{d}</div>
              <div className={`font-heading text-[18px] font-semibold mt-0.5 ${date === 28 && weekOffset === 0 ? 'text-gold' : 'text-navy'}`}>
                {date < 1 ? 30 + date : date}
              </div>
            </div>
          );
        })}

        {HOURS.map((h, hi) => (
          <>
            <div key={`lbl-${h}`} className="font-sans text-[10px] text-gray-400 text-right pr-2 pt-0.5 font-medium">
              {fmtHour(h)}
            </div>
            {DAYS.map(d => {
              const slot = slotAt(d, h);
              const isStart = slot != null && slot.start === h;
              const span    = slot != null ? slot.end - slot.start : 0;

              if (slot != null && !isStart) {
                return <div key={`${d}-${h}-spacer`} className="h-10" />;
              }

              const s = (slot != null ? SLOT_STYLE[slot.type] : null) ?? DEFAULT_STYLE;

              return (
                <div
                  key={`${d}-${h}`}
                  className={`h-10 relative ${hi === 0 ? 'border-t border-gray-100' : 'border-t border-dashed border-gray-100'}`}
                >
                  {slot != null && isStart && (
                    <button
                      onClick={e => handleSlotClick(slot, e)}
                      style={{ height: span * 40 - 4 }}
                      className={`absolute inset-x-0.5 top-0.5 rounded-sm border-l-[3px] px-2 py-1.5 text-left overflow-hidden cursor-pointer hover:opacity-85 transition-opacity ${s.bg} ${s.border} ${s.text}`}
                    >
                      <div className="font-sans text-[11px] font-semibold leading-none mb-0.5">
                        {slot.type === 'booked'    ? (slot.client ?? 'Booked')
                          : slot.type === 'available' ? 'Available'
                          : slot.type === 'blocked'   ? 'Blocked' : 'Pending'}
                      </div>
                      <div className="font-sans text-[10px] opacity-75">
                        {fmtHour(slot.start)} – {fmtHour(slot.end)}
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-[11px] text-gray-600 font-sans flex-wrap">
        <LegendDot colorClass="bg-success"  bgClass="bg-success-bg" label="Available" />
        <LegendDot colorClass="bg-gold"     bgClass="bg-navy"       label="Booked" />
        <LegendDot colorClass="bg-warning"  bgClass="bg-warning-bg" label="Pending" />
        <LegendDot colorClass="bg-gray-400" bgClass="bg-gray-100"   label="Blocked" />
      </div>

      {/* Slot popover */}
      {popover != null && (
        <div
          style={{ top: popover.top, left: popover.left }}
          className="absolute z-20 w-72 bg-white border border-gray-100 rounded-xl shadow-lg p-4"
        >
          <SlotPopover slot={popover.slot} fmtHour={fmtHour} onClose={() => setPopover(null)} />
        </div>
      )}
    </div>
  );
}

function LegendDot({ colorClass, bgClass, label }: { colorClass: string; bgClass: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-sm border-l-[3px] ${bgClass} ${colorClass}`} />
      {label}
    </span>
  );
}
