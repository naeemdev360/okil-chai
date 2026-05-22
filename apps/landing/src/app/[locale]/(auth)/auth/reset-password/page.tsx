import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { ResetPasswordForm } from '../../../../../components/auth/ResetPasswordForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.resetPassword');
  return { title: t('heading') };
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
