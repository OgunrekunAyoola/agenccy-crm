'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const FEATURE_KEYS = [
  { icon: '🎯', key: 'leadPipeline' },
  { icon: '📄', key: 'proposals' },
  { icon: '💰', key: 'billing' },
  { icon: '📊', key: 'analytics' },
  { icon: '🏗️', key: 'projects' },
  { icon: '⚡', key: 'automation' },
] as const;

const STAT_KEYS = [
  { value: '100%', key: 'leadToInvoice' },
  { value: '<15s', key: 'contractTime' },
  { value: '3×', key: 'monthEnd' },
  { value: '0', key: 'thirdParty' },
] as const;

export function LandingContent() {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-slate-900">Agency CRM</span>
          </Link>

          <nav className="flex items-center gap-3" aria-label="Site navigation">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-md hover:bg-slate-100"
            >
              {t('landing.nav.login')}
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg shadow-sm"
            >
              {t('landing.nav.startTrial')}
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-28 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide mb-6">
              {t('landing.hero.badge')}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.08]">
              {t('landing.hero.headline1')}{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('landing.hero.headline2')}
              </span>
              {t('landing.hero.headline3')}
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
              {t('landing.hero.body')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-14 px-8 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all"
              >
                {t('landing.hero.ctaPrimary')}
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-14 px-8 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                {t('landing.hero.ctaSecondary')}
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">{t('landing.hero.disclaimer')}</p>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-y border-slate-100 bg-slate-50 py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STAT_KEYS.map(({ value, key }) => (
              <div key={key}>
                <div className="text-3xl font-extrabold text-indigo-600 mb-1">{value}</div>
                <div className="text-sm text-slate-500 font-medium">{t(`landing.stats.${key}`)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                {t('landing.features.heading')}
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                {t('landing.features.subheading')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURE_KEYS.map(({ icon, key }) => (
                <div
                  key={key}
                  className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all"
                >
                  <div className="text-3xl mb-4">{icon}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">
                    {t(`landing.features.${key}.title`)}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {t(`landing.features.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t('landing.cta.heading')}
            </h2>
            <p className="text-indigo-200 text-lg mb-8">{t('landing.cta.body')}</p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-indigo-700 bg-white hover:bg-slate-50 rounded-xl shadow-lg hover:scale-[1.02] transition-all"
            >
              {t('landing.cta.button')}
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-10 border-t bg-white px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm">Agency CRM</span>
          </div>
          <p className="text-slate-400 text-sm">{t('landing.footer.copyright')}</p>
          <div className="flex gap-4 text-sm">
            <Link href="/login" className="text-slate-500 hover:text-slate-800 transition-colors">
              {t('landing.footer.login')}
            </Link>
            <Link href="/signup" className="text-slate-500 hover:text-slate-800 transition-colors">
              {t('landing.footer.signup')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
