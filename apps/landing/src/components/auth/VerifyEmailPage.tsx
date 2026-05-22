'use client';

import { Role } from '@repo/shared';
import { Button } from '@repo/ui';
import { CheckCircle, XCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api/client';
import { getRefreshToken } from '../../lib/auth/auth-storage';
import { useAuthStore } from '../../lib/store/auth.store';

type VerifyStatus = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const t              = useTranslations('auth.verifyEmail');
  const locale         = useLocale();
  const router         = useRouter();
  const searchParams   = useSearchParams();
  const login          = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user           = useAuthStore((s) => s.user);
  const [status, setStatus] = useState<VerifyStatus>('loading');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    api.auth.verifyEmail(token)
      .then(async () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            const freshTokens = await api.auth.refresh({ refreshToken });
            await login(freshTokens);
          } catch {
            // refresh failed — user will get updated isVerified on next sign-in
          }
        }
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [searchParams, login]);

  useEffect(() => {
    if (status === 'success' && isAuthenticated) {
      const destination = user?.roles.includes(Role.LAWYER)
        ? `/${locale}/onboarding/lawyer`
        : `/${locale}`;
      router.replace(destination);
    }
  }, [status, isAuthenticated, user, router, locale]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px] text-center">

        {status === 'loading' && (
          <p className="font-sans text-sm text-gray-500 animate-pulse">{t('loading')}</p>
        )}

        {status === 'success' && !isAuthenticated && (
          <>
            <CheckCircle
              className="size-16 text-success mx-auto mb-5"
              strokeWidth={1.4}
              aria-hidden="true"
            />
            <h1 className="font-heading text-[28px] font-semibold text-navy mb-3">
              {t('successHeading')}
            </h1>
            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-8">
              {t('successBody')}
            </p>
            <Button asChild variant="gold" size="lg" className="w-full justify-center">
              <Link href={`/${locale}/auth/signin`}>{t('signIn')}</Link>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle
              className="size-16 text-error mx-auto mb-5"
              strokeWidth={1.4}
              aria-hidden="true"
            />
            <h1 className="font-heading text-[28px] font-semibold text-navy mb-3">
              {t('errorHeading')}
            </h1>
            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-8">
              {t('errorBody')}
            </p>
            <Link
              href={`/${locale}/auth/signin`}
              className="font-sans text-sm font-medium text-navy hover:underline underline-offset-2"
            >
              {t('backToSignIn')}
            </Link>
          </>
        )}

      </div>
    </div>
  );
}
