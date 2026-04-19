import type { Metadata } from 'next';
import { LandingContent } from './LandingContent';

export const metadata: Metadata = {
  title: 'Agency CRM — Precision Growth for Digital Agencies',
  description:
    'All-in-one CRM built for digital agencies. Manage leads, offers, contracts, invoices, and ad performance from one command center.',
};

export default function LandingPage() {
  return <LandingContent />;
}
