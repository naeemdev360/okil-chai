'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@repo/ui';

export interface AiMatchInlineCtaProps {
  readonly className?: string;
  readonly style?: CSSProperties;
}

/**
 * Hint + link to the AI Match flow. Copy lives under `home.hero.aiMatchHint` / `aiMatchCta`.
 */
export function AiMatchInlineCta({ className, style }: AiMatchInlineCtaProps) {
  const locale = useLocale();
  const t = useTranslations('home.hero');

  return (
    <div className={cn('flex flex-col items-center gap-2', className)} style={style}>
      <p className="font-sans text-sm max-w-[520px] text-center text-white/45">{t('aiMatchHint')}</p>
      <Link
        href={`/${locale}/ai-match`}
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-sans text-sm font-semibold transition-all duration-150',
          'border border-gold/45 bg-gold/8 text-gold-light/95',
          /* Glow + inset highlight: --color-gold / white from @repo/design-tokens/css */
          'shadow-[0_0_28px_color-mix(in_srgb,var(--color-gold)_12%,transparent),inset_0_1px_0_color-mix(in_srgb,white_6%,transparent)]',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/55',
        )}
      >
        {t('aiMatchCta')}
      </Link>
    </div>
  );
}
