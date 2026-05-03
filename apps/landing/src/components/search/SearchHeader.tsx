'use client';

import { ArrowLeft } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LegalSearchBar } from '../ui/LegalSearchBar';

const AREA_KEYS = [
  'criminal', 'family', 'corporate', 'immigration',
  'realestate', 'employment', 'ip', 'tax',
] as const;

export function SearchHeader() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const locale       = useLocale();
  const t            = useTranslations('search');
  const heroT        = useTranslations('home.hero');

  const handleSearch = (term: string) => {
    const params = new URLSearchParams();
    if (term) params.set('q', term);
    router.push(`/${locale}/search${params.size > 0 ? `?${params.toString()}` : ''}`);
  };

  const practiceAreaPills = AREA_KEYS.map((key) => ({
    label: heroT(`practiceAreas.${key}`),
    value: heroT(`practiceAreas.${key}`),
  }));

  return (
    <section className="bg-gradient-to-b from-navy to-navy-mid px-6 pt-7 sm:pt-9 pb-12">
      <div className="max-w-[1200px] mx-auto">

        {/* Back link */}
        <Link
          href={`/${locale}/`}
          className="inline-flex items-center gap-1.5 font-sans text-[13px] text-white/45 hover:text-white/80 transition-colors duration-150 mb-7 sm:mb-9"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {t('backHome')}
        </Link>

        {/* Heading */}
        <div className="mb-7 sm:mb-8">
          <span className="font-sans text-[11px] font-semibold tracking-[0.13em] uppercase text-gold mb-3 block">
            {t('sectionLabel')}
          </span>
          <h1 className="font-heading text-[2rem] sm:text-[2.625rem] font-bold text-white leading-[1.08] tracking-tight">
            {t('heading')}{' '}
            <em className="text-gold not-italic">{t('headingHighlight')}</em>
          </h1>
        </div>

        {/* Search bar + pills — identical to hero */}
        <LegalSearchBar
          placeholder={heroT('searchPlaceholder')}
          buttonLabel={t('searchButton')}
          initialQuery={searchParams.get('q') ?? ''}
          practiceAreaPills={practiceAreaPills}
          pillsScrollable
          onSearch={handleSearch}
          className="max-w-[780px]"
        />

      </div>
    </section>
  );
}
