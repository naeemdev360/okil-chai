import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { AuthMarketingPanel } from '../../../../../components/auth/AuthMarketingPanel';
import { SignUpForm } from '../../../../../components/auth/SignUpForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.signUp');
  return { title: t('heading') };
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1fr]">
      <div className="hidden lg:flex lg:flex-col">
        <AuthMarketingPanel />
      </div>
      <div className="bg-white flex flex-col min-h-screen lg:min-h-0">
        {/* Suspense required because SignUpForm reads useSearchParams */}
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
