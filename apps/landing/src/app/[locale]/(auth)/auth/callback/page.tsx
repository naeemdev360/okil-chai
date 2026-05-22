'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../../../../lib/store/auth.store';

export default function OAuthCallbackPage() {
  const t = useTranslations('auth.callback');
  const tForgot = useTranslations('auth.forgotPassword');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState(false);
  // Guard against StrictMode double-invocation
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const accessToken = searchParams.get('at');
    const refreshToken = searchParams.get('rt');

    if (!accessToken || !refreshToken) {
      setError(true);
      return;
    }

    login({ accessToken, refreshToken })
      .then(() => {
        router.replace(`/${locale}`);
      })
      .catch(() => {
        setError(true);
      });
  }, [searchParams, login, router, locale]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-sans text-sm text-red-600">{t('error')}</p>
        <a
          href={`/${locale}/auth/signin`}
          className="font-sans text-sm font-medium text-navy underline underline-offset-2"
        >
          {tForgot('backToSignIn')}
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="font-sans text-sm text-gray-500 animate-pulse">{t('loading')}</p>
    </div>
  );
}
