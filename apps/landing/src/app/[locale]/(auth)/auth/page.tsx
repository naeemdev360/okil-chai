import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RoleChooser } from '../../../../components/auth/RoleChooser';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.roleChooser');
  return { title: t('title') };
}

export default function AuthPage() {
  return <RoleChooser />;
}
