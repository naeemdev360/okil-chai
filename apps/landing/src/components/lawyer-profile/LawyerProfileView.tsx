'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProfileHero } from './ProfileHero';
import { BookingSidebar } from './BookingSidebar';
import { AboutTab } from './tabs/AboutTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { AvailabilityTab } from './tabs/AvailabilityTab';
import { LocationTab } from './tabs/LocationTab';
import type { Tab } from './types';
import type { Lawyer } from '../../lib/search/mock-lawyers';

interface LawyerProfileViewProps {
  readonly lawyer: Lawyer;
}

export function LawyerProfileView({ lawyer }: LawyerProfileViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const t = useTranslations('lawyerProfile');

  const tabLabels: Record<Tab, string> = {
    about:        t('tabs.about'),
    reviews:      t('tabs.reviews'),
    availability: t('tabs.availability'),
    location:     t('tabs.location'),
  };

  return (
    <div className="bg-cream min-h-screen">
      <ProfileHero
        lawyer={lawyer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabLabels={tabLabels}
      />

      <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <main>
          {activeTab === 'about'        && <AboutTab lawyer={lawyer} />}
          {activeTab === 'reviews'      && <ReviewsTab lawyer={lawyer} />}
          {activeTab === 'availability' && <AvailabilityTab lawyer={lawyer} />}
          {activeTab === 'location'     && <LocationTab />}
        </main>
        <aside>
          <BookingSidebar lawyer={lawyer} />
        </aside>
      </div>
    </div>
  );
}
