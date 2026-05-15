import type { AvailabilitySlot } from '../../../types/lawyer.types';

interface SlotPopoverProps {
  readonly slot: AvailabilitySlot & { dayLabel: string };
  readonly fmtHour: (h: number) => string;
  readonly onClose: () => void;
}

export function SlotPopover({ slot, fmtHour, onClose }: SlotPopoverProps) {
  const titleLabel =
    slot.type === 'booked'    ? slot.client ?? 'Booked'
    : slot.type === 'available' ? 'Available'
    : slot.type === 'blocked'   ? 'Blocked'
    : 'Pending';

  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-heading text-[15px] font-semibold text-navy">{titleLabel}</div>
          <div className="font-sans text-[12px] text-gray-600 mt-0.5">
            {slot.dayLabel} · {fmtHour(slot.start)} – {fmtHour(slot.end)}
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors text-[14px] leading-none">
          ✕
        </button>
      </div>

      {slot.type === 'booked' && (
        <>
          <p className="font-sans text-[12px] text-gray-800 mb-3 leading-snug">{slot.topic}</p>
          <div className="flex gap-1.5">
            <button className="flex-1 py-1.5 bg-navy text-white rounded font-sans text-[12px] font-medium hover:bg-navy-mid transition-colors">
              Open
            </button>
            <button className="py-1.5 px-3 border border-gray-200 rounded font-sans text-[12px] text-navy hover:bg-gray-50 transition-colors">
              Message
            </button>
          </div>
        </>
      )}

      {slot.type === 'available' && (
        <>
          <div className="mb-3">
            <div className="text-[11px] text-gray-400 mb-1.5 font-semibold tracking-[0.06em] uppercase font-sans">
              Slot type
            </div>
            <div className="grid grid-cols-4 gap-1">
              {['Video', 'Phone', 'In-person', 'Any'].map((t, i) => (
                <button
                  key={t}
                  className={`py-1.5 text-[11px] font-sans rounded border transition-colors ${i === 3 ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-navy/40'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5">
            <button className="flex-1 py-1.5 border border-error/40 text-error rounded font-sans text-[12px] font-medium hover:bg-error-bg transition-colors">
              Block
            </button>
            <button className="flex-1 py-1.5 bg-navy text-white rounded font-sans text-[12px] font-medium hover:bg-navy-mid transition-colors">
              Save
            </button>
          </div>
        </>
      )}

      {slot.type === 'blocked' && (
        <button className="w-full py-1.5 bg-navy text-white rounded font-sans text-[12px] font-medium hover:bg-navy-mid transition-colors">
          Make available
        </button>
      )}
    </>
  );
}
