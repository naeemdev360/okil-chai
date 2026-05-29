import { useClientAppointments } from '@repo/hooks';
import { AppointmentStatus, ConsultationType } from '@repo/shared';
import { Avatar } from '@repo/ui';
import { Link } from 'react-router-dom';

function typeLabel(type: ConsultationType): string {
  if (type === ConsultationType.VIDEO) return 'Video';
  if (type === ConsultationType.PHONE) return 'Phone';
  return 'In-Person';
}

function typeColorClass(type: ConsultationType): string {
  if (type === ConsultationType.VIDEO) return 'text-navy-light bg-navy-light/10';
  if (type === ConsultationType.PHONE) return 'text-success bg-success-bg';
  return 'text-warning bg-warning-bg';
}

function formatApptDate(startAt: Date): string {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(startAt);
}
function formatApptTime(startAt: Date): string {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(startAt);
}

export function UpcomingAppointmentsList() {
  const { data } = useClientAppointments({
    status: AppointmentStatus.CONFIRMED,
    upcoming: true,
    limit: 5,
  });

  const appointments = data?.appointments ?? [];

  if (appointments.length === 0) return null;

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

      {appointments.map((a, i) => {
        const startAt      = new Date(a.startAt);
        const lawyerName   = `${a.lawyer.firstName} ${a.lawyer.lastName}`;
        const initials     = `${a.lawyer.firstName[0]}${a.lawyer.lastName[0]}`.toUpperCase();
        const consultType  = a.consultationType as ConsultationType;

        return (
          <div
            key={a.id}
            className={`px-4 py-4 sm:px-6 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5${
              i < appointments.length - 1 ? ' border-b border-gray-100' : ''
            }`}
          >
            <Avatar src={a.lawyer.photoUrl} initials={initials} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy font-sans">{lawyerName}</p>
              <p className="text-xs text-gray-600 font-sans">
                {formatApptDate(startAt)} · {formatApptTime(startAt)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded font-sans ${typeColorClass(consultType)}`}>
                {typeLabel(consultType)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
