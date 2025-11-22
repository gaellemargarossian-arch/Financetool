import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import ar from './locales/ar.json';

const i18n = new I18n({
  en,
  ar,
});

// Set the locale once at the beginning of your app
i18n.locale = Localization.locale.split('-')[0] || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;

export const formatCurrency = (amount: number, currency: string = 'AED'): string => {
  const locale = i18n.locale === 'ar' ? 'ar-AE' : 'en-AE';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
  const locale = i18n.locale === 'ar' ? 'ar-AE' : 'en-AE';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: format,
  }).format(date);
};

