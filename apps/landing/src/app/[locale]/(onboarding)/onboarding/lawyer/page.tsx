import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LawyerOnboardingWizard } from '../../../../../components/onboarding/LawyerOnboardingWizard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('onboarding.lawyer');
  return { title: t('title') };
}

export default function LawyerOnboardingPage() {
  return <LawyerOnboardingWizard />;
}
