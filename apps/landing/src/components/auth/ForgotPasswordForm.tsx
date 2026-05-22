'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isApiError } from '@repo/api-client';
import { ForgotPasswordSchema } from '@repo/shared';
import { Button, cn, Input, Label, toast } from '@repo/ui';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../../lib/api/client';

type ForgotPasswordFields = z.infer<typeof ForgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const t = useTranslations('auth.forgotPassword');
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFields>({ resolver: zodResolver(ForgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFields): Promise<void> => {
    try {
      await api.auth.forgotPassword({ email: data.email });
      toast.success(t('success'));
      setSent(true);
    } catch (error) {
      // 404 is silent to prevent email enumeration; show success regardless
      if (isApiError(error) && error.statusCode !== 404) {
        toast.error(t('genericError'));
      } else {
        setSent(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">

        {/* Back link */}
        <Link
          href={`/${locale}/auth/signin`}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-gray-600 hover:text-navy transition-colors mb-10"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('backToSignIn')}
        </Link>

        {sent ? (
          /* Success state */
          <div className="text-center">
            <CheckCircle className="size-14 text-success mx-auto mb-5" strokeWidth={1.4} />
            <h1 className="font-heading text-[28px] font-semibold text-navy mb-3">
              Check your email
            </h1>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              {t('success')}
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-[32px] font-semibold text-navy mb-2 tracking-tight">
              {t('heading')}
            </h1>
            <p className="font-sans text-[15px] text-gray-600 mb-8 leading-relaxed">
              {t('subheading')}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="forgot-email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <Input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    className={cn('pl-10', errors.email && 'border-error')}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="font-sans text-xs text-error">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full justify-center mt-2"
                isLoading={isSubmitting}
                loadingText={t('submitting')}
              >
                {t('submit')}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
