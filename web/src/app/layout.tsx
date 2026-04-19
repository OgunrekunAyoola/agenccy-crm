import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { AppShell } from './components/AppShell';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import { FailsafeProvider } from '@/components/ui/FailsafeProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: {
    default: 'Agency CRM',
    template: '%s | Agency CRM',
  },
  description:
    'All-in-one CRM for digital agencies — manage clients, leads, offers, projects, contracts, and invoices from one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-background">
        <I18nProvider>
          <QueryProvider>
            <AuthProvider>
              <FailsafeProvider>
                <AppShell>{children}</AppShell>
              </FailsafeProvider>
              <ToasterProvider />
            </AuthProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
