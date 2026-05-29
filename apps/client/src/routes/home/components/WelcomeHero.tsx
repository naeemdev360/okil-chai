import { Button, DecorativeOrb } from '@repo/ui';
import { Sparkles } from 'lucide-react';
import { appUrls } from '../../../lib/app-urls';

function goToSearch(): void {
  window.location.href = appUrls.search;
}

function goToAiMatch(): void {
  window.location.href = appUrls.aiMatch;
}

/** Hero banner shown to brand-new clients with the primary discovery CTAs. */
export function WelcomeHero() {
  return (
    <div className="relative mb-7 overflow-hidden rounded-xl bg-navy p-5 sm:p-9">
      <DecorativeOrb appearance="gold-outline-medium" size="xl" className="-right-20 -top-20 z-0" />
      <DecorativeOrb appearance="gold-outline-light" size="lg" className="-bottom-16 right-5 z-0" />

      <div className="relative z-[1] max-w-xl">
        <p className="mb-2.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-gold">
          Welcome to LegalConnect
        </p>
        <h1 className="mb-3 font-heading text-2xl font-bold leading-tight text-white sm:text-[34px]">
          Let&apos;s find you the right lawyer.
        </h1>
        <p className="mb-6 font-sans text-[15px] leading-relaxed text-white/70">
          Tell us about your matter and we&apos;ll match you with a verified specialist. Or browse by
          practice area.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="gold" onClick={goToAiMatch}>
            <Sparkles size={15} /> Try AI Match
          </Button>
          <Button
            variant="ghost"
            onClick={goToSearch}
            className="border border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            Browse Lawyers
          </Button>
        </div>
      </div>
    </div>
  );
}
