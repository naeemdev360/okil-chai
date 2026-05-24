import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPublicLawyerProfile } from '../../../../../lib/api/server';
import { LawyerProfileView } from '../../../../../components/lawyer-profile/LawyerProfileView';

interface LawyerProfilePageProps {
  readonly params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: LawyerProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const lawyer = await fetchPublicLawyerProfile(id);
  if (!lawyer) return { title: 'Lawyer Not Found' };

  const name = `${lawyer.firstName} ${lawyer.lastName}`;
  const spec = lawyer.specializations.find((s) => s.isPrimary)?.name ?? lawyer.specializations[0]?.name ?? 'Lawyer';

  return {
    title: `${name} — ${spec}`,
    description: lawyer.bio ?? undefined,
    openGraph: {
      title: name,
      description: lawyer.bio ?? undefined,
      images: lawyer.photoUrl ? [lawyer.photoUrl] : [],
    },
  };
}

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const { id } = await params;
  const lawyer = await fetchPublicLawyerProfile(id);
  if (!lawyer) notFound();

  return <LawyerProfileView lawyer={lawyer} />;
}
