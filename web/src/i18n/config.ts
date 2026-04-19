import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enDashboard from '@/locales/en/dashboard.json';
import enClients from '@/locales/en/clients.json';
import enLeads from '@/locales/en/leads.json';
import enInvoices from '@/locales/en/invoices.json';
import enProjects from '@/locales/en/projects.json';
import enOffers from '@/locales/en/offers.json';
import enTasks from '@/locales/en/tasks.json';
import enSettings from '@/locales/en/settings.json';

import bgCommon from '@/locales/bg/common.json';
import bgAuth from '@/locales/bg/auth.json';
import bgDashboard from '@/locales/bg/dashboard.json';
import bgClients from '@/locales/bg/clients.json';
import bgLeads from '@/locales/bg/leads.json';
import bgInvoices from '@/locales/bg/invoices.json';
import bgProjects from '@/locales/bg/projects.json';
import bgOffers from '@/locales/bg/offers.json';
import bgTasks from '@/locales/bg/tasks.json';
import bgSettings from '@/locales/bg/settings.json';

// Guard against double-init (e.g. hot-reload in dev)
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          common: enCommon,
          auth: enAuth,
          dashboard: enDashboard,
          clients: enClients,
          leads: enLeads,
          invoices: enInvoices,
          projects: enProjects,
          offers: enOffers,
          tasks: enTasks,
          settings: enSettings,
        },
        bg: {
          common: bgCommon,
          auth: bgAuth,
          dashboard: bgDashboard,
          clients: bgClients,
          leads: bgLeads,
          invoices: bgInvoices,
          projects: bgProjects,
          offers: bgOffers,
          tasks: bgTasks,
          settings: bgSettings,
        },
      },
      lng: undefined, // let LanguageDetector decide
      fallbackLng: 'en',
      supportedLngs: ['en', 'bg'],
      defaultNS: 'common',
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'agenccy_lang',
      },
      interpolation: {
        escapeValue: false, // React already escapes values
      },
    });
}

export default i18n;
