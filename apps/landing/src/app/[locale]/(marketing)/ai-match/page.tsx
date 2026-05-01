import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AiMatcherFlow }   from '../../../../components/ai-matcher';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('aiMatcher');
  return {
    title:       `${t('title')} ${t('titleHighlight')} — OkilChai`,
    description: t('subtitle'),
  };
}

export default function AiMatchPage() {
  return <AiMatcherFlow />;
}
