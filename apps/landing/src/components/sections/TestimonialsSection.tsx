import { getTranslations } from 'next-intl/server';
import { QuoteMarkIcon } from '@okil-chai/ui';

const TESTIMONIAL_KEYS = ['priya', 'marcus', 'fatima'] as const;

const INITIALS: Record<string, string> = {
  priya:  'PS',
  marcus: 'MC',
  fatima: 'FA',
};

export async function TestimonialsSection() {
  const t = await getTranslations('home.testimonials');

  return (
    <section className="bg-navy py-20 px-6">
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-12">
          <span className="font-sans text-xs font-semibold tracking-[0.1em] uppercase text-gold mb-3 block">
            {t('sectionLabel')}
          </span>
          <h2 className="font-heading text-[36px] font-semibold text-white">
            {t('title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIAL_KEYS.map((key) => (
            <figure
              key={key}
              className="bg-white/4 border border-white/10 rounded-lg p-7 flex flex-col gap-5"
            >
              <QuoteMarkIcon className="size-7 text-gold opacity-85" />

              <blockquote className="font-heading italic text-[17px] leading-[1.55] text-white/92 flex-1">
                &ldquo;{t(`items.${key}.quote`)}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div
                  className="size-10 rounded-full bg-gold text-navy flex items-center justify-center font-heading font-bold text-sm"
                  aria-hidden="true"
                >
                  {INITIALS[key]}
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold text-white">
                    {t(`items.${key}.name`)}
                  </p>
                  <p className="font-sans text-xs text-white/55">
                    {t(`items.${key}.role`)}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
