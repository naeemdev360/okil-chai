'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, MapPin, Star, Lock, Video, Phone, Building2, Check } from 'lucide-react';
import { cn, Badge, Button } from '@okil-chai/ui';
import { LawyerAvatar } from '../shared/LawyerAvatar';
import type { Lawyer } from '../../lib/search/mock-lawyers';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'about' | 'reviews' | 'availability' | 'location';

// ─── Static fixtures ──────────────────────────────────────────────────────────

const MOCK_REVIEWS = [
  {
    author: 'Rachel M.', initials: 'RM', stars: 5, date: 'March 2026',
    title: 'Helped me see my options clearly',
    body: 'Incredibly clear and patient. Walked me through my options without legalese and I left with a real plan.',
    tags: ['Knowledgeable', 'Clear communicator', 'Patient'],
    reply: 'Thank you Rachel — best of luck with the case!',
  },
  {
    author: 'David K.', initials: 'DK', stars: 5, date: 'February 2026',
    title: 'Top professional',
    body: 'Clear communication, prompt responses, and excellent results. Worth every penny.',
    tags: ['Professional', 'Got results'],
    reply: null,
  },
  {
    author: 'Yvonne T.', initials: 'YT', stars: 4, date: 'January 2026',
    title: 'Very thorough',
    body: 'Very knowledgeable lawyer. Took time to explain everything in plain language.',
    tags: ['Knowledgeable', 'Patient'],
    reply: null,
  },
] as const;

const RATING_DIST = [
  { stars: 5, pct: 83, count: 118 },
  { stars: 4, pct: 13, count: 18  },
  { stars: 3, pct: 3,  count: 4   },
  { stars: 2, pct: 1,  count: 1   },
  { stars: 1, pct: 1,  count: 1   },
] as const;

const WEEK_DAYS = [
  { label: 'Mon', date: 'Apr 28', available: true  },
  { label: 'Tue', date: 'Apr 29', available: true  },
  { label: 'Wed', date: 'Apr 30', available: false },
  { label: 'Thu', date: 'May 1',  available: true  },
  { label: 'Fri', date: 'May 2',  available: true  },
  { label: 'Sat', date: 'May 3',  available: false },
] as const;

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '10:30 AM', '2:00 PM', '3:00 PM', '3:30 PM', '4:00 PM'] as const;

const CREDENTIALS = [
  'J.D., Harvard Law School, 2010',
  'Bar Admitted — New York, California',
  'Member, American Bar Association',
  '15+ Years Courtroom Experience',
] as const;

// ─── Small reusable primitives ────────────────────────────────────────────────

function StarRow({ rating, count }: { rating: number; count: number | null }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'size-3.5',
            i <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200',
          )}
          aria-hidden
        />
      ))}
      {count !== null && (
        <span className="font-sans text-sm text-white/70 ml-1">({count})</span>
      )}
    </span>
  );
}

function StarRowDark({ rating, count }: { rating: number; count: number | null }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'size-3.5',
            i <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200',
          )}
          aria-hidden
        />
      ))}
      {count !== null && (
        <span className="font-sans text-sm text-gray-400 ml-1">({count})</span>
      )}
    </span>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'font-sans text-sm font-medium px-5 py-3.5 border-b-2 transition-colors duration-150 whitespace-nowrap',
        active
          ? 'text-gold border-gold'
          : 'text-white/60 border-transparent hover:text-white/80',
      )}
    >
      {label}
    </button>
  );
}

// ─── Tab content sections ─────────────────────────────────────────────────────

function AboutTab({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(15,31,61,0.06)] p-6">
        <h3 className="font-heading text-xl font-semibold text-navy mb-3">About</h3>
        <p className="font-sans text-[15px] text-gray-800 leading-[1.7]">
          {lawyer.bio} With a strong track record in litigation and client advocacy,{' '}
          {lawyer.name.split(' ')[0]} brings both expertise and empathy to every case.
          Licensed in multiple jurisdictions, with over a decade of courtroom and settlement experience.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(15,31,61,0.06)] p-6">
        <h3 className="font-heading text-xl font-semibold text-navy mb-4">Credentials</h3>
        <ul className="flex flex-col gap-2.5 list-none p-0">
          {CREDENTIALS.map((c) => (
            <li key={c} className="flex items-center gap-2.5 font-sans text-sm text-gray-800">
              <Check className="size-4 text-gold shrink-0" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReviewCard({ review, lawyerName, lawyerInitials }: {
  review: typeof MOCK_REVIEWS[number];
  lawyerName: string;
  lawyerInitials: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(15,31,61,0.06)] p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-navy-mid flex items-center justify-center shrink-0">
            <span className="font-heading text-sm font-semibold text-white">{review.initials}</span>
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-navy">{review.author}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRowDark rating={review.stars} count={null} />
              <span className="font-sans text-xs text-gray-400">· {review.date}</span>
            </div>
          </div>
        </div>
        <Badge variant="available" className="shrink-0">✓ Verified</Badge>
      </div>
      <h4 className="font-heading text-[15px] font-semibold text-navy mb-1.5">{review.title}</h4>
      <p className="font-sans text-sm text-gray-800 leading-relaxed mb-3">{review.body}</p>
      <div className="flex flex-wrap gap-1.5">
        {review.tags.map((tag) => (
          <span key={tag} className="font-sans text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
            {tag}
          </span>
        ))}
      </div>
      {review.reply && (
        <div className="mt-4 pl-4 border-l-[3px] border-gold bg-cream rounded-sm p-3">
          <p className="font-sans text-xs font-semibold text-navy mb-1">{lawyerName} replied</p>
          <p className="font-sans text-sm text-gray-800 leading-relaxed">{review.reply}</p>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(15,31,61,0.06)] p-6 grid grid-cols-[180px_1fr] gap-8">
        <div className="border-r border-gray-100 pr-6">
          <p className="font-heading text-6xl font-bold text-navy leading-none">{lawyer.rating}</p>
          <StarRowDark rating={lawyer.rating} count={null} />
          <p className="font-sans text-sm text-gray-600 mt-2">Based on {lawyer.reviewCount} reviews</p>
        </div>
        <div className="flex flex-col gap-1.5 justify-center">
          {RATING_DIST.map(({ stars, pct, count }) => (
            <div key={stars} className="flex items-center gap-2.5">
              <span className="font-sans text-xs text-gray-600 w-3 text-right">{stars}</span>
              <Star className="size-3 fill-gold text-gold shrink-0" aria-hidden />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-sans text-xs text-gray-400 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {MOCK_REVIEWS.map((review, i) => (
        <ReviewCard
          key={i}
          review={review}
          lawyerName={lawyer.name}
          lawyerInitials={lawyer.initials}
        />
      ))}
    </div>
  );
}

function AvailabilityTab({ lawyer }: { lawyer: Lawyer }) {
  const locale = useLocale();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(15,31,61,0.06)] p-6">
      <h3 className="font-heading text-xl font-semibold text-navy mb-5">Available Slots — This Week</h3>

      <p className="font-sans text-xs font-semibold tracking-[0.06em] uppercase text-gray-600 mb-3">April / May 2026</p>
      <div className="grid grid-cols-6 gap-2 mb-6">
        {WEEK_DAYS.map((day) => (
          <button
            key={day.date}
            disabled={!day.available}
            onClick={() => { setSelectedDay(day.date); setSelectedTime(null); }}
            className={cn(
              'flex flex-col items-center py-2.5 rounded-lg border text-sm transition-all duration-150',
              !day.available && 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200',
              day.available && selectedDay === day.date && 'bg-navy text-white border-navy',
              day.available && selectedDay !== day.date && 'bg-white text-navy border-gray-200 hover:border-navy',
            )}
          >
            <span className="text-[10px] opacity-70 mb-0.5">{day.label}</span>
            <span className="font-semibold text-xs">{day.date}</span>
          </button>
        ))}
      </div>

      {selectedDay && (
        <>
          <p className="font-sans text-xs font-semibold tracking-[0.06em] uppercase text-gray-600 mb-3">Available Times</p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  'py-2.5 rounded-lg border text-sm font-sans transition-all duration-150',
                  selectedTime === time
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-navy border-gray-200 hover:border-navy',
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}

      <Button
        variant="gold"
        size="lg"
        disabled={!selectedDay || !selectedTime}
        className="w-full justify-center disabled:opacity-40"
        asChild={Boolean(selectedDay && selectedTime)}
      >
        {selectedDay && selectedTime ? (
          <Link href={`/${locale}/book/${lawyer.id}?day=${selectedDay}&time=${encodeURIComponent(selectedTime)}`}>
            Continue to Booking
          </Link>
        ) : (
          <span>Select a day and time to continue</span>
        )}
      </Button>
    </div>
  );
}

function LocationTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(15,31,61,0.06)] overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="font-heading text-xl font-semibold text-navy mb-2">Office Location</h3>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="size-4 text-gold mt-0.5 shrink-0" aria-hidden />
          <div>
            <p>247 Gulshan Avenue, Dhaka 1212, Bangladesh</p>
            <p className="text-gray-400 text-xs mt-0.5">Floor 8, Suite 802 · Open 9am–6pm</p>
          </div>
        </div>
      </div>
      <div className="relative h-80">
        <iframe
          title="Office Location Map"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          src="https://www.openstreetmap.org/export/embed.html?bbox=90.4050%2C23.7850%2C90.4250%2C23.8000&layer=mapnik&marker=23.7925%2C90.4150"
          loading="lazy"
        />
        <div className="absolute bottom-4 right-4">
          <a
            href="https://www.openstreetmap.org/?mlat=23.7925&mlon=90.4150#map=16/23.7925/90.4150"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-navy text-white font-sans text-xs font-medium px-3.5 py-2 rounded-lg shadow-[0_4px_16px_rgba(15,31,61,0.08)] hover:bg-navy-light transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Booking sidebar ──────────────────────────────────────────────────────────

function BookingSidebar({ lawyer }: { lawyer: Lawyer }) {
  const locale = useLocale();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(15,31,61,0.08)] p-6 sticky top-[88px]">
      <p className="font-heading text-lg font-semibold text-navy mb-1">Book a Consultation</p>
      <p className="font-sans text-sm text-gray-600 mb-5">No commitment. Cancel free up to 24 hours before.</p>

      <div className="flex flex-col gap-2.5 mb-5">
        {[
          { icon: Video,  label: 'Video Call',  price: lawyer.pricePerHour },
          { icon: Phone,  label: 'Phone Call',  price: lawyer.pricePerHour - 20 },
        ].map(({ icon: Icon, label, price }) => (
          <div key={label} className="flex items-center justify-between px-3.5 py-3 border border-gray-200 rounded-lg">
            <span className="flex items-center gap-2 font-sans text-sm text-gray-800">
              <Icon className="size-4 text-gray-400" aria-hidden />
              {label}
            </span>
            <span className="font-sans text-sm font-medium text-navy">from ${price}/hr</span>
          </div>
        ))}
      </div>

      <Button variant="gold" size="lg" className="w-full justify-center" asChild>
        <Link href={`/${locale}/book/${lawyer.id}`}>Book Now</Link>
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        <Lock className="size-3.5 text-gray-400" aria-hidden />
        <span className="font-sans text-xs text-gray-400">Secure payment. Encrypted & private.</span>
      </div>
    </div>
  );
}

// ─── Profile hero band ────────────────────────────────────────────────────────

interface ProfileHeroProps {
  readonly lawyer: Lawyer;
  readonly activeTab: Tab;
  readonly onTabChange: (tab: Tab) => void;
  readonly tabLabels: Record<Tab, string>;
}

const TAB_ORDER: Tab[] = ['about', 'reviews', 'availability', 'location'];

function ProfileHero({ lawyer, activeTab, onTabChange, tabLabels }: ProfileHeroProps) {
  const locale = useLocale();

  return (
    <div className="bg-navy px-6 pt-6 pb-0">
      <div className="max-w-[1200px] mx-auto">
        <Link
          href={`/${locale}/search`}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-white/60 hover:text-white mb-6 transition-colors duration-150"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Results
        </Link>

        <div className="flex gap-7 items-end flex-wrap md:flex-nowrap">
          <LawyerAvatar initials={lawyer.initials} verified={lawyer.verified} size="lg" />

          <div className="flex-1 pb-5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="font-heading text-3xl font-bold text-white">{lawyer.name}</h1>
              {lawyer.badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
              {lawyer.badge === 'pro'      && <Badge variant="pro">Pro Member</Badge>}
            </div>
            <p className="font-sans text-xs tracking-[0.08em] uppercase text-gold font-medium mb-3">
              {lawyer.specialization}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <StarRow rating={lawyer.rating} count={lawyer.reviewCount} />
              <span className="flex items-center gap-1 font-sans text-sm text-white/60">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {lawyer.city}
              </span>
              <span className="font-sans text-sm text-white/60">
                From ${lawyer.pricePerHour}/hr
              </span>
            </div>
          </div>

          <div className="pb-5 shrink-0">
            <Button variant="gold" size="lg" asChild>
              <Link href={`/${locale}/book/${lawyer.id}`}>Book Consultation</Link>
            </Button>
          </div>
        </div>

        <div className="flex gap-0 border-t border-white/12 mt-2 overflow-x-auto">
          {TAB_ORDER.map((key) => (
            <TabButton
              key={key}
              label={tabLabels[key]}
              active={activeTab === key}
              onClick={() => onTabChange(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface LawyerProfileViewProps {
  readonly lawyer: Lawyer;
}

export function LawyerProfileView({ lawyer }: LawyerProfileViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const t = useTranslations('lawyerProfile');

  const tabLabels: Record<Tab, string> = {
    about:        t('tabs.about'),
    reviews:      t('tabs.reviews'),
    availability: t('tabs.availability'),
    location:     t('tabs.location'),
  };

  return (
    <div className="bg-cream min-h-screen">
      <ProfileHero
        lawyer={lawyer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabLabels={tabLabels}
      />

      <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          {activeTab === 'about'        && <AboutTab lawyer={lawyer} />}
          {activeTab === 'reviews'      && <ReviewsTab lawyer={lawyer} />}
          {activeTab === 'availability' && <AvailabilityTab lawyer={lawyer} />}
          {activeTab === 'location'     && <LocationTab />}
        </div>
        <aside>
          <BookingSidebar lawyer={lawyer} />
        </aside>
      </div>
    </div>
  );
}
