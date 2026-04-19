'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { useEffect } from 'react';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Keep the html[lang] attribute in sync with the active language
  // so screen readers and browser translation tools get the right hint.
  useEffect(() => {
    const update = (lng: string) => {
      document.documentElement.lang = lng;
    };
    update(i18n.language);
    i18n.on('languageChanged', update);
    return () => i18n.off('languageChanged', update);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
