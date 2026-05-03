import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_LAWYERS } from '../../../../../lib/search/mock-lawyers';
import { BookingView } from '../../../../../components/booking/BookingView';
import { brand } from '../../../../../lib/brand';

interface BookingPageProps {
  readonly params:       Promise<{ locale: string; id: string }>;
  readonly searchParams: Promise<{ day?: string; time?: string }>;
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { id } = await params;
  const lawyer = MOCK_LAWYERS.find((l) => l.id === Number(id));

  if (!lawyer) return { title: 'Booking Not Found' };

  return {
    title:       `Book ${lawyer.name} — ${brand.name}`,
    description: lawyer.bio,
  };
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { id }        = await params;
  const { day, time } = await searchParams;
  const lawyer        = MOCK_LAWYERS.find((l) => l.id === Number(id));

  if (!lawyer) notFound();

  return <BookingView lawyer={lawyer} initialDay={day} initialTime={time} />;
}
