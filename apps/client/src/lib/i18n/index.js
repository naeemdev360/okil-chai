import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@okil-chai/i18n';
import authBn from '@okil-chai/i18n/locales/bn/auth.json';
import bookingBn from '@okil-chai/i18n/locales/bn/booking.json';
import commonBn from '@okil-chai/i18n/locales/bn/common.json';
import lawyerBn from '@okil-chai/i18n/locales/bn/lawyer.json';
import authEn from '@okil-chai/i18n/locales/en/auth.json';
import bookingEn from '@okil-chai/i18n/locales/en/booking.json';
import commonEn from '@okil-chai/i18n/locales/en/common.json';
import lawyerEn from '@okil-chai/i18n/locales/en/lawyer.json';
void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
    resources: {
        en: { common: commonEn, auth: authEn, booking: bookingEn, lawyer: lawyerEn },
        bn: { common: commonBn, auth: authBn, booking: bookingBn, lawyer: lawyerBn },
    },
    supportedLngs: [...SUPPORTED_LOCALES],
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'okil-chai-locale',
    },
});
export default i18n;
