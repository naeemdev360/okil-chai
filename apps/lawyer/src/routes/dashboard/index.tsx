import { Badge, StarRating } from '@repo/ui';
import { Sparkles } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { useNavigate } from 'react-router-dom';
import { PendingRequestRow } from '../../components/features/bookings/PendingRequestRow';
import { EmptyState } from '../../components/ui/EmptyState';
import { SectionCard } from '../../components/ui/SectionCard';
import type { MockData } from '../../types/lawyer.types';
import { DashboardStatTile } from './DashboardStatTile';
import { EarningsHeroCard } from './EarningsHeroCard';
import { TodayBookingRow } from './TodayBookingRow';

const STATS = [
  { label: "Today's Bookings",  value: '4',  sub: '2 confirmed · 1 pending', accentClass: 'border-l-gold' },
  { label: 'This Week',         value: '12', sub: '+3 vs last week',          accentClass: 'border-l-success' },
  { label: 'Pending Requests',  value: '3',  sub: 'Awaiting your response',   accentClass: 'border-l-warning' },
  { label: 'Unread Messages',   value: '7',  sub: 'From 4 clients',           accentClass: 'border-l-navy' },
] as const;

interface DashboardPageProps {
  readonly data: MockData;
}

export function DashboardPage({ data }: DashboardPageProps) {
  const navigate = useNavigate();

  const todayBookings = data.bookings.filter(b => b.day === 'today').slice(0, 4);
  const pendingRequests = data.bookings.filter(b => b.status === 'pending').slice(0, 3);

  return (
    <RevealGroup className="flex flex-col gap-6">
      {/* Hero: earnings + profile completeness */}
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
          <EarningsHeroCard earnings={data.earnings} />
          <div className="flex flex-col gap-3">
            <ProfileCompletenessCard onComplete={() => navigate('/profile')} />
            <TopPerformerCard />
          </div>
        </div>
      </Reveal>

      {/* Stats row */}
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(s => <DashboardStatTile key={s.label} {...s} />)}
        </div>
      </Reveal>

      {/* Today's schedule + Pending requests */}
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
          <SectionCard
            title="Today's schedule"
            action={{ label: 'Open calendar →', onClick: () => navigate('/availability') }}
          >
            {todayBookings.length === 0 ? (
              <EmptyState message="No bookings today." />
            ) : (
              todayBookings.map((b, i) => (
                <TodayBookingRow key={b.id} booking={b} divider={i > 0} />
              ))
            )}
          </SectionCard>

          <SectionCard
            title={
              <span className="flex items-center gap-2">
                Pending requests
                <Badge variant="pending">{pendingRequests.length} new</Badge>
              </span>
            }
            action={{ label: 'All requests →', onClick: () => navigate('/bookings') }}
          >
            {pendingRequests.length === 0 ? (
              <EmptyState message="You're all caught up." />
            ) : (
              pendingRequests.map((b, i) => (
                <PendingRequestRow
                  key={b.id}
                  booking={b}
                  divider={i > 0}
                  onAccept={() => data.act(b.id, 'confirmed')}
                  onDecline={() => data.act(b.id, 'declined')}
                />
              ))
            )}
          </SectionCard>
        </div>
      </Reveal>

      {/* Recent reviews */}
      <Reveal>
        <SectionCard
          title="Recent reviews"
          action={{ label: 'See all →', onClick: () => navigate('/reviews') }}
        >
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.reviews.slice(0, 3).map((r, i) => (
              <div key={i} className="bg-cream rounded-lg p-4 border-t-[3px] border-t-gold">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-[13px] font-semibold text-navy">{r.name}</span>
                  <StarRating rating={r.rating} size="xs" />
                </div>
                <p className="font-sans text-[13px] text-gray-800 leading-[1.55]">"{r.text}"</p>
                <div className="text-[11px] text-gray-400 mt-2 font-sans">{r.date} · {r.area}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </Reveal>
    </RevealGroup>
  );
}

/* ── Page-local sub-components ──────────────────────────── */

function ProfileCompletenessCard({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 font-sans mb-2">
        Profile completeness
      </div>
      <div className="flex items-baseline gap-2 mb-2.5">
        <span className="font-heading text-[28px] font-bold text-navy">92%</span>
        <span className="text-[12px] text-gray-600 font-sans">· 1 task left</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div className="w-[92%] h-full bg-gold" />
      </div>
      <button
        onClick={onComplete}
        className="w-full py-2 rounded-md border border-gray-200 bg-white font-sans text-[12px] text-navy font-medium hover:bg-gray-50 transition-colors"
      >
        Add CV to finish →
      </button>
    </div>
  );
}

function TopPerformerCard() {
  return (
    <div className="bg-gold-pale rounded-xl p-4 border border-gold/30">
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles size={14} className="text-gold" />
        <span className="font-sans text-[12px] font-semibold text-navy tracking-[0.04em] uppercase">
          Top 5%
        </span>
      </div>
      <p className="font-heading text-[15px] font-semibold text-navy leading-snug">
        You respond in under an hour — clients book 2.4&times; more often.
      </p>
    </div>
  );
}
