'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageSwitcher, type LocaleOption } from '@repo/ui';

const LOCALES: LocaleOption[] = [
  { code: 'en', label: 'EN'  },
  { code: 'bn', label: 'বাং' },
];

export function LocaleSwitcher({ className }: { className?: string }) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (next: string) => {
    // pathname from next/navigation includes the locale segment: /en/path → /bn/path
    const newPath = pathname.replace(/^\/[^/]+/, `/${next}`);
    router.push(newPath);
  };

  return (
    <LanguageSwitcher
      locales={LOCALES}
      activeLocale={activeLocale}
      onSwitch={handleSwitch}
      className={className}
    />
  );
}
