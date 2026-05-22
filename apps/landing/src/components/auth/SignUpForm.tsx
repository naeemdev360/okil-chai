'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isApiError } from '@repo/api-client';
import { Role, SignUpSchema } from '@repo/shared';
import { AppleIcon, Badge, Button, Checkbox, cn, GoogleIcon, Input, Label, PasswordInput, Separator, toast } from '@repo/ui';
import { Briefcase, ChevronLeft, Mail, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../../lib/api/client';
import { brand } from '../../lib/brand';
import { useAuthStore } from '../../lib/store/auth.store';

const signUpFormSchema = SignUpSchema.extend({
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
});

type SignUpFormFields = z.infer<typeof signUpFormSchema>;
type RoleParam = 'client' | 'lawyer';

export function SignUpForm() {
  const t      = useTranslations('auth.signUp');
  const tAuth  = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') ?? 'client') as RoleParam;
  const login = useAuthStore((s) => s.login);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      role: role === 'lawyer' ? Role.LAWYER : Role.CLIENT,
    },
  });

  const onSubmit = async (data: SignUpFormFields): Promise<void> => {
    try {
      const payload = { email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName };
      const tokens = role === 'lawyer'
        ? await api.auth.signupLawyer(payload)
        : await api.auth.signup(payload);
      await login(tokens);
      toast.success(t('success'));
      router.push(role === 'lawyer' ? `/${locale}/onboarding/lawyer` : `/${locale}`);
    } catch (error) {
      const message =
        isApiError(error) && error.statusCode === 409
          ? t('emailTaken')
          : t('genericError');
      toast.error(message);
    }
  };

  const handleGoogleOAuth = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    const intentRole = role === 'lawyer' ? 'LAWYER' : 'CLIENT';
    window.location.href = `${apiUrl}/auth/google?role=${intentRole}`;
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
          {role === 'lawyer' ? t('subHeadingLawyer', { appName: brand.name }) : t('subHeadingClient')}
        </p>

        {/* OAuth */}
        <div className="flex flex-col gap-2.5 mb-5">
          <button
            type="button"
            onClick={handleGoogleOAuth}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md border-[1.5px] border-gray-200 bg-white font-sans text-sm font-medium text-navy hover:bg-gray-50 transition-colors duration-150"
          >
            <GoogleIcon className="size-[18px]" />
            {t('google')}
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md border-[1.5px] border-gray-200 bg-white font-sans text-sm font-medium text-navy hover:bg-gray-50 transition-colors duration-150"
          >
            <AppleIcon className="size-[18px] text-navy" />
            {t('apple')}
          </button>
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
          {/* First name / Last name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-first-name">{t('firstName')}</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                <Input
                  id="signup-first-name"
                  autoComplete="given-name"
                  className={cn('pl-10', errors.firstName && 'border-error')}
                  {...register('firstName')}
                />
              </div>
              {errors.firstName && (
                <p className="font-sans text-xs text-error">{errors.firstName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-last-name">{t('lastName')}</Label>
              <Input
                id="signup-last-name"
                autoComplete="family-name"
                className={cn(errors.lastName && 'border-error')}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="font-sans text-xs text-error">{errors.lastName.message}</p>
              )}
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
            {errors.email && (
              <p className="font-sans text-xs text-error">{errors.email.message}</p>
            )}
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
            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="signup-terms"
                  className="mt-0.5"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true ? true : false)}
                />
              )}
            />
            <label
              htmlFor="signup-terms"
              className="font-sans text-xs text-gray-600 leading-relaxed cursor-pointer"
            >
              {t('terms', { appName: brand.name })}{' '}
              <Link href="#" className="text-navy font-medium hover:underline">{t('termsLink')}</Link>
              {' '}{t('and')}{' '}
              <Link href="#" className="text-navy font-medium hover:underline">{t('privacyLink')}</Link>.
            </label>
          </div>
          {errors.terms && (
            <p className="font-sans text-xs text-error -mt-2">{errors.terms.message}</p>
          )}

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

      <p className="font-sans text-[11px] text-gray-400 text-center mt-8 leading-relaxed">
        {tAuth('disclaimer', { appName: brand.name })}
      </p>
    </div>
  );
}
