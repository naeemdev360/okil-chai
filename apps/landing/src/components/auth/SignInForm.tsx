'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isApiError } from '@repo/api-client';
import { AppleIcon, Button, cn, GoogleIcon, Input, Label, PasswordInput, Separator, toast } from '@repo/ui';
import { ChevronLeft, Mail } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../../lib/api/client';
import { brand } from '../../lib/brand';
import { useAuthStore } from '../../lib/store/auth.store';

const signInSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

type SignInFields = z.infer<typeof signInSchema>;

export function SignInForm() {
  const t      = useTranslations('auth.signIn');
  const tAuth  = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const login  = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFields>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: SignInFields): Promise<void> => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      const tokens = await api.auth.login(data);
      await login(tokens);
      toast.success(t('success'));
      router.push(`/${locale}`);
    } catch (error) {
      const message = isApiError(error) && error.statusCode === 401
        ? t('invalidCredentials')
        : t('genericError');
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col h-full px-10 py-10 lg:px-14 lg:py-12">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href={`/${locale}`}
          className="font-sans text-sm text-gray-600 flex items-center gap-1.5 hover:text-navy transition-colors"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Back
        </Link>
        <p className="font-sans text-xs text-gray-600">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/auth/signup`} className="font-semibold text-navy">
            {t('signUp')}
          </Link>
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
        <h1 className="font-heading text-[32px] font-semibold text-navy mb-2 tracking-tight">
          {t('heading')}
        </h1>
        <p className="font-sans text-[15px] text-gray-600 mb-7 leading-relaxed">
          {t('subheading')}
        </p>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-2.5 mb-5">
          <OAuthButton
            label={t('google')}
            provider="google"
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/auth/google`;
            }}
          />
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
            <Label htmlFor="signin-email">{t('email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                className={cn('pl-10', errors.email && 'border-error focus-visible:ring-error')}
                {...register('email')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="signin-password">{t('password')}</Label>
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="font-sans text-xs font-medium text-navy hover:underline"
              >
                {t('forgotPassword')}
              </Link>
            </div>
            <PasswordInput
              id="signin-password"
              autoComplete="current-password"
              className={cn(errors.password && 'border-error focus-visible:ring-error')}
              {...register('password')}
            />
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

          {/* <button
            type="button"
            className="font-sans text-xs text-gray-600 hover:text-navy transition-colors mx-auto"
          >
            ✨ {t('magicLink')}
          </button> */}
        </form>
      </div>

      <p className="font-sans text-[11px] text-gray-400 text-center mt-8 leading-relaxed">
        {tAuth('disclaimer', { appName: brand.name })}
      </p>
    </div>
  );
}

function OAuthButton({
  label,
  provider,
  onClick,
}: {
  label: string;
  provider: 'google' | 'apple';
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
