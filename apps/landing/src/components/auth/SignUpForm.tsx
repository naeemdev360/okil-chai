'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { User, Mail, Briefcase, ChevronLeft } from 'lucide-react';
import { Button, Input, Label, Separator, Checkbox, Badge, cn, GoogleIcon, AppleIcon, PasswordInput } from '@okil-chai/ui';

const signUpSchema = z.object({
  fullName: z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms:    z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
});

type SignUpFields = z.infer<typeof signUpSchema>;
type Role = 'client' | 'lawyer';

export function SignUpForm() {
  const t = useTranslations('auth.signUp');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') ?? 'client') as Role;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFields>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (_data: SignUpFields) => {
    // TODO: wire to auth API — lawyer role redirects to /onboarding/lawyer
  };

  return (
    <div className="flex flex-col h-full px-10 py-10 lg:px-14 lg:py-12">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href={`/${locale}/auth`}
          className="inline-flex items-center gap-1 font-sans text-sm text-gray-600 hover:text-navy transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back
        </Link>
        <p className="font-sans text-xs text-gray-600">
          {t('haveAccount')}{' '}
          <Link href={`/${locale}/auth/signin`} className="font-semibold text-navy">
            {t('signIn')}
          </Link>
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
        {/* Role badge */}
        <Badge variant="pro" className="self-start mb-4 gap-1.5">
          {role === 'lawyer'
            ? <Briefcase className="size-3" aria-hidden="true" />
            : <User className="size-3" aria-hidden="true" />
          }
          {t('signingAs')} {role === 'lawyer' ? 'Lawyer' : 'Client'}
          <Link href={`/${locale}/auth`} className="ml-1 text-[11px] underline underline-offset-2">
            {t('changeRole')}
          </Link>
        </Badge>

        <h1 className="font-heading text-[32px] font-semibold text-navy mb-2 tracking-tight">
          {t('heading')}
        </h1>
        <p className="font-sans text-[15px] text-gray-600 mb-7 leading-relaxed">
          {role === 'lawyer' ? t('subHeadingLawyer') : t('subHeadingClient')}
        </p>

        {/* OAuth */}
        <div className="flex flex-col gap-2.5 mb-5">
          <OAuthButton label={t('google')} provider="google" />
          <OAuthButton label={t('apple')} provider="apple" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3.5 mb-5">
          <Separator className="flex-1" />
          <span className="font-sans text-xs font-medium text-gray-400 tracking-wider whitespace-nowrap">
            {t('divider')}
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-name">{t('fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="signup-name"
                autoComplete="name"
                className={cn('pl-10', errors.fullName && 'border-error')}
                {...register('fullName')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-email">{t('email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                className={cn('pl-10', errors.email && 'border-error')}
                {...register('email')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-password">{t('password')}</Label>
            <PasswordInput
              id="signup-password"
              autoComplete="new-password"
              className={cn(errors.password && 'border-error')}
              {...register('password')}
            />
            {errors.password && (
              <p className="font-sans text-xs text-error">{errors.password.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5 mt-1">
            <Checkbox
              id="signup-terms"
              defaultChecked
              className="mt-0.5"
              {...register('terms')}
            />
            <label
              htmlFor="signup-terms"
              className="font-sans text-xs text-gray-600 leading-relaxed cursor-pointer"
            >
              {t('terms')}{' '}
              <Link href="#" className="text-navy font-medium hover:underline">{t('termsLink')}</Link>
              {' '}{t('and')}{' '}
              <Link href="#" className="text-navy font-medium hover:underline">{t('privacyLink')}</Link>.
            </label>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full justify-center mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? '…' : t('submit')}
          </Button>
        </form>
      </div>

      <p className="font-sans text-[11px] text-gray-400 text-center mt-8 leading-relaxed">
        Protected by reCAPTCHA · OkilChai is not a law firm.
      </p>
    </div>
  );
}

function OAuthButton({ label, provider }: { label: string; provider: 'google' | 'apple' }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md border-[1.5px] border-gray-200 bg-white font-sans text-sm font-medium text-navy hover:bg-gray-50 transition-colors duration-150"
    >
      {provider === 'google'
        ? <GoogleIcon className="size-[18px]" />
        : <AppleIcon className="size-[18px] text-navy" />
      }
      {label}
    </button>
  );
}
