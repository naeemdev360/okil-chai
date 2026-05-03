import { Calendar, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { PendingVerificationBanner } from '../../components/features/PendingVerificationBanner';
import { brand } from '../../lib/brand';

interface StatCardProps {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly value: string;
  readonly sub: string;
}

function StatCard({ icon: Icon, label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-sans text-sm font-medium text-gray-600">{label}</p>
        <div className="size-9 rounded-lg bg-gold-pale flex items-center justify-center">
          <Icon className="size-4 text-gold" strokeWidth={1.6} aria-hidden="true" />
        </div>
      </div>
      <p className="font-heading text-3xl font-bold text-navy mb-1">{value}</p>
      <p className="font-sans text-xs text-gray-400">{sub}</p>
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <PendingVerificationBanner />

      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 px-8 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <span className="font-heading font-bold text-xl text-navy tracking-tight">
            {brand.name}
          </span>
          <div className="size-9 rounded-full bg-navy flex items-center justify-center font-heading font-bold text-sm text-white">
            L
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-heading text-[32px] font-bold text-navy mb-1">
            Welcome to your dashboard
          </h1>
          <p className="font-sans text-[15px] text-gray-600">
            Your profile is being reviewed. In the meantime, explore what's available.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={Calendar}
            label="Upcoming Appointments"
            value="—"
            sub="Available after verification"
          />
          <StatCard
            icon={MessageSquare}
            label="Messages"
            value="—"
            sub="Available after verification"
          />
          <StatCard
            icon={Eye}
            label="Profile Views"
            value="—"
            sub="Available after verification"
          />
          <StatCard
            icon={TrendingUp}
            label="This Month's Earnings"
            value="—"
            sub="Available after verification"
          />
        </div>

        {/* Next steps */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-7">
          <h2 className="font-heading text-xl font-semibold text-navy mb-5">
            What happens next
          </h2>
          <ol className="flex flex-col gap-4 list-none">
            {[
              {
                step: '01',
                title: 'Profile review',
                body: 'Our team verifies your bar credentials against official registries. This takes 24–48 hours.',
                done: true,
              },
              {
                step: '02',
                title: 'Approval email',
                body: "You'll receive an email once your profile is approved and live for clients to find.",
                done: false,
              },
              {
                step: '03',
                title: 'Connect Stripe',
                body: 'Set up your payout account to receive payments for consultations.',
                done: false,
              },
              {
                step: '04',
                title: 'Start taking bookings',
                body: 'Your profile goes live and clients can discover and book consultations with you.',
                done: false,
              },
            ].map(({ step, title, body, done }) => (
              <li key={step} className="flex gap-4 items-start">
                <span
                  className={[
                    'shrink-0 font-sans text-xs font-bold tracking-widest px-2.5 py-1 rounded-full',
                    done ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-400',
                  ].join(' ')}
                >
                  {step}
                </span>
                <div>
                  <p className="font-sans text-sm font-semibold text-navy">{title}</p>
                  <p className="font-sans text-xs text-gray-600 mt-0.5 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
