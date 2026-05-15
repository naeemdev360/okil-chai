import { ChevronLeft, Pause, Play } from 'lucide-react';
import { Avatar } from '@repo/ui';
import type { Booking } from '../../../types/lawyer.types';

interface ConsultSessionBarProps {
  readonly session: Booking;
  readonly elapsed: number;
  readonly running: boolean;
  readonly onToggleTimer: () => void;
  readonly onBack: () => void;
  readonly onEndSession: () => void;
}

function fmtElapsed(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export function ConsultSessionBar({
  session,
  elapsed,
  running,
  onToggleTimer,
  onBack,
  onEndSession,
}: ConsultSessionBarProps) {
  const billed = Math.max(session.fee, Math.ceil(elapsed / 60) * 3);

  return (
    <div className="bg-navy-dark text-white rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/8 border border-white/12 rounded-md font-sans text-[12px] text-white/85 hover:bg-white/12 transition-colors"
      >
        <ChevronLeft size={12} strokeWidth={1.5} /> Back to bookings
      </button>

      <div className="w-px h-7 bg-white/12 shrink-0" />

      {/* Client context */}
      <div className="flex items-center gap-3">
        <Avatar initials={session.initials} size="md" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-[17px] font-semibold">{session.client}</span>
            <span className="inline-flex items-center gap-1.5 bg-red-500/16 text-[#FF8A8A] px-2 py-0.5 rounded-full font-sans text-[10px] font-bold tracking-[0.06em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse" />
              Live
            </span>
          </div>
          <div className="font-mono text-[11px] text-white/55 mt-0.5">
            CASE-2026-0421 · {session.area}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Billable timer */}
      <div className="flex items-center gap-3 px-3.5 py-2 bg-gold/10 border border-gold/28 rounded-md">
        <div>
          <div className="font-sans text-[10px] text-gold font-semibold tracking-[0.1em] uppercase">Elapsed</div>
          <div className="font-mono text-[18px] text-white font-semibold tracking-[0.04em] leading-none mt-0.5">
            {fmtElapsed(elapsed)}
          </div>
        </div>
        <div className="w-px h-7 bg-white/14" />
        <div>
          <div className="font-sans text-[10px] text-white/55 font-semibold tracking-[0.1em] uppercase">Billable</div>
          <div className="font-heading text-[18px] text-white font-bold leading-none mt-0.5">${billed}</div>
        </div>
        <button
          onClick={onToggleTimer}
          title={running ? 'Pause timer' : 'Resume timer'}
          className={`w-8 h-8 rounded flex items-center justify-center border border-white/12 transition-colors ${running ? 'bg-white/8 hover:bg-white/16' : 'bg-gold hover:bg-gold-light'}`}
        >
          {running
            ? <Pause size={12} fill="white" stroke="white" />
            : <Play size={12} fill="#0F1F3D" stroke="#0F1F3D" />
          }
        </button>
      </div>

      {/* End & invoice */}
      <button
        onClick={onEndSession}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gold text-navy rounded-md font-sans text-[14px] font-semibold hover:bg-gold-light transition-colors"
      >
        End &amp; invoice
      </button>
    </div>
  );
}
