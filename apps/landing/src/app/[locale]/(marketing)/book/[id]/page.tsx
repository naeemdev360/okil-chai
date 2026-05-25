import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPublicLawyerProfile, fetchLawyerAvailability } from '../../../../../lib/api/server';
import { BookingView } from '../../../../../components/booking/BookingView';
import { fromPublicProfile } from '../../../../../components/booking/utils';
import { brand } from '../../../../../lib/brand';

interface BookingPageProps {
  readonly params:       Promise<{ locale: string; id: string }>;
  readonly searchParams: Promise<{ day?: string }>;
}

const AVAILABILITY_WINDOW_DAYS = 30;

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await fetchPublicLawyerProfile(id);

  if (!profile) return { title: 'Booking Not Found' };

  const lawyer = fromPublicProfile(profile);
  return {
    title:       `Book ${lawyer.fullName} — ${brand.name}`,
    description: lawyer.bio ?? undefined,
  };
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { id }  = await params;
  const { day } = await searchParams;

  const profile = await fetchPublicLawyerProfile(id);
  if (!profile) notFound();

  const today = new Date();
  const from  = today.toISOString().slice(0, 10);
  const to    = new Date(today.getTime() + AVAILABILITY_WINDOW_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [availabilitySlots] = await Promise.all([
    fetchLawyerAvailability(id, from, to),
  ]);

  const lawyer = fromPublicProfile(profile);

  return (
    <BookingView
      lawyer={lawyer}
      availabilitySlots={availabilitySlots}
      initialDay={day}
    />
  );
}
