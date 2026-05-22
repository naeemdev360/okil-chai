'use client';

import { useTranslations } from 'next-intl';
import { Input, PasswordInput, Checkbox, GoogleIcon, AppleIcon } from '@repo/ui';
import { Field } from '../ui';
import type { StepProps } from '../types';

export function StepAccount({ data, update, errors }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  return (
    <div className="flex flex-col gap-5 max-w-[480px] mx-auto">
      <div className="flex flex-col gap-2.5">
        <OAuthButton icon={<GoogleIcon className="size-[18px]" />} label={t('oauthGoogle')} />
        <OAuthButton icon={<AppleIcon className="size-[18px] text-navy" />} label={t('oauthApple')} />
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="font-sans text-xs font-medium text-gray-400 tracking-wider whitespace-nowrap">
          {t('oauthDivider')}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <Field label={t('email')} error={errors?.['email']}>
        <Input
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
        />
      </Field>

      <Field label={t('password')} error={errors?.['password']}>
        <PasswordInput
          autoComplete="new-password"
          value={data.password}
          onChange={(e) => update('password', e.target.value)}
        />
      </Field>

      <Field label={t('confirmPassword')} hint={t('confirmPwHint')} error={errors?.['confirmPassword']}>
        <PasswordInput
          autoComplete="new-password"
          value={data.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
        />
      </Field>

      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms-accepted"
            variant="gold"
            size="md"
            className="mt-0.5"
            checked={data.termsAccepted}
            onCheckedChange={(v) => update('termsAccepted', v === true)}
          />
          <label
            htmlFor="terms-accepted"
            className="font-sans text-xs text-gray-600 leading-relaxed cursor-pointer"
          >
            {t('termsLabel')}{' '}
            <a href="#" className="text-navy font-medium hover:underline">{t('termsLink')}</a>
            {' '}{t('termsAnd')}{' '}
            <a href="#" className="text-navy font-medium hover:underline">{t('privacyLink')}</a>.
          </label>
        </div>
        {errors?.['termsAccepted'] && (
          <p className="font-sans text-xs text-error ml-6">{errors['termsAccepted']}</p>
        )}
      </div>
    </div>
  );
}

function OAuthButton({ icon, label }: { readonly icon: React.ReactNode; readonly label: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md border-[1.5px] border-gray-200 bg-white font-sans text-sm font-medium text-navy hover:bg-gray-50 transition-colors duration-150"
    >
      {icon}
      {label}
    </button>
  );
}
