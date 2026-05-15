import { Avatar } from '@repo/ui';
import { Link } from 'react-router-dom';
import { UPCOMING_APPOINTMENTS, type ConsultationType } from '../../../lib/mock-data';

function typeLabel(type: ConsultationType): string {
  if (type === 'video') return 'Video';
  if (type === 'phone') return 'Phone';
  return 'In-Person';
}

function typeColorClass(type: ConsultationType): string {
  if (type === 'video') return 'text-navy-light bg-navy-light/10';
  if (type === 'phone') return 'text-success bg-success-bg';
  return 'text-warning bg-warning-bg';
}

export function UpcomingAppointmentsList() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-gray-100">
        <span className="font-heading text-base font-semibold text-navy">Upcoming</span>
        <Link
          to="/appointments"
          className="text-xs font-semibold text-gold font-sans hover:opacity-75 transition-opacity"
        >
          View all →
        </Link>
      </div>

      {UPCOMING_APPOINTMENTS.map((a, i) => (
        <div
          key={a.id}
          className={`px-4 py-4 sm:px-6 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5${
            i < UPCOMING_APPOINTMENTS.length - 1 ? ' border-b border-gray-100' : ''
          }`}
        >
          <Avatar initials={a.initials} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy font-sans">{a.lawyer}</p>
            <p className="text-xs text-gray-600 font-sans">
              {a.spec} · {a.date} · {a.time}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded font-sans ${typeColorClass(a.type)}`}>
              {typeLabel(a.type)}
            </span>
            <span className="font-heading text-sm font-semibold text-navy">${a.fee}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
