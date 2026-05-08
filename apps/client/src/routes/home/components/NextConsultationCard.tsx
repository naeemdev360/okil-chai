import { Avatar, Button, DecorativeOrb } from '@okil-chai/ui';
import { CalendarClock, Clock, CreditCard, Video } from 'lucide-react';
import { NEXT_APPOINTMENT } from '../../../lib/mock-data';

const META_ITEMS = (time: string, fee: number) =>
  [
    { key: 'time', icon: <Clock size={13} />,      label: time },
    { key: 'mode', icon: <Video size={13} />,      label: 'Video Call' },
    { key: 'fee',  icon: <CreditCard size={13} />, label: `$${fee}` },
  ] as const;

export function NextConsultationCard() {
  const appt = NEXT_APPOINTMENT;

  return (
    <section
      aria-labelledby="next-consultation-heading"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-mid via-navy-light to-navy-mid shadow-md ring-1 ring-gold/20"
    >
      <DecorativeOrb appearance="gold-fill-soft" size="lg" className="-right-16 -top-20" />
      <DecorativeOrb appearance="gold-outline-light" size="xl" className="-bottom-32 -left-24" />

      <header className="relative flex items-center justify-between gap-3 border-b border-white/15 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <CalendarClock size={14} className="text-gold" aria-hidden />
          <h2
            id="next-consultation-heading"
            className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-gold"
          >
            Next Consultation
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold ring-1 ring-gold/30">
          <span className="relative flex size-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
          </span>
          {appt.when}
        </span>
      </header>

      <div className="relative flex flex-col gap-5 p-4 sm:flex-row sm:items-start sm:p-6">
        <div className="shrink-0 self-start sm:self-auto">
          <div className="w-[100px] rounded-xl bg-gradient-to-b from-gold-light to-gold p-4 text-center text-navy shadow-md ring-1 ring-gold-light/60">
            <div className="font-heading text-[36px] font-bold leading-none">5</div>
            <div className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em]">May</div>
            <div className="mt-3 inline-flex items-center justify-center rounded-full bg-navy/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {appt.time}
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <Avatar
              initials={appt.initials}
              size="lg"
              className="bg-gold text-navy ring-2 ring-gold/30"
            />
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-semibold leading-tight text-white drop-shadow-sm">
                {appt.lawyer}
              </p>
              <p className="font-sans text-xs tracking-[0.04em] text-gold">{appt.spec}</p>
            </div>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {META_ITEMS(appt.time, appt.fee).map((item) => (
              <li
                key={item.key}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 font-sans text-[12px] text-white ring-1 ring-white/25"
              >
                <span className="text-gold" aria-hidden>{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:self-start">
          <Button variant="gold" size="sm" className="w-full shadow-md shadow-gold/20 sm:w-auto">
            <Video size={14} aria-hidden /> Join Video Call
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full border border-white/35 text-white hover:bg-white/15 hover:text-white sm:w-auto"
          >
            Reschedule
          </Button>
        </div>
      </div>
    </section>
  );
}
