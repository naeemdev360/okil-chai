import { getRequestConfig } from 'next-intl/server';
import { getMessages, type Locale } from '@okil-chai/i18n';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale =
    requested && (routing.locales as readonly string[]).includes(requested)
      ? (requested as Locale)
      : routing.defaultLocale;

  const [i18nMessages, local] = await Promise.all([
    getMessages(locale),
    import(`../../messages/${locale}.json`),
  ]);

  return {
    locale,
    messages: {
      ...i18nMessages,
      ...(local.default as Record<string, unknown>),
    },
  };
});
