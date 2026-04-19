'use client';

import { useStats } from '@/hooks/queries/useStats';
import { useInvoices, InvoiceStatus } from '@/hooks/queries/useInvoices';
import { useAdMetrics } from '@/hooks/queries/useAdMetrics';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Section,
} from '@/components/ui/LayoutPrimitives';
import { ROIAnalytics } from './components/ROIAnalytics';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { ErrorState } from '@/components/ui/StateVisuals';
import {
  DollarSign,
  TrendingDown,
  Briefcase,
  Users,
  TrendingUp,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
  valueClass: string;
  link: string;
}

function StatCardSkeleton() {
  return <div className="animate-pulse bg-muted h-36 rounded-xl border border-border" />;
}

function StatCardUI({ stat }: { stat: StatCard }) {
  return (
    <Card className="group hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
      <Link href={stat.link} className="block p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', stat.bgClass)}>
            <stat.icon className={cn('h-5 w-5', stat.iconClass)} />
          </div>
        </div>
        <p className="text-sm text-foreground-muted font-medium">{stat.title}</p>
        <p className={cn('text-3xl font-bold mt-1 tracking-tight', stat.valueClass)}>
          {stat.value}
        </p>
        <p className="text-xs text-foreground-subtle mt-3 group-hover:text-primary transition-colors duration-150">
          View details →
        </p>
      </Link>
    </Card>
  );
}

export default function DashboardPageClient() {
  const { t } = useTranslation('dashboard');
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats();
  const { invoices, isLoading: invoicesLoading, error: invoicesError } = useInvoices();
  const { metrics, isLoading: metricsLoading } = useAdMetrics();

  const anyLoading = statsLoading || invoicesLoading || metricsLoading;
  const anyError = statsError || invoicesError;

  const totalRevenue = invoices
    .filter((i) => i.status === InvoiceStatus.Paid)
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalAdSpend = metrics.reduce((sum, m) => sum + m.spend, 0);

  const statCards: StatCard[] = [
    {
      title: t('stats.totalRevenue'),
      value: invoicesError ? '—' : `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconClass: 'text-success',
      bgClass: 'bg-success-subtle',
      valueClass: 'text-success',
      link: '/invoices',
    },
    {
      title: t('stats.totalAdSpend'),
      value: `$${totalAdSpend.toLocaleString()}`,
      icon: TrendingDown,
      iconClass: 'text-danger',
      bgClass: 'bg-danger-subtle',
      valueClass: 'text-danger',
      link: '/projects',
    },
    {
      title: t('stats.activeProjects'),
      value: statsError ? '—' : (stats?.activeProjectsCount ?? 0),
      icon: Briefcase,
      iconClass: 'text-info',
      bgClass: 'bg-info-subtle',
      valueClass: 'text-info',
      link: '/projects',
    },
    {
      title: t('stats.totalClients'),
      value: statsError ? '—' : (stats?.totalClientsCount ?? 0),
      icon: Users,
      iconClass: 'text-primary',
      bgClass: 'bg-primary-subtle',
      valueClass: 'text-primary',
      link: '/clients',
    },
    {
      title: t('stats.activeLeads'),
      value: statsError ? '—' : (stats?.activeLeadsCount ?? 0),
      icon: TrendingUp,
      iconClass: 'text-success',
      bgClass: 'bg-success-subtle',
      valueClass: 'text-success',
      link: '/leads',
    },
    {
      title: t('stats.pendingOffers'),
      value: statsError ? '—' : (stats?.pendingOffersCount ?? 0),
      icon: FileText,
      iconClass: 'text-warning',
      bgClass: 'bg-warning-subtle',
      valueClass: 'text-warning',
      link: '/offers',
    },
  ];

  if (anyError) {
    return (
      <Container>
        <ErrorState reset={() => window.location.reload()} />
      </Container>
    );
  }

  return (
    <Container>
      <OnboardingChecklist />
      <Section title={t('heading')}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {anyLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => <StatCardSkeleton key={i} />)
            : statCards.map((stat) => <StatCardUI key={stat.title} stat={stat} />)}
        </div>
      </Section>

      <Section title={t('roiHeading')} className="mt-8">
        <ROIAnalytics />
      </Section>

      <Section title={t('recentActivity')} className="mt-8">
        <Card>
          <CardContent className="py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success shrink-0" />
                <p className="text-sm text-foreground">
                  Revenue tracking active. Total paid:{' '}
                  <span className="font-semibold">${totalRevenue.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-info shrink-0" />
                <p className="text-sm text-foreground">Project profitability insights enabled.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
