import { Avatar, Badge, Button, Reveal, RevealGroup } from '@repo/ui';
import { MapPin, Phone, Plus, Video } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  APPOINTMENTS,
  type Appointment,
  type ConsultationType,
} from '../../lib/mock-data';

function TypeIcon({ type }: { readonly type: ConsultationType }) {
  if (type === 'video')     return <Video  size={11} />;
  if (type === 'phone')     return <Phone  size={11} />;
  return <MapPin size={11} />;
}

function typeLabel(type: ConsultationType): string {
  if (type === 'video') return 'Video';
  if (type === 'phone') return 'Phone';
  return 'In-Person';
}

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming', count: 3 },
  { key: 'past',     label: 'Past',     count: 2 },
  { key: 'all',      label: 'All',      count: 5 },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

export function AppointmentsPage() {
  const [filter, setFilter] = useState<FilterKey>('upcoming');
  const navigate = useNavigate();

  const filtered: readonly Appointment[] =
    filter === 'all' ? APPOINTMENTS : APPOINTMENTS.filter((a) => a.status === filter);

  return (
    <RevealGroup>
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
          <h1 className="font-heading text-[22px] font-semibold text-navy sm:text-[26px]">My Appointments</h1>
          <Button variant="gold" onClick={() => navigate('/search')} className="w-full shrink-0 sm:w-auto">
            <Plus size={14} /> Book New
          </Button>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-[13px] font-sans transition-all border-[1.5px] ${
                filter === f.key
                  ? 'bg-navy text-white border-navy font-semibold'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </Reveal>

      {/* Cards */}
      <Reveal>
        <div className="flex flex-col gap-3.5">
          {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <Avatar initials={a.initials} size="xl" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <span className="font-heading text-[17px] font-semibold text-navy">{a.lawyer}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 px-2 py-0.5 bg-gray-50 rounded font-sans">
                  <TypeIcon type={a.type} /> {typeLabel(a.type)}
                </span>
                {a.when && <Badge variant="available">{a.when}</Badge>}
              </div>
              <p className="text-[13px] text-gray-600 font-sans">
                {a.spec} · {a.date}
              </p>
            </div>

            <div className="w-full text-left sm:text-right sm:w-auto shrink-0">
              <p className="font-heading text-base font-semibold text-navy mb-2">${a.fee}</p>
              {a.status === 'upcoming' ? (
                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                  <Button variant="ghost" size="sm" className="border border-gray-200 text-gray-600">
                    Reschedule
                  </Button>
                  <Button variant="primary" size="sm">Join</Button>
                </div>
              ) : (
                <Button
                  variant={a.hasReview ? 'ghost' : 'gold'}
                  size="sm"
                  className={a.hasReview ? 'border border-gray-200 text-gray-600' : ''}
                >
                  {a.hasReview ? 'View Review' : 'Leave Review'}
                </Button>
              )}
            </div>
          </div>
          ))}
        </div>
      </Reveal>
    </RevealGroup>
  );
}
