'use client';

import { Button, cn, toast } from '@repo/ui';
import { Mail, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { api } from '../../lib/api/client';
import { useAuthStore } from '../../lib/store/auth.store';

interface EmailVerificationGateProps {
  readonly email: string;
}

export function EmailVerificationGate({ email }: EmailVerificationGateProps) {
  const t             = useTranslations('onboarding.lawyer.emailGate');
  const { initialize } = useAuthStore();

  const [isSending,    setIsSending]    = useState(false);
  const [sent,         setSent]         = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    setSent(false);
    try {
      await api.auth.resendVerification();
      setSent(true);
    } catch {
      toast.error(t('resendError'));
    } finally {
      setIsSending(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await initialize();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px] text-center">
        <div className="size-20 rounded-full bg-gold-pale flex items-center justify-center mx-auto mb-6 border-2 border-gold/30">
          <Mail className="size-9 text-gold" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="font-heading text-[30px] font-semibold text-navy mb-3 tracking-tight">
          {t('heading')}
        </h1>
        <p className="font-sans text-[15px] text-gray-600 leading-relaxed mb-8">
          {t('body', { email })}
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="gold"
            size="lg"
            className="w-full justify-center"
            onClick={() => { void handleResend(); }}
            isLoading={isSending}
            loadingText={t('sending')}
            disabled={sent}
          >
            {sent ? t('sent') : t('resend')}
          </Button>
          <button
            type="button"
            onClick={() => { void handleRefresh(); }}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-1.5 font-sans text-sm text-gray-500 hover:text-navy transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('size-3.5', isRefreshing && 'animate-spin')} aria-hidden="true" />
            {t('alreadyVerified')}
          </button>
        </div>
        <p className="font-sans text-xs text-gray-400 mt-8 leading-relaxed">
          {t('spam')}
        </p>
      </div>
    </div>
  );
}
