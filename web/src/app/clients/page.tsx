'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useClients, PriorityTier, ContactType, CreateClientInput } from '@/hooks/queries/useClients';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Container, Section, Divider } from '@/components/ui/LayoutPrimitives';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { ErrorState } from '@/components/ui/StateVisuals';
import { EmptyState } from '@/components/ui/EmptyState';
import { Building2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const EMPTY_CONTACT = { firstName: '', lastName: '', email: '', phone: '' };

function vatValidationError(vatNumber: string, isVatRegistered: boolean): string | undefined {
  const digits = isVatRegistered ? vatNumber.replace(/^BG/i, '') : vatNumber;
  if (!digits) return 'VAT number is required';
  if (!/^\d{9}$/.test(digits)) return 'VAT number must be exactly 9 digits';
  return undefined;
}

export default function ClientsPage() {
  const { t } = useTranslation('clients');
  const { clients, isLoading, error, createClient, isCreating } = useClients();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'date'>('date');
  const [search, setSearch] = useState('');

  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const [vatDigits, setVatDigits] = useState('');
  const [vatTouched, setVatTouched] = useState(false);

  const [newClient, setNewClient] = useState({
    name: '',
    legalName: '',
    businessAddress: '',
    industry: '',
    priority: PriorityTier.Tier3,
  });

  const [commercialContact, setCommercialContact] = useState({ ...EMPTY_CONTACT });
  const [financialContact, setFinancialContact] = useState({ ...EMPTY_CONTACT });

  const vatNumber = isVatRegistered ? `BG${vatDigits}` : vatDigits;
  const vatError = vatTouched ? vatValidationError(vatDigits, isVatRegistered) : undefined;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setVatTouched(true);
    const err = vatValidationError(vatDigits, isVatRegistered);
    if (err) return;

    const payload: CreateClientInput = {
      ...newClient,
      vatNumber,
      commercialContact: commercialContact.firstName ? commercialContact : undefined,
      financialContact:  financialContact.firstName  ? financialContact  : undefined,
    };

    try {
      await createClient(payload);
      toast.success('Client created successfully.');
      // reset
      setNewClient({ name: '', legalName: '', businessAddress: '', industry: '', priority: PriorityTier.Tier3 });
      setVatDigits('');
      setIsVatRegistered(false);
      setVatTouched(false);
      setCommercialContact({ ...EMPTY_CONTACT });
      setFinancialContact({ ...EMPTY_CONTACT });
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to create client. Please try again.');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...clients]
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.legalName.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortBy === 'name')     return a.name.localeCompare(b.name);
        if (sortBy === 'priority') return a.priority - b.priority;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [clients, search, sortBy]);

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
            onChange={(e) => setSortBy(e.target.value as 'name' | 'priority' | 'date')}
            options={[
              { label: 'Sort by Date',     value: 'date'     },
              { label: 'Sort by Name',     value: 'name'     },
              { label: 'Sort by Priority', value: 'priority' },
            ]}
            className="w-44"
          />
          <Button onClick={() => setIsModalOpen(true)}>{t('addButton')}</Button>
        </div>
      </Section>

      {/* Search bar */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle pointer-events-none" />
        <input
          type="search"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-foreground',
            'placeholder:text-foreground-subtle transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary',
          )}
        />
      </div>

      <Section>
        {error ? (
          <ErrorState reset={() => window.location.reload()} />
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
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
                <TableHead>Contacts</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const commercial = c.contacts?.find((ct) => ct.type === ContactType.Commercial);
                const financial  = c.contacts?.find((ct) => ct.type === ContactType.Financial);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link href={`/clients/${c.id}`} className="block hover:text-primary transition-colors">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-foreground-muted">{c.legalName}</div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground-muted">{c.industry || '—'}</span>
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
                      <code className="text-xs text-foreground-muted">{c.vatNumber || '—'}</code>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        {commercial && (
                          <div className="text-xs">
                            <span className="font-medium text-foreground">{commercial.firstName} {commercial.lastName}</span>
                            <span className="text-foreground-subtle ml-1">(Commercial)</span>
                          </div>
                        )}
                        {financial && (
                          <div className="text-xs">
                            <span className="font-medium text-foreground">{financial.firstName} {financial.lastName}</span>
                            <span className="text-foreground-subtle ml-1">(Financial)</span>
                          </div>
                        )}
                        {!commercial && !financial && (
                          <span className="text-xs text-foreground-subtle">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-foreground-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      icon={Building2}
                      title={search ? 'No clients match your search' : t('empty.title')}
                      description={search ? `No results for "${search}"` : t('empty.description')}
                      action={!search ? <Button onClick={() => setIsModalOpen(true)}>{t('empty.button')}</Button> : undefined}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Section>

      {/* ── Create Client Modal ────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Client" className="max-w-2xl">
        <form onSubmit={handleCreate} className="space-y-5">
          {/* Basic info */}
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

          {/* VAT */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="vat-registered"
                type="checkbox"
                checked={isVatRegistered}
                onChange={(e) => setIsVatRegistered(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="vat-registered" className="text-sm font-medium text-foreground cursor-pointer">
                VAT Registered (adds BG prefix)
              </label>
            </div>
            <div className="flex items-center gap-2">
              {isVatRegistered && (
                <span className="h-10 flex items-center px-3 rounded-lg border border-border bg-surface-sunken text-sm font-semibold text-foreground-muted select-none">
                  BG
                </span>
              )}
              <div className="flex-1">
                <Input
                  placeholder="9-digit VAT number"
                  value={vatDigits}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setVatDigits(val);
                  }}
                  onBlur={() => setVatTouched(true)}
                  error={vatError}
                  required
                  maxLength={9}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Industry"
              placeholder="e.g. FinTech, Healthcare"
              value={newClient.industry}
              onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
            />
            <Select
              label="Priority Tier"
              value={newClient.priority}
              onChange={(e) => setNewClient({ ...newClient, priority: parseInt(e.target.value) })}
              options={[
                { label: 'Tier 1 (High)',   value: PriorityTier.Tier1 },
                { label: 'Tier 2 (Medium)', value: PriorityTier.Tier2 },
                { label: 'Tier 3 (Low)',    value: PriorityTier.Tier3 },
              ]}
            />
          </div>

          <Input
            label="Business Address"
            placeholder="123 Business St, Sofia, Bulgaria"
            value={newClient.businessAddress}
            onChange={(e) => setNewClient({ ...newClient, businessAddress: e.target.value })}
          />

          <Divider />

          {/* Commercial contact */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Commercial Contact</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Ivan"
                value={commercialContact.firstName}
                onChange={(e) => setCommercialContact({ ...commercialContact, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                placeholder="Petrov"
                value={commercialContact.lastName}
                onChange={(e) => setCommercialContact({ ...commercialContact, lastName: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                placeholder="commercial@client.com"
                value={commercialContact.email}
                onChange={(e) => setCommercialContact({ ...commercialContact, email: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+359 88 000 0000"
                value={commercialContact.phone}
                onChange={(e) => setCommercialContact({ ...commercialContact, phone: e.target.value })}
              />
            </div>
          </div>

          <Divider />

          {/* Financial contact */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Financial Contact</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Maria"
                value={financialContact.firstName}
                onChange={(e) => setFinancialContact({ ...financialContact, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                placeholder="Ivanova"
                value={financialContact.lastName}
                onChange={(e) => setFinancialContact({ ...financialContact, lastName: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                placeholder="finance@client.com"
                value={financialContact.email}
                onChange={(e) => setFinancialContact({ ...financialContact, email: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+359 88 000 0001"
                value={financialContact.phone}
                onChange={(e) => setFinancialContact({ ...financialContact, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
