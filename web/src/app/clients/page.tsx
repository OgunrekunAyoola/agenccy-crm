'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClients, PriorityTier } from '@/hooks/queries/useClients';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Container, Section } from '@/components/ui/LayoutPrimitives';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { ErrorState } from '@/components/ui/StateVisuals';
import { EmptyState } from '@/components/ui/EmptyState';
import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';

export default function ClientsPage() {
  const { t } = useTranslation('clients');
  const { clients, isLoading, error, createClient, isCreating } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'date'>('date');
  const [newClient, setNewClient] = useState({ 
    name: '', 
    legalName: '',
    vatNumber: '',
    businessAddress: '',
    industry: '',
    priority: PriorityTier.Tier3
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient(newClient);
      setNewClient({ 
        name: '', 
        legalName: '',
        vatNumber: '',
        businessAddress: '',
        industry: '',
        priority: PriorityTier.Tier3
      });
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to create client. Please try again.');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'priority') return a.priority - b.priority;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Container>
      <Section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
          <p className="text-muted-foreground mt-1">{t('description')}</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'priority' | 'date')}
            options={[
              { label: 'Sort by Date', value: 'date' },
              { label: 'Sort by Name', value: 'name' },
              { label: 'Sort by Priority', value: 'priority' },
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client / Legal Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>VAT Number</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/clients/${c.id}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.legalName}</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{c.industry || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        c.priority === PriorityTier.Tier1 ? 'primary' :
                        c.priority === PriorityTier.Tier2 ? 'info' : 'muted'
                      }
                      size="sm"
                    >
                      {PriorityTier[c.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs">{c.vatNumber || '-'}</code>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {sortedClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <EmptyState
                        icon={Building2}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Client"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Client Display Name"
              placeholder="e.g. Acme Mobile"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              required
            />
            <Input
              label="Legal Entity Name"
              placeholder="Acme Solutions LTD"
              value={newClient.legalName}
              onChange={(e) => setNewClient({ ...newClient, legalName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="VAT / Tax ID"
              placeholder="GB123456789"
              value={newClient.vatNumber}
              onChange={(e) => setNewClient({ ...newClient, vatNumber: e.target.value })}
            />
            <Select
              label="Priority Tier"
              value={newClient.priority}
              onChange={(e) => setNewClient({ ...newClient, priority: parseInt(e.target.value) })}
              options={[
                { label: 'Tier 1 (High)', value: PriorityTier.Tier1 },
                { label: 'Tier 2 (Medium)', value: PriorityTier.Tier2 },
                { label: 'Tier 3 (Low)', value: PriorityTier.Tier3 },
              ]}
            />
          </div>

          <Input
            label="Industry"
            placeholder="e.g. FinTech, Healthcare"
            value={newClient.industry}
            onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
          />

          <Input
            label="Business Address"
            placeholder="123 Business St, London, UK"
            value={newClient.businessAddress}
            onChange={(e) => setNewClient({ ...newClient, businessAddress: e.target.value })}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>Create Client</Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
}
