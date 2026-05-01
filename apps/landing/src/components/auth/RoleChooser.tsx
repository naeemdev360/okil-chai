'use client';

import { cn } from '@okil-chai/ui';
import { ArrowRight, Briefcase, Check, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const ROLES = ['client', 'lawyer'] as const;
type Role = typeof ROLES[number];

const ROLE_ICONS: Record<Role, typeof User> = {
  client: User,
  lawyer: Briefcase,
};

export function RoleChooser() {
  const t = useTranslations('auth.roleChooser');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <div className="py-5 px-8 border-b border-gray-100 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <Link href={`/${locale}`} className="font-heading font-bold text-xl text-navy tracking-tight">
            OkilChai
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[880px]">

          {/* Heading */}
          <div className="text-center mb-12">
            <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-3 block">
              {t('tagline')}
            </span>
            <h1 className="font-heading text-[40px] font-bold text-navy mb-3">
              {t('title')}
            </h1>
            <p className="font-sans text-base text-gray-600 max-w-[520px] mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Role cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {ROLES.map((role) => {
              const Icon = ROLE_ICONS[role];
              const bullets = t.raw(`${role}.bullets`) as string[];
              return (
                <Link
                  key={role}
                  href={role === 'lawyer' ? `/${locale}/onboarding/lawyer` : `/${locale}/auth/signup?role=${role}`}
                  className={cn(
                    'group bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-9',
                    'hover:border-gold hover:-translate-y-0.5 hover:shadow-lg',
                    'transition-all duration-200',
                  )}
                >
                  {/* Icon */}
                  <div className="size-14 rounded-lg bg-gold-pale flex items-center justify-center mb-5">
                    <Icon className="size-7 text-gold" strokeWidth={1.6} aria-hidden="true" />
                  </div>

                  <h2 className="font-heading text-2xl font-semibold text-navy mb-2.5">
                    {t(`${role}.title`)}
                  </h2>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed mb-5">
                    {t(`${role}.blurb`)}
                  </p>

                  {/* Bullets */}
                  <ul className="flex flex-col gap-1.5 mb-6 list-none">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 font-sans text-xs text-gray-800">
                        <Check className="size-3.5 text-success shrink-0" strokeWidth={2.4} aria-hidden="true" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Footer CTA */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-100 font-sans text-sm font-semibold text-navy">
                    {t(`${role}.cta`)}
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-150" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="text-center font-sans text-sm text-gray-600">
            {t('alreadyHave')}{' '}
            <Link
              href={`/${locale}/auth/signin`}
              className="font-semibold text-navy underline underline-offset-4"
            >
              {t('signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
