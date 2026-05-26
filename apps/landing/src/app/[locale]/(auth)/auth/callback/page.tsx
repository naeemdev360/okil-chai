'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../../../lib/api/client';
import { getPortalUrlForRoles } from '../../../../../lib/auth/portal-routes';

export default function OAuthCallbackPage() {
  const t = useTranslations('auth.callback');
  const tForgot = useTranslations('auth.forgotPassword');
  const locale = useLocale();
  const [error, setError] = useState(false);
  // Guard against StrictMode double-invocation
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    // The refresh cookie was set by the OAuth callback; restore the session, then route by role.
    api.bootstrap()
      .then((user) => {
        if (!user) {
          setError(true);
          return;
        }
        window.location.href = getPortalUrlForRoles(user.roles);
      })
      .catch(() => setError(true));
  }, []);

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
