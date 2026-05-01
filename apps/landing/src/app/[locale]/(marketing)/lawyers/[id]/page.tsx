import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_LAWYERS } from '../../../../../lib/search/mock-lawyers';
import { LawyerProfileView } from '../../../../../components/lawyer-profile/LawyerProfileView';

interface LawyerProfilePageProps {
  readonly params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: LawyerProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const lawyer = MOCK_LAWYERS.find((l) => l.id === Number(id));

  if (!lawyer) return { title: 'Lawyer Not Found' };

  return {
    title: `${lawyer.name} — ${lawyer.specialization}`,
    description: lawyer.bio,
  };
}

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const { id } = await params;
  const lawyer = MOCK_LAWYERS.find((l) => l.id === Number(id));

  if (!lawyer) notFound();

  return <LawyerProfileView lawyer={lawyer} />;
}
