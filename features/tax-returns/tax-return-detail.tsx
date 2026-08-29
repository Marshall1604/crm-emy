'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileCheck,
  FileText,
  MapPin,
  ShieldCheck,
  UserCheck,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initialTaxReturnsList, initialClientsList } from '@/features/clients/client-store';

export function TaxReturnDetail({ id }: { id: string }) {
  const returnItem =
    initialTaxReturnsList.find((r) => r.id === id) || {
      id,
      clientId: 'minh-nguyen',
      taxYear: '2025',
      returnType: 'Form 1040',
      filingStatus: 'Single',
      status: 'Waiting Documents',
      assignedStaff: 'Amy Tran',
      federalTaxAmount: 1450,
      preparationFee: 650,
      amountPaid: 325,
      balance: 325,
      internalNotes: 'Standard individual tax return engagement.',
      taxpayerNameSnapshot: 'Minh Nguyen',
      addressSnapshot: '1280 Harbor Blvd, Anaheim, CA 92801',
      filingStatusSnapshot: 'Single',
      createdAt: 'Jan 15, 2025',
      updatedAt: 'Aug 29, 2026',
    };

  const client = initialClientsList.find((c) => c.id === returnItem.clientId);

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 28px 48px' }}>
      {/* Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#64748b',
          marginBottom: '16px',
        }}
      >
        <Link
          href="/tax-returns"
          style={{
            color: '#475569',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={13} />
          Tax Returns
        </Link>
        <ChevronRight size={12} color="#94a3b8" />
        <Link
          href={`/clients/${returnItem.clientId}`}
          style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}
        >
          {returnItem.taxpayerNameSnapshot}
        </Link>
        <ChevronRight size={12} color="#94a3b8" />
        <span style={{ color: '#092c5c', fontWeight: 600 }}>{returnItem.taxYear} Engagement</span>
      </div>

      {/* Engagement Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#e8f1fb',
              display: 'grid',
              placeItems: 'center',
              color: '#092c5c',
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1
                style={{
                  fontSize: '21px',
                  fontWeight: 700,
                  color: '#092c5c',
                  margin: 0,
                  letterSpacing: '-0.3px',
                }}
              >
                {returnItem.taxpayerNameSnapshot} · {returnItem.taxYear} {returnItem.returnType}
              </h1>
              <span
                className={`tax-status ${returnItem.status.toLowerCase().replaceAll(' ', '-')}`}
                style={{ fontSize: '10px' }}
              >
                <i />
                {returnItem.status}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Filing Status: <b>{returnItem.filingStatusSnapshot}</b> · Assigned Preparer: <b>{returnItem.assignedStaff}</b>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href={`/clients/${returnItem.clientId}`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm">
              <UserRound size={13} />
              View Client Profile
            </Button>
          </Link>
        </div>
      </header>

      {/* 4 KPIs */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <article
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b' }}>Tax Year</span>
          <b style={{ display: 'block', fontSize: '20px', color: '#092c5c', margin: '4px 0 2px' }}>
            {returnItem.taxYear}
          </b>
          <small style={{ fontSize: '10px', color: '#94a3b8' }}>Annual return</small>
        </article>

        <article
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b' }}>Assigned Preparer</span>
          <b style={{ display: 'block', fontSize: '16px', color: '#092c5c', margin: '6px 0 2px' }}>
            {returnItem.assignedStaff}
          </b>
          <small style={{ fontSize: '10px', color: '#94a3b8' }}>Office preparer</small>
        </article>

        <article
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b' }}>Preparation Fee</span>
          <b style={{ display: 'block', fontSize: '20px', color: '#092c5c', margin: '4px 0 2px' }}>
            ${returnItem.preparationFee.toLocaleString()}
          </b>
          <small style={{ fontSize: '10px', color: '#94a3b8' }}>Engagement total</small>
        </article>

        <article
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 18px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b' }}>Balance Remaining</span>
          <b
            style={{
              display: 'block',
              fontSize: '20px',
              color: returnItem.balance > 0 ? '#dc2626' : '#16a34a',
              margin: '4px 0 2px',
            }}
          >
            ${returnItem.balance.toLocaleString()}
          </b>
          <small style={{ fontSize: '10px', color: '#94a3b8' }}>
            {returnItem.balance === 0 ? 'Paid in full' : 'Due upon filing'}
          </small>
        </article>
      </section>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Filing Snapshot Card */}
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '18px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileCheck size={16} color="#092c5c" />
            <b style={{ fontSize: '13px', color: '#092c5c' }}>Historical Filing Snapshot</b>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Taxpayer Name at Filing</span>
              <b>{returnItem.taxpayerNameSnapshot}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Address at Filing</span>
              <b>{returnItem.addressSnapshot}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Filing Status at Filing</span>
              <b>{returnItem.filingStatusSnapshot}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Return Form</span>
              <b>{returnItem.returnType}</b>
            </div>
          </div>
        </section>

        {/* Financial & Notes Card */}
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '18px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <CircleDollarSign size={16} color="#092c5c" />
            <b style={{ fontSize: '13px', color: '#092c5c' }}>Financials & Case Notes</b>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Federal Tax Due</span>
              <b>${returnItem.federalTaxAmount.toLocaleString()}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Preparation Fee</span>
              <b>${returnItem.preparationFee.toLocaleString()}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Amount Paid</span>
              <b style={{ color: '#16a34a' }}>${returnItem.amountPaid.toLocaleString()}</b>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
              <span style={{ color: '#64748b' }}>Internal Notes:</span>
              <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                {returnItem.internalNotes || 'No notes for this return.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
