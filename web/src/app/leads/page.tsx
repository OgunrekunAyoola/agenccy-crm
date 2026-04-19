'use client';

import { useState } from 'react';
import { useLeads, LeadStatus, LeadSource, ServiceType } from '@/hooks/queries/useLeads';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Container, Section } from '@/components/ui/LayoutPrimitives';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { ErrorState } from '@/components/ui/StateVisuals';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LeadsPage() {
  const { t } = useTranslation('leads');
  const { leads, isLoading, error, createLead, isCreating, updateStatus, isUpdatingStatus } = useLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'value'>('date');
  const [newLead, setNewLead] = useState({
    title: '',
    description: '',
    contactName: '',
    email: '',
    phone: '',
    companyName: '',
    source: LeadSource.Manual,
    interest: ServiceType.Other,
    budgetRange: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead(newLead);
      setNewLead({
        title: '',
        description: '',
        contactName: '',
        email: '',
        phone: '',
        companyName: '',
        source: LeadSource.Manual,
        interest: ServiceType.Other,
        budgetRange: '',
      });
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to create lead. Please try again.');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'value') return (b.dealValue || 0) - (a.dealValue || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Container>
      <Section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
          <p className="text-foreground-muted mt-1">{t('description')}</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'date' | 'value')}
            options={[
              { label: 'Sort by Date', value: 'date' },
              { label: 'Sort by Name', value: 'title' },
              { label: 'Sort by Value', value: 'value' },
            ]}
            className="w-40"
          />
          <Button onClick={() => setIsModalOpen(true)}>{t('addButton')}</Button>
        </div>
      </Section>

      <Section>
        {error ? (
          <ErrorState reset={() => window.location.reload()} />
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead / Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{l.title}</div>
                    <div className="text-xs text-foreground-muted">{l.companyName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">{l.contactName}</div>
                    <div className="text-xs text-foreground-muted">{l.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">{LeadSource[l.source]}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground-muted">{ServiceType[l.interest]}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-success">
                      {l.dealValue ? `$${l.dealValue.toLocaleString()}` : '—'}
                    </div>
                    <div className="text-[10px] text-foreground-subtle">Prob: {l.probability}%</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={LeadStatus[l.status]} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={l.status}
                      disabled={isUpdatingStatus}
                      onChange={(e) => updateStatus({ id: l.id, status: parseInt(e.target.value) as LeadStatus })}
                      options={[
                        { label: 'New', value: LeadStatus.New },
                        { label: 'Contacted', value: LeadStatus.Contacted },
                        { label: 'Qualified', value: LeadStatus.Qualified },
                        { label: 'Lost', value: LeadStatus.Lost },
                      ]}
                      className="w-36"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <EmptyState
                      icon={Users}
                      title={t('empty.title')}
                      description={t('empty.description')}
                      action={<Button onClick={() => setIsModalOpen(true)}>{t('empty.button')}</Button>}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lead">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deal Title"
              placeholder="e.g. Website Redesign"
              value={newLead.title}
              onChange={(e) => setNewLead({ ...newLead, title: e.target.value })}
              required
            />
            <Input
              label="Company Name"
              placeholder="Acme Corp"
              value={newLead.companyName}
              onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              placeholder="John Doe"
              value={newLead.contactName}
              onChange={(e) => setNewLead({ ...newLead, contactName: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Source"
              value={newLead.source}
              onChange={(e) => setNewLead({ ...newLead, source: parseInt(e.target.value) })}
              options={[
                { label: 'Facebook', value: LeadSource.Facebook },
                { label: 'Google', value: LeadSource.Google },
                { label: 'Website', value: LeadSource.Website },
                { label: 'Referral', value: LeadSource.Referral },
                { label: 'Manual', value: LeadSource.Manual },
              ]}
            />
            <Select
              label="Service Interest"
              value={newLead.interest}
              onChange={(e) => setNewLead({ ...newLead, interest: parseInt(e.target.value) })}
              options={[
                { label: 'Development', value: ServiceType.Development },
                { label: 'Marketing', value: ServiceType.Marketing },
                { label: 'Staffing', value: ServiceType.Staffing },
                { label: 'Other', value: ServiceType.Other },
              ]}
            />
          </div>

          <Input
            label="Budget Range / Notes"
            placeholder="$5k – $10k"
            value={newLead.budgetRange}
            onChange={(e) => setNewLead({ ...newLead, budgetRange: e.target.value })}
          />

          <Input
            label="Internal Description"
            placeholder="Key requirements or pitch notes..."
            value={newLead.description}
            onChange={(e) => setNewLead({ ...newLead, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>Create Lead</Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
}
