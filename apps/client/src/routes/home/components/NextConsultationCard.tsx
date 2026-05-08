import { Avatar, Badge, Button } from '@okil-chai/ui';
import { Clock, CreditCard, Video } from 'lucide-react';
import { NEXT_APPOINTMENT } from '../../../lib/mock-data';

export function NextConsultationCard() {
  const appt = NEXT_APPOINTMENT;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-gray-100">
        <span className="font-heading text-base font-semibold text-navy">Next Consultation</span>
        <Badge variant="available">Upcoming</Badge>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Date countdown block */}
        <div className="bg-gold-pale border border-gold/20 rounded-lg px-5 py-4 text-center shrink-0 min-w-[88px] self-start sm:self-auto">
          <div className="font-heading text-[32px] font-bold text-navy leading-none">5</div>
          <div className="text-[11px] font-sans text-gray-600 mt-1 tracking-[0.04em]">MAY</div>
          <div className="text-[11px] font-sans text-gold font-semibold mt-2">2 days</div>
        </div>

        {/* Lawyer info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <Avatar initials={appt.initials} size="lg" />
            <div>
              <p className="font-heading text-lg font-semibold text-navy leading-tight">{appt.lawyer}</p>
              <p className="text-xs text-gold font-sans tracking-[0.04em]">{appt.spec}</p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap mt-3">
            {([
              { icon: <Clock size={13} />,      text: appt.time     },
              { icon: <Video size={13} />,      text: 'Video Call'  },
              { icon: <CreditCard size={13} />, text: `$${appt.fee}` },
            ] as const).map((d) => (
              <span key={d.text} className="flex items-center gap-1.5 text-[13px] text-gray-600 font-sans">
                <span className="text-gray-400">{d.icon}</span>
                {d.text}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto sm:self-start">
          <Button variant="primary" size="sm">
            <Video size={13} /> Join Call
          </Button>
          <Button variant="ghost" size="sm" className="border border-gray-200 text-gray-600">
            Reschedule
          </Button>
        </div>
      </div>
    </div>
  );
}
