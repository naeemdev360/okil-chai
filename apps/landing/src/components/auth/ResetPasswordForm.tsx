'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isApiError } from '@repo/api-client';
import { ResetPasswordSchema } from '@repo/shared';
import { Button, cn, Input, Label, toast } from '@repo/ui';
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, XCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../../lib/api/client';

const ResetPasswordFormSchema = ResetPasswordSchema.extend({
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFields = z.infer<typeof ResetPasswordFormSchema>;

type PageStatus = 'form' | 'success' | 'invalid-token';

export function ResetPasswordForm() {
  const t           = useTranslations('auth.resetPassword');
  const locale      = useLocale();
  const searchParams = useSearchParams();
  const token       = searchParams.get('token') ?? '';

  const [status, setStatus]               = useState<PageStatus>(token ? 'form' : 'invalid-token');
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetPasswordFields): Promise<void> => {
    try {
      await api.auth.resetPassword({ token: data.token, newPassword: data.newPassword });
      setStatus('success');
    } catch (error) {
      if (isApiError(error) && (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 404)) {
        setStatus('invalid-token');
      } else {
        toast.error(t('genericError'));
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[440px] text-center">
          <CheckCircle className="size-16 text-success mx-auto mb-5" strokeWidth={1.4} aria-hidden="true" />
          <h1 className="font-heading text-[28px] font-semibold text-navy mb-3">
            {t('successHeading')}
          </h1>
          <p className="font-sans text-sm text-gray-600 leading-relaxed mb-8">
            {t('successBody')}
          </p>
          <Button asChild variant="gold" size="lg" className="w-full justify-center">
            <Link href={`/${locale}/auth/signin`}>{t('signIn')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'invalid-token') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[440px] text-center">
          <XCircle className="size-16 text-error mx-auto mb-5" strokeWidth={1.4} aria-hidden="true" />
          <h1 className="font-heading text-[28px] font-semibold text-navy mb-3">
            {t('invalidTokenHeading')}
          </h1>
          <p className="font-sans text-sm text-gray-600 leading-relaxed mb-8">
            {t('invalidTokenBody')}
          </p>
          <Button asChild variant="gold" size="lg" className="w-full justify-center">
            <Link href={`/${locale}/auth/forgot-password`}>{t('requestNew')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">

        <Link
          href={`/${locale}/auth/signin`}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-gray-600 hover:text-navy transition-colors mb-10"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('backToSignIn')}
        </Link>

        <h1 className="font-heading text-[32px] font-semibold text-navy mb-2 tracking-tight">
          {t('heading')}
        </h1>
        <p className="font-sans text-[15px] text-gray-600 mb-8 leading-relaxed">
          {t('subheading')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <input type="hidden" {...register('token')} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">{t('newPassword')}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                autoComplete="new-password"
                className={cn('pl-10 pr-10', errors.newPassword && 'border-error')}
                {...register('newPassword')}
              />
              <button
                type="button"
                aria-label={showNew ? t('hidePassword') : t('showPassword')}
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="font-sans text-xs text-error">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                className={cn('pl-10 pr-10', errors.confirmPassword && 'border-error')}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                aria-label={showConfirm ? t('hidePassword') : t('showPassword')}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="font-sans text-xs text-error">{errors.confirmPassword.message}</p>
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
      </div>
    </div>
  );
}
