import { Clock } from 'lucide-react';

export function NotifQuietHoursCard() {
  return (
    <div className="bg-navy text-white rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} className="text-gold" strokeWidth={1.5} />
        <span className="text-[10px] text-gold font-bold tracking-[0.1em] uppercase font-sans">
          Quiet hours
        </span>
      </div>
      <div className="font-heading text-[16px] font-semibold mb-1">9:00 PM – 7:00 AM</div>
      <p className="font-sans text-[12px] text-white/65 leading-relaxed">
        Non-urgent notifications wait. Booking requests and reminders still come through.
      </p>
    </div>
  );
}
