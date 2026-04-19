'use client';

import { useInvoices, InvoiceStatus } from '@/hooks/queries/useInvoices';
import { useProjects } from '@/hooks/queries/useProjects';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Container, Section } from '@/components/ui/LayoutPrimitives';
import { Modal } from '@/components/ui/Modal';
import { ErrorState } from '@/components/ui/StateVisuals';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { useState } from 'react';
import { InvoiceEditModal } from './components/InvoiceEditModal';
import { Invoice } from '@/hooks/queries/useInvoices';
import { ReceiptText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InvoicesPage() {
  const { t } = useTranslation('invoices');
  const {
    invoices,
    isLoading,
    error,
    updateStatus,
    isUpdatingStatus,
    recordPayment,
    isRecordingPayment,
  } = useInvoices();
  const { projects } = useProjects();

  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    method: 0,
    referenceNumber: '',
    notes: '',
  });

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    try {
      await recordPayment({
        id: paymentModalInvoice.id,
        data: { ...paymentData, amount: Number(paymentData.amount) },
      });
      toast.success('Payment recorded successfully');
      setPaymentModalInvoice(null);
      setPaymentData({
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        method: 0,
        referenceNumber: '',
        notes: '',
      });
    } catch {
      toast.error('Failed to record payment');
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <Container>
      <Section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
          <p className="text-foreground-muted mt-1">{t('description')}</p>
        </div>
      </Section>

      <Section>
        {error ? (
          <ErrorState reset={() => window.location.reload()} />
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-foreground">{getProjectName(inv.projectId)}</TableCell>
                  <TableCell className="font-medium text-foreground-muted">
                    {inv.currency} {inv.totalAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-success font-medium">
                    {inv.currency} {inv.paidAmount?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="font-bold text-foreground">
                    {inv.currency} {inv.balanceAmount?.toLocaleString() || inv.totalAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={InvoiceStatus[inv.status]} />
                  </TableCell>
                  <TableCell className="text-xs text-foreground-muted">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => setEditingInvoice(inv)}>
                        Edit
                      </Button>
                      {inv.status !== InvoiceStatus.Paid && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => {
                            setPaymentModalInvoice(inv);
                            setPaymentData((prev) => ({ ...prev, amount: inv.balanceAmount }));
                          }}
                        >
                          Add Payment
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <EmptyState
                      icon={ReceiptText}
                      title={t('empty.title')}
                      description={t('empty.description')}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Section>

      <InvoiceEditModal
        key={editingInvoice?.id}
        isOpen={!!editingInvoice}
        onClose={() => setEditingInvoice(null)}
        invoice={editingInvoice}
      />

      <Modal
        isOpen={!!paymentModalInvoice}
        onClose={() => setPaymentModalInvoice(null)}
        title={`Add Payment for ${paymentModalInvoice?.invoiceNumber}`}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="bg-surface-sunken p-3 rounded-lg border border-border mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Total:</span>
              <span className="font-bold text-foreground">
                ${paymentModalInvoice?.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-foreground-muted">Balance due:</span>
              <span className="font-bold text-danger">
                ${paymentModalInvoice?.balanceAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <Input
            label="Payment Amount"
            type="number"
            step="0.01"
            required
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Payment Date"
              type="date"
              required
              value={paymentData.paymentDate}
              onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
            />
            <Select
              label="Method"
              value={paymentData.method}
              onChange={(e) => setPaymentData({ ...paymentData, method: Number(e.target.value) })}
              options={[
                { label: 'Bank Transfer', value: 0 },
                { label: 'Credit Card', value: 1 },
                { label: 'PayPal', value: 2 },
                { label: 'Stripe', value: 3 },
                { label: 'Cash', value: 4 },
                { label: 'Other', value: 5 },
              ]}
            />
          </div>

          <Input
            label="Reference Number"
            placeholder="Check #, Transaction ID..."
            value={paymentData.referenceNumber}
            onChange={(e) => setPaymentData({ ...paymentData, referenceNumber: e.target.value })}
          />

          <Input
            label="Notes"
            placeholder="Optional payment notes..."
            value={paymentData.notes}
            onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              type="button"
              onClick={() => setPaymentModalInvoice(null)}
              disabled={isRecordingPayment}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isRecordingPayment}>
              Record Payment
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
}
