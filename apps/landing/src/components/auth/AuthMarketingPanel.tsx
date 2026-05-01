import { Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Logo } from '../layout/Logo';

const STAT_KEYS = ['lawyers', 'rating', 'bookings'] as const;

export async function AuthMarketingPanel() {
  const t = await getTranslations('auth.panel');

  return (
    <div className="relative h-full min-h-screen bg-navy text-white flex flex-col justify-between overflow-hidden px-14 py-12">

      {/* Background decoration: concentric rings */}
      <div className="absolute -top-20 -right-20 size-[500px] rounded-full border border-white/[0.04] pointer-events-none" />
      <div className="absolute -top-20 -right-20 size-[360px] rounded-full border border-white/[0.06] pointer-events-none" />
      <div className="absolute -top-20 -right-20 size-[220px] rounded-full border border-white/[0.05] pointer-events-none" />

      {/* Gold glow orbs */}
      <div className="absolute top-1/3 -right-28 size-[340px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-16 size-[280px] rounded-full bg-gold/8 blur-2xl pointer-events-none" />

      {/* Vertical accent line */}
      <div className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/">
        <Logo variant="light" size="md" />
        </Link>
      </div>

      {/* Headline block */}
      <div className="relative z-10 max-w-[460px]">
        <p className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-gold/90 mb-5">
          {t('tagline')}
        </p>
        <h2 className="font-heading text-[40px] font-semibold leading-[1.12] tracking-tight mb-6">
          {t('headline1')}{' '}
          <em className="text-gold italic">{t('headline2')}</em>
          <br />
          {t('headline3')}
        </h2>
        <p className="font-sans text-[15px] leading-[1.75] text-white/65 mb-10">
          {t('body')}
        </p>

        {/* Stats with separators */}
        <div className="flex items-start">
          {STAT_KEYS.map((key, i) => (
            <div key={key} className="flex items-start">
              {i > 0 && (
                <div className="w-px self-stretch bg-white/10 mx-7" />
              )}
              <div>
                <div className="font-heading text-[28px] font-bold text-gold leading-none mb-1.5">
                  {t(`stats.${key}.value`)}
                </div>
                <div className="font-sans text-[11px] text-white/50 leading-snug">
                  {t(`stats.${key}.label`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security badge */}
      <div className="relative z-10 flex items-center gap-3 py-4 px-5 bg-white/[0.06] rounded-xl border border-white/10 max-w-[460px] backdrop-blur-sm">
        <div className="shrink-0 size-8 rounded-lg bg-gold/15 flex items-center justify-center">
          <Shield className="size-4 text-gold" strokeWidth={1.6} aria-hidden="true" />
        </div>
        <span className="font-sans text-[13px] text-white/80 leading-snug">{t('security')}</span>
      </div>
    </div>
  );
}
