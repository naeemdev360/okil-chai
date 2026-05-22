import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { VerifyEmailPage } from '../../../../../components/auth/VerifyEmailPage';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.verifyEmail');
  return { title: t('successHeading') };
}

export default function VerifyEmailRoute() {
  return <VerifyEmailPage />;
}
