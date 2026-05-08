import { brand } from '@/lib/brand';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { SearchHeader } from '../../../../components/search/SearchHeader';
import { SearchResultsPane } from '../../../../components/search/SearchResultsPane';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('search');
  return {
    title: t('pageTitle',{
      appName: brand.name,
    }),
    description: t('pageDescription'),
  };
}

export default function SearchPage() {
  return (
    <>
      <Suspense>
        <SearchHeader />
      </Suspense>
      <Suspense fallback={<div className="min-h-[calc(100vh-200px)] bg-cream" />}>
        <SearchResultsPane />
      </Suspense>
    </>
  );
}
