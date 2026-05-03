import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AiMatcherFlow }   from '../../../../components/ai-matcher';
import { brand }           from '../../../../lib/brand';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('aiMatcher');
  return {
    title:       `${t('title')} ${t('titleHighlight')} — ${brand.name}`,
    description: t('subtitle'),
  };
}

export default function AiMatchPage() {
  return <AiMatcherFlow />;
}
