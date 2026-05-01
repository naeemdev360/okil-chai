import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '../../../components/sections/HeroSection';
import { StatsBar } from '../../../components/sections/StatsBar';
import { HowItWorksSection } from '../../../components/sections/HowItWorksSection';
import { PracticeAreasSection } from '../../../components/sections/PracticeAreasSection';
import { TestimonialsSection } from '../../../components/sections/TestimonialsSection';
import { TrustSafetySection } from '../../../components/sections/TrustSafetySection';
import { PricingSection } from '../../../components/sections/PricingSection';

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
      <StatsBar />
      <HowItWorksSection />
      <PracticeAreasSection />
      <TestimonialsSection />
      <TrustSafetySection />
      <PricingSection />
    </>
  );
}
