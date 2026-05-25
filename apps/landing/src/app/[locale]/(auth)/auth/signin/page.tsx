import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthMarketingPanel } from '../../../../../components/auth/AuthMarketingPanel';
import { SignInForm } from '../../../../../components/auth/SignInForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.signIn');
  return { title: t('heading') };
}

interface SignInPageProps {
  readonly searchParams: Promise<{ returnUrl?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { returnUrl } = await searchParams;

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1fr]">
      <div className="hidden lg:flex lg:flex-col">
        <AuthMarketingPanel />
      </div>
      <div className="bg-white flex flex-col min-h-screen lg:min-h-0">
        <SignInForm returnUrl={returnUrl} />
      </div>
    </div>
  );
}
