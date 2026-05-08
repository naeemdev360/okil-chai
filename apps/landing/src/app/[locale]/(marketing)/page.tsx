import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '../../../components/motion/RevealOnScroll';
import { AiMatcherSection } from '../../../components/sections/AiMatcherSection';
import { HeroSection } from '../../../components/sections/HeroSection';
import { HowItWorksSection } from '../../../components/sections/HowItWorksSection';
import { PracticeAreasSection } from '../../../components/sections/PracticeAreasSection';
import { PricingSection } from '../../../components/sections/PricingSection';
import { StatsBar } from '../../../components/sections/StatsBar';
import { TestimonialsSection } from '../../../components/sections/TestimonialsSection';
import { TrustSafetySection } from '../../../components/sections/TrustSafetySection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home.hero');
  return {
    title: `${t('title')} ${t('titleHighlight')}`,
    description: t('subtitle'),
  };
}

export default function HomePage() {
  return (
    <>
        <HeroSection />
      <RevealOnScroll delay={0.04}>
        <StatsBar />
      </RevealOnScroll>
      <RevealOnScroll delay={0.06}>
        <HowItWorksSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.08}>
        <PracticeAreasSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.1}>
        <TestimonialsSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.12}>
        <TrustSafetySection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.14}>
        <AiMatcherSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.16}>
        <PricingSection />
      </RevealOnScroll>
    </>
  );
}
