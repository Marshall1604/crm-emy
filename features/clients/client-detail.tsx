'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FilePlus,
  FileSpreadsheet,
  FileText,
  FileUp,
  FolderOpen,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  UserRound,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  type PermanentClient,
  type TaxReturnEngagement,
  type ClientDocument,
  type ClientNote,
  type ClientActivity,
  initialClientsList,
  initialTaxReturnsList,
} from './client-store';

const tabs = ['Overview', 'Tax Returns', 'Documents', 'Notes', 'Activity'] as const;
type Tab = typeof tabs[number];

const returnTypes = ['Form 1040', 'Form 1040-SR', 'Form 1040-NR', 'Form 1040-X'];
const filingStatuses = [
  'Single',
  'Married Filing Jointly',
  'Married Filing Separately',
  'Head of Household',
  'Qualifying Surviving Spouse',
  'Nonresident Alien (Single)',
  'Nonresident Alien (Married)',
];
const statuses = [
  'New',
  'Waiting Documents',
  'Documents Received',
  'In Preparation',
  'Missing Information',
  'Review',
  'Signature Pending',
  'Ready to File',
  'E-Filed',
  'Accepted',
  'Rejected',
  'Extension Filed',
  'Completed',
];
const staffMembers = ['Amy Tran', 'Daniel Lee', 'Sarah Kim'];
const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

const selectClass =
  'h-9 w-full rounded-md border border-[#d9e0e7] bg-white px-3 text-xs text-[#263142] outline-none focus:border-[#4b7ead] focus:ring-2 focus:ring-[#2b69a5]/10';

export function ClientDetail({ id }: { id: string }) {
  // 1. Permanent Client Profile State
  const clientInitial =
    initialClientsList.find((c) => c.id === id) || {
      id,
      firstName: id.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Client',
      lastName: '',
      name: id.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Client Name',
      ssnOrItin: '555-01-2345',
      dateOfBirth: '1990-01-01',
      phone: '(555) 000-0000',
      email: `${id}@example.com`,
      address: '100 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      filingStatusDefault: 'Single',
      createdAt: 'Jan 10, 2024',
      updatedAt: 'Aug 29, 2026',
    };

  const [client, setClient] = useState<PermanentClient>(clientInitial);
  const [showFullSsn, setShowFullSsn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  // 2. Yearly Tax Returns for this Client (Ordered by newest year first)
  const [returnsList, setReturnsList] = useState<TaxReturnEngagement[]>(() => {
    const list = initialTaxReturnsList.filter((r) => r.clientId === id);
    if (!list.length) {
      return [
        {
          id: `tr-${id}-2026`,
          clientId: id,
          taxYear: '2026',
          returnType: 'Form 1040',
          filingStatus: clientInitial.filingStatusDefault || 'Single',
          status: 'Waiting Documents',
          assignedStaff: 'Amy Tran',
          federalTaxAmount: 0,
          preparationFee: 650,
          amountPaid: 0,
          balance: 650,
          internalNotes: 'Annual engagement opened.',
          taxpayerNameSnapshot: clientInitial.name,
          addressSnapshot: `${clientInitial.address}, ${clientInitial.city}, ${clientInitial.state} ${clientInitial.zipCode}`,
          filingStatusSnapshot: clientInitial.filingStatusDefault || 'Single',
          createdAt: 'Aug 01, 2026',
          updatedAt: 'Aug 29, 2026',
        },
      ];
    }
    return list.sort((a, b) => Number(b.taxYear) - Number(a.taxYear));
  });

  // 3. Documents, Notes, Activity State
  const [documents, setDocuments] = useState<ClientDocument[]>([
    { id: 'doc-1', name: '2026_W2_Statement.pdf', size: '420 KB', type: 'PDF', taxYear: '2026', updatedAt: 'Aug 20, 2026' },
    { id: 'doc-2', name: '2025_Form1040_Final_Client_Copy.pdf', size: '1.2 MB', type: 'PDF', taxYear: '2025', updatedAt: 'Apr 12, 2025' },
    { id: 'doc-3', name: 'Identity_Verification_DriverLicense.pdf', size: '850 KB', type: 'PDF', updatedAt: 'Jan 10, 2024' },
  ]);

  const [notes, setNotes] = useState<ClientNote[]>([
    { id: 'n-1', author: 'Amy Tran', content: 'Client confirmed they will upload 1099-NEC next week.', taxYear: '2026', createdAt: 'Aug 25, 2026' },
    { id: 'n-2', author: 'Daniel Lee', content: '2025 IRS e-file accepted with standard deduction.', taxYear: '2025', createdAt: 'Apr 12, 2025' },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // 4. Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<PermanentClient>(client);

  const [isNewReturnOpen, setIsNewReturnOpen] = useState(false);
  const [newReturnForm, setNewReturnForm] = useState<{
    taxYear: string;
    returnType: string;
    filingStatus: string;
    status: string;
    assignedStaff: string;
    federalTaxAmount: number;
    preparationFee: number;
    amountPaid: number;
    internalNotes: string;
  }>({
    taxYear: '2027',
    returnType: 'Form 1040',
    filingStatus: client.filingStatusDefault || 'Single',
    status: 'New',
    assignedStaff: 'Amy Tran',
    federalTaxAmount: 0,
    preparationFee: 650,
    amountPaid: 0,
    internalNotes: '',
  });

  // Document Upload State
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [uploadDocForm, setUploadDocForm] = useState<{
    taxYear: string;
    customName: string;
    selectedFile: File | null;
    fileSize: string;
    fileUrl: string;
  }>({
    taxYear: '2026',
    customName: '',
    selectedFile: null,
    fileSize: '',
    fileUrl: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadDocument = (doc: ClientDocument) => {
    if (doc.fileUrl) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloading "${doc.name}"`);
      return;
    }

    // Generate downloadable placeholder PDF for default mock records
    const pdfHeader = `%PDF-1.4\n1 0 obj\n<< /Title (${doc.name}) /Author (Tax CRM) >>\nendobj\n2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n3 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n4 0 obj\n<< /Type /Page /Parent 3 0 R /Resources <<>> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n5 0 obj\n<< /Length 75 >>\nstream\nBT\n/F1 14 Tf\n50 720 Td\n(CRM Emy - Document: ${doc.name}) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000079 00000 n\n0000000136 00000 n\n0000000201 00000 n\n0000000302 00000 n\ntrailer\n<< /Size 6 /Root 2 0 R >>\nstartxref\n428\n%%EOF`;
    const blob = new Blob([pdfHeader], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name.endsWith('.pdf') ? doc.name : `${doc.name}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloading "${doc.name}"`);
  };

  const handleOpenUploadDoc = () => {
    setUploadDocForm({
      taxYear: returnsList[0]?.taxYear || '2026',
      customName: '',
      selectedFile: null,
      fileSize: '',
      fileUrl: '',
    });
    setIsUploadDocOpen(true);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    const fileUrl = URL.createObjectURL(file);

    setUploadDocForm((prev) => ({
      ...prev,
      selectedFile: file,
      customName: prev.customName || file.name,
      fileSize: sizeStr,
      fileUrl,
    }));
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocForm.selectedFile && !uploadDocForm.customName) {
      showToast('Please select a PDF file');
      return;
    }

    const name = uploadDocForm.customName.trim() || uploadDocForm.selectedFile?.name || 'Document.pdf';
    const finalName = name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newDoc: ClientDocument = {
      id: `doc-${Date.now()}`,
      name: finalName,
      size: uploadDocForm.fileSize || '150 KB',
      type: 'PDF',
      taxYear: uploadDocForm.taxYear,
      updatedAt: formattedDate,
      fileUrl: uploadDocForm.fileUrl,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setIsUploadDocOpen(false);
    showToast(`Document "${finalName}" uploaded successfully!`);
  };

  const handleDeleteDocument = (id: string, name: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast(`Removed "${name}"`);
  };

  // Formatter helpers
  const formatSsn = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 9);
    if (d.length > 5) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
    if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return d;
  };
  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 10);
    if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    if (d.length > 0) return `(${d}`;
    return d;
  };

  // Profile Save
  const handleOpenEditProfile = () => {
    setProfileForm({
      ...client,
      workflowStatus: latestReturn?.status,
      assignedStaff: latestReturn?.assignedStaff,
    });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const computedName = profileForm.lastName
      ? `${profileForm.firstName} ${profileForm.lastName}`
      : profileForm.firstName;

    const updated: PermanentClient = {
      ...profileForm,
      name: computedName,
      updatedAt: 'Aug 29, 2026',
    };
    setClient(updated);

    // Also apply workflow status / staff changes to the latest engagement
    if (profileForm.workflowStatus || profileForm.assignedStaff) {
      setReturnsList((prev) =>
        prev.map((r, i) =>
          i === 0
            ? {
                ...r,
                ...(profileForm.workflowStatus ? { status: profileForm.workflowStatus } : {}),
                ...(profileForm.assignedStaff ? { assignedStaff: profileForm.assignedStaff } : {}),
                updatedAt: 'Aug 29, 2026',
              }
            : r
        )
      );
    }

    // Clear temp fields
    setProfileForm((prev) => ({ ...prev, workflowStatus: undefined, assignedStaff: undefined }));

    setIsEditProfileOpen(false);
    showToast('Client profile updated (Historical tax returns preserved)');
  };

  // New Tax Return Handler
  const handleOpenNewReturn = () => {
    // Find next year
    const existingYears = returnsList.map((r) => Number(r.taxYear)).filter((n) => !isNaN(n));
    const highestYear = existingYears.length ? Math.max(...existingYears) : 2025;
    const nextYear = String(highestYear + 1);

    setNewReturnForm({
      taxYear: nextYear,
      returnType: 'Form 1040',
      filingStatus: client.filingStatusDefault || 'Single',
      status: 'New',
      assignedStaff: 'Amy Tran',
      federalTaxAmount: 0,
      preparationFee: 650,
      amountPaid: 0,
      internalNotes: `Year ${nextYear} tax return engagement created.`,
    });
    setIsNewReturnOpen(true);
  };

  const handleSaveNewReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = Math.max(0, Number(newReturnForm.preparationFee) - Number(newReturnForm.amountPaid));

    // Create filing snapshot of current client profile
    const newEngagement: TaxReturnEngagement = {
      id: `tr-${client.id}-${newReturnForm.taxYear}-${Date.now().toString().slice(-4)}`,
      clientId: client.id,
      taxYear: newReturnForm.taxYear,
      returnType: newReturnForm.returnType,
      filingStatus: newReturnForm.filingStatus,
      status: newReturnForm.status,
      assignedStaff: newReturnForm.assignedStaff,
      federalTaxAmount: Number(newReturnForm.federalTaxAmount),
      preparationFee: Number(newReturnForm.preparationFee),
      amountPaid: Number(newReturnForm.amountPaid),
      balance,
      internalNotes: newReturnForm.internalNotes,
      createdAt: 'Aug 29, 2026',
      updatedAt: 'Aug 29, 2026',

      // Historical Snapshots
      taxpayerNameSnapshot: client.name,
      addressSnapshot: `${client.address}, ${client.city}, ${client.state} ${client.zipCode}`,
      filingStatusSnapshot: newReturnForm.filingStatus,
    };

    setReturnsList((prev) => [newEngagement, ...prev].sort((a, b) => Number(b.taxYear) - Number(a.taxYear)));
    setIsNewReturnOpen(false);
    showToast(`Tax Return for ${newReturnForm.taxYear} created successfully!`);
  };

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const note: ClientNote = {
      id: `note-${Date.now()}`,
      author: 'Amy Tran',
      content: newNoteText.trim(),
      taxYear: returnsList[0]?.taxYear || '2026',
      createdAt: 'Aug 29, 2026',
    };
    setNotes((prev) => [note, ...prev]);
    setNewNoteText('');
    showToast('Note added');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted');
  };

  // Summary Metrics
  const totalFees = useMemo(() => returnsList.reduce((sum, r) => sum + r.preparationFee, 0), [returnsList]);
  const totalBalance = useMemo(() => returnsList.reduce((sum, r) => sum + r.balance, 0), [returnsList]);
  const latestReturn = returnsList[0];

  const maskedSsn = (raw: string) => {
    if (!raw) return 'None';
    if (showFullSsn) return raw;
    const parts = raw.split('-');
    if (parts.length === 3) return `***-**-${parts[2]}`;
    return `***-**-${raw.slice(-4)}`;
  };

  return (
    <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 28px 48px' }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          <Link
            href="/clients"
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
            Clients
          </Link>
          <ChevronRight size={12} color="#94a3b8" />
          <span style={{ color: '#092c5c', fontWeight: 600 }}>{client.name}</span>
        </div>

        {toastMessage && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '6px',
            }}
          >
            <CheckCircle2 size={13} />
            {toastMessage}
          </div>
        )}
      </div>

      {/* Permanent Client Profile Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '18px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#092c5c',
                  margin: 0,
                  letterSpacing: '-0.3px',
                }}
              >
                {client.name}
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                <UserCheck size={12} color="#0284c7" />
                Permanent Individual Client
              </span>
            </div>

            {/* Permanent Identity Strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '16px',
                fontSize: '12px',
                color: '#64748b',
                marginTop: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={14} color="#092c5c" />
                <span>SSN/ITIN:</span>
                <b style={{ color: '#092c5c', letterSpacing: '0.3px' }}>{maskedSsn(client.ssnOrItin)}</b>
                <button
                  type="button"
                  onClick={() => setShowFullSsn(!showFullSsn)}
                  style={{
                    background: 'none',
                    border: 0,
                    padding: 0,
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'inline-flex',
                    marginLeft: '2px',
                  }}
                  title={showFullSsn ? 'Hide SSN' : 'Show SSN'}
                >
                  {showFullSsn ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} color="#64748b" />
                <span>DOB:</span>
                <b style={{ color: '#1e293b' }}>{client.dateOfBirth || 'N/A'}</b>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} color="#64748b" />
                <b style={{ color: '#1e293b' }}>{client.phone}</b>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} color="#64748b" />
                <b style={{ color: '#1e293b' }}>{client.email}</b>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} color="#64748b" />
                <span style={{ color: '#334155' }}>
                  {client.address}, {client.city}, {client.state} {client.zipCode}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              onClick={handleOpenEditProfile}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '36px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Pencil size={13} />
              Edit Client Profile
            </Button>
            <Button
              onClick={handleOpenNewReturn}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '36px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Plus size={14} />
              + New Tax Return
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '20px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          let countBadge = null;
          if (tab === 'Tax Returns') countBadge = returnsList.length;
          if (tab === 'Documents') countBadge = documents.length;
          if (tab === 'Notes') countBadge = notes.length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#092c5c' : '#64748b',
                background: 'none',
                border: 0,
                borderBottom: isActive ? '2px solid #092c5c' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              <span>{tab}</span>
              {countBadge !== null && (
                <span
                  style={{
                    backgroundColor: isActive ? '#e8f1fb' : '#f1f5f9',
                    color: isActive ? '#092c5c' : '#64748b',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  {countBadge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div>
          {/* Summary KPIs */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <KpiCard
              label="Active Tax Year"
              value={latestReturn?.taxYear || 'None'}
              icon={<CalendarDays size={16} color="#092c5c" />}
              sub={latestReturn ? `Status: ${latestReturn.status}` : 'No active return'}
            />
            <KpiCard
              label="Total Return History"
              value={`${returnsList.length} Years`}
              icon={<ClipboardList size={16} color="#0284c7" />}
              sub="Multi-year engagements"
            />
            <KpiCard
              label="Lifetime Preparation Fees"
              value={`$${totalFees.toLocaleString()}`}
              icon={<ReceiptText size={16} color="#0284c7" />}
              sub="All historical returns"
            />
            <KpiCard
              label="Current Balance Due"
              value={`$${totalBalance.toLocaleString()}`}
              isBalance
              isZero={totalBalance === 0}
              icon={<CircleDollarSign size={16} color={totalBalance ? '#dc2626' : '#16a34a'} />}
              sub={totalBalance === 0 ? 'All returns fully paid' : 'Total unpaid balance'}
            />
          </section>

          {/* 2-Column Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            {/* Latest Engagement Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '18px 20px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSpreadsheet size={16} color="#092c5c" />
                  <b style={{ fontSize: '13px', color: '#092c5c' }}>
                    Latest Engagement: {latestReturn?.taxYear} ({latestReturn?.returnType})
                  </b>
                </div>
                {latestReturn && (
                  <Link
                    href={`/tax-returns/${latestReturn.id}`}
                    style={{
                      fontSize: '11px',
                      color: '#0284c7',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    View Return Details →
                  </Link>
                )}
              </div>

              {latestReturn ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                      <small style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Filing Status</small>
                      <b style={{ fontSize: '12px', color: '#1e293b' }}>{latestReturn.filingStatus}</b>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                      <small style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Workflow Status</small>
                      <select
                        value={latestReturn.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setReturnsList((prev) =>
                            prev.map((r, i) => i === 0 ? { ...r, status: newStatus, updatedAt: 'Aug 29, 2026' } : r)
                          );
                          showToast(`Status updated to "${newStatus}"`);
                        }}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#092c5c',
                          cursor: 'pointer',
                          outline: 'none',
                          padding: 0,
                        }}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                      <small style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Assigned Staff</small>
                      <b style={{ fontSize: '12px', color: '#1e293b' }}>{latestReturn.assignedStaff}</b>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                    <b>Historical Snapshot at Filing:</b> Name: <i>{latestReturn.taxpayerNameSnapshot}</i> · Address: <i>{latestReturn.addressSnapshot}</i>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: '#64748b' }}>No tax returns recorded yet.</p>
              )}
            </div>

            {/* Quick Contact Info */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '18px 20px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <b style={{ fontSize: '13px', color: '#092c5c' }}>Permanent Identity & Address</b>
                <button
                  type="button"
                  onClick={handleOpenEditProfile}
                  style={{
                    background: 'none',
                    border: 0,
                    color: '#0284c7',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Edit Profile
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Client ID</span>
                  <b style={{ color: '#1e293b' }}>{client.id}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Date of Birth</span>
                  <b style={{ color: '#1e293b' }}>{client.dateOfBirth}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Phone</span>
                  <b style={{ color: '#1e293b' }}>{client.phone}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Email</span>
                  <b style={{ color: '#1e293b' }}>{client.email}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Client Since</span>
                  <b style={{ color: '#1e293b' }}>{client.createdAt}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TAX RETURNS HISTORY */}
      {activeTab === 'Tax Returns' && (
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          }}
        >
          <header
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <b style={{ fontSize: '13px', color: '#092c5c' }}>Tax Return Engagements</b>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>
                Multi-year filing history for {client.name} (Ordered newest year first)
              </p>
            </div>
            <Button size="sm" onClick={handleOpenNewReturn}>
              <Plus size={13} />
              + New Tax Return
            </Button>
          </header>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
              <thead>
                <tr style={{ height: '36px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ paddingLeft: '18px', textAlign: 'left', fontSize: '10px', color: '#64748b' }}>TAX YEAR</th>
                  <th style={{ textAlign: 'left', fontSize: '10px', color: '#64748b' }}>RETURN TYPE</th>
                  <th style={{ textAlign: 'left', fontSize: '10px', color: '#64748b' }}>FILING STATUS</th>
                  <th style={{ textAlign: 'left', fontSize: '10px', color: '#64748b' }}>STATUS</th>
                  <th style={{ textAlign: 'left', fontSize: '10px', color: '#64748b' }}>ASSIGNED STAFF</th>
                  <th style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>FEE</th>
                  <th style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>PAID</th>
                  <th style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>BALANCE</th>
                  <th style={{ textAlign: 'left', paddingLeft: '16px', fontSize: '10px', color: '#64748b' }}>LAST UPDATED</th>
                  <th style={{ width: '80px', textAlign: 'center', fontSize: '10px', color: '#64748b' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {returnsList.map((r) => (
                  <tr
                    key={r.id}
                    style={{
                      height: '56px',
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '12px',
                      color: '#334155',
                    }}
                  >
                    <td style={{ paddingLeft: '18px' }}>
                      <Link
                        href={`/tax-returns/${r.id}`}
                        style={{
                          textDecoration: 'none',
                          color: '#092c5c',
                          fontWeight: 700,
                          fontSize: '13px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CalendarDays size={14} color="#092c5c" />
                        {r.taxYear}
                      </Link>
                    </td>
                    <td>
                      <span className="client-return" style={{ fontSize: '11px' }}>
                        {r.returnType}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', color: '#475569' }}>{r.filingStatus}</span>
                    </td>
                    <td>
                      <span
                        className={`tax-status ${r.status.toLowerCase().replaceAll(' ', '-')}`}
                        style={{ fontSize: '10px' }}
                      >
                        <i />
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <span className="staff-mini">
                        {r.assignedStaff
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                      <span style={{ fontSize: '11px' }}>{r.assignedStaff}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      ${r.preparationFee.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: '#16a34a' }}>
                      ${r.amountPaid.toLocaleString()}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        color: r.balance > 0 ? '#dc2626' : '#16a34a',
                      }}
                    >
                      ${r.balance.toLocaleString()}
                    </td>
                    <td style={{ paddingLeft: '16px', fontSize: '11px', color: '#64748b' }}>
                      {r.updatedAt}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link
                        href={`/tax-returns/${r.id}`}
                        style={{
                          textDecoration: 'none',
                          color: '#0284c7',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#f0f9ff',
                        }}
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: DOCUMENTS */}
      {activeTab === 'Documents' && (
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderOpen size={16} color="#092c5c" />
              <b style={{ fontSize: '13px', color: '#092c5c' }}>Client Tax Documents</b>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 600,
                }}
              >
                {documents.length} files
              </span>
            </div>
            <Button size="sm" onClick={handleOpenUploadDoc} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={13} />
              Upload Document
            </Button>
          </div>

          {documents.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
              }}
            >
              <FileUp size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
              <b style={{ fontSize: '13px', color: '#475569', display: 'block' }}>No documents uploaded yet</b>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 12px' }}>
                Upload W-2, 1099, client IDs, or previous year tax returns in PDF format.
              </p>
              <Button size="sm" variant="outline" onClick={handleOpenUploadDoc}>
                <Upload size={13} /> Upload First PDF
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: '#e0f2fe',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#0284c7',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <b style={{ fontSize: '12px', color: '#1e293b' }}>{doc.name}</b>
                      <small style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>
                        {doc.size} · Tax Year: <span style={{ fontWeight: 600, color: '#092c5c' }}>{doc.taxYear || 'General'}</span> · Updated: {doc.updatedAt}
                      </small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(doc)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}
                    >
                      <Download size={13} />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id, doc.name)}
                      style={{ color: '#ef4444', padding: '0 8px' }}
                      title="Remove document"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 4: NOTES */}
      {activeTab === 'Notes' && (
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          }}
        >
          <b style={{ fontSize: '13px', color: '#092c5c', display: 'block', marginBottom: '12px' }}>
            Client & Engagement Notes
          </b>

          {/* Add Note Input */}
          <form onSubmit={handleAddNote} style={{ marginBottom: '20px' }}>
            <Textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Add an internal note about this client or their returns..."
              rows={2}
              style={{ marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" size="sm">
                Add Note
              </Button>
            </div>
          </form>

          {notes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
                color: '#94a3b8',
                fontSize: '12px',
              }}
            >
              <MessageSquare size={28} color="#94a3b8" style={{ margin: '0 auto 6px' }} />
              No notes recorded yet for this client.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notes.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                      {n.content}
                    </p>
                    <small style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {n.author} · Tax Year: <span style={{ fontWeight: 600, color: '#092c5c' }}>{n.taxYear}</span> · {n.createdAt}
                    </small>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(n.id)}
                    style={{
                      color: '#ef4444',
                      padding: '4px 8px',
                      height: '28px',
                      flexShrink: 0,
                    }}
                    title="Delete note"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 5: ACTIVITY */}
      {activeTab === 'Activity' && (
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          }}
        >
          <b style={{ fontSize: '13px', color: '#092c5c', display: 'block', marginBottom: '14px' }}>
            Audit & Timeline History
          </b>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7', marginTop: '5px' }} />
              <div>
                <b>2026 Tax Return Engagement Opened</b>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>Status set to Waiting Documents by Amy Tran</p>
                <small style={{ fontSize: '10px', color: '#94a3b8' }}>Aug 01, 2026</small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', marginTop: '5px' }} />
              <div>
                <b>2025 Form 1040 Completed & E-Filed</b>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>Fee $600 paid in full. Client copy delivered.</p>
                <small style={{ fontSize: '10px', color: '#94a3b8' }}>Apr 12, 2025</small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b', marginTop: '5px' }} />
              <div>
                <b>Client Profile Created</b>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>Minh Nguyen added as permanent individual client.</p>
                <small style={{ fontSize: '10px', color: '#94a3b8' }}>Jan 10, 2024</small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODAL 1: EDIT PERMANENT CLIENT PROFILE */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent
          className="max-w-2xl"
          style={{
            maxWidth: '680px',
            padding: 0,
            borderRadius: '14px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              height: '60px',
              padding: '0 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#e8f1fb',
                display: 'grid',
                placeItems: 'center',
                color: '#092c5c',
              }}
            >
              <Pencil size={16} />
            </div>
            <div>
              <DialogTitle style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#092c5c' }}>
                Edit Permanent Client Profile: {client.name}
              </DialogTitle>
              <DialogDescription style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                Modifying permanent identity does not alter historical tax return snapshots.
              </DialogDescription>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div
              style={{
                maxHeight: 'calc(80vh - 120px)',
                overflowY: 'auto',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                backgroundColor: '#fafbfc',
              }}
            >
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <b style={{ fontSize: '12px', color: '#092c5c', display: 'block', marginBottom: '10px' }}>
                  Personal Identity
                </b>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <Label style={{ fontSize: '11px' }}>First Name *</Label>
                    <Input
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Middle Name</Label>
                    <Input
                      value={profileForm.middleName || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, middleName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Last Name *</Label>
                    <Input
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>SSN / ITIN *</Label>
                    <Input
                      value={profileForm.ssnOrItin}
                      onChange={(e) => setProfileForm({ ...profileForm, ssnOrItin: formatSsn(e.target.value) })}
                      maxLength={11}
                      required
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Date of Birth</Label>
                    <Input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Default Filing Status</Label>
                    <select
                      className={selectClass}
                      value={profileForm.filingStatusDefault || 'Single'}
                      onChange={(e) => setProfileForm({ ...profileForm, filingStatusDefault: e.target.value })}
                    >
                      {filingStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <b style={{ fontSize: '12px', color: '#092c5c', display: 'block', marginBottom: '10px' }}>
                  Contact & Mailing Address
                </b>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Phone Number *</Label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: formatPhone(e.target.value) })}
                      required
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <Label style={{ fontSize: '11px' }}>Email Address</Label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 3' }}>
                    <Label style={{ fontSize: '11px' }}>Street Address *</Label>
                    <Input
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>City *</Label>
                    <Input
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>State *</Label>
                    <select
                      className={selectClass}
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    >
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>ZIP Code *</Label>
                    <Input
                      value={profileForm.zipCode}
                      onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Workflow Status for Latest Engagement */}
              {latestReturn && (
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                  <b style={{ fontSize: '12px', color: '#092c5c', display: 'block', marginBottom: '10px' }}>
                    Workflow Status — {latestReturn.taxYear} Engagement
                  </b>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <Label style={{ fontSize: '11px' }}>Workflow Status</Label>
                      <select
                        className={selectClass}
                        value={profileForm.workflowStatus ?? latestReturn.status}
                        onChange={(e) => setProfileForm({ ...profileForm, workflowStatus: e.target.value })}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label style={{ fontSize: '11px' }}>Assigned Staff</Label>
                      <select
                        className={selectClass}
                        value={profileForm.assignedStaff ?? latestReturn.assignedStaff}
                        onChange={(e) => setProfileForm({ ...profileForm, assignedStaff: e.target.value })}
                      >
                        {staffMembers.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                height: '56px',
                padding: '0 20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Profile
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: + NEW TAX RETURN FOR THIS CLIENT */}
      <Dialog open={isNewReturnOpen} onOpenChange={setIsNewReturnOpen}>
        <DialogContent
          className="max-w-2xl"
          style={{
            maxWidth: '680px',
            padding: 0,
            borderRadius: '14px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              height: '60px',
              padding: '0 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#e0f2fe',
                display: 'grid',
                placeItems: 'center',
                color: '#0284c7',
              }}
            >
              <Plus size={16} />
            </div>
            <div>
              <DialogTitle style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#092c5c' }}>
                New Yearly Tax Return for {client.name}
              </DialogTitle>
              <DialogDescription style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                Creates a new annual tax filing engagement and snapshots current client identity.
              </DialogDescription>
            </div>
          </div>

          <form onSubmit={handleSaveNewReturn}>
            <div
              style={{
                maxHeight: 'calc(80vh - 120px)',
                overflowY: 'auto',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                backgroundColor: '#fafbfc',
              }}
            >
              {/* Snapshot confirmation notice */}
              <div
                style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '11px',
                  color: '#0369a1',
                }}
              >
                <b>Identity Preserved:</b> This return will snapshot <b>{client.name}</b> (SSN: {client.ssnOrItin}, Address: {client.address}) for historical accuracy without re-prompting.
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <b style={{ fontSize: '12px', color: '#092c5c', display: 'block', marginBottom: '10px' }}>
                  Filing Year & Engagement Specifications
                </b>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Tax Year *</Label>
                    <select
                      className={selectClass}
                      value={newReturnForm.taxYear}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, taxYear: e.target.value })}
                    >
                      {['2027', '2026', '2025', '2024', '2023', '2022'].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Return Type *</Label>
                    <select
                      className={selectClass}
                      value={newReturnForm.returnType}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, returnType: e.target.value })}
                    >
                      {returnTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Filing Status *</Label>
                    <select
                      className={selectClass}
                      value={newReturnForm.filingStatus}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, filingStatus: e.target.value })}
                    >
                      {filingStatuses.map((fs) => (
                        <option key={fs} value={fs}>
                          {fs}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Workflow Status *</Label>
                    <select
                      className={selectClass}
                      value={newReturnForm.status}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, status: e.target.value })}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <Label style={{ fontSize: '11px' }}>Assigned Staff *</Label>
                    <select
                      className={selectClass}
                      value={newReturnForm.assignedStaff}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, assignedStaff: e.target.value })}
                    >
                      {staffMembers.map((sm) => (
                        <option key={sm} value={sm}>
                          {sm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <b style={{ fontSize: '12px', color: '#092c5c', display: 'block', marginBottom: '10px' }}>
                  Fees & Internal Notes
                </b>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Federal Tax Due ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newReturnForm.federalTaxAmount}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, federalTaxAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Preparation Fee ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newReturnForm.preparationFee}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, preparationFee: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Amount Paid ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newReturnForm.amountPaid}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, amountPaid: Number(e.target.value) })}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 3' }}>
                    <Label style={{ fontSize: '11px' }}>Engagement Notes</Label>
                    <Textarea
                      value={newReturnForm.internalNotes}
                      onChange={(e) => setNewReturnForm({ ...newReturnForm, internalNotes: e.target.value })}
                      placeholder="Notes for this yearly tax return engagement..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                height: '56px',
                padding: '0 20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNewReturnOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Create Tax Return
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: UPLOAD CLIENT TAX DOCUMENT */}
      <Dialog open={isUploadDocOpen} onOpenChange={setIsUploadDocOpen}>
        <DialogContent
          className="max-w-xl"
          style={{
            maxWidth: '560px',
            padding: 0,
            borderRadius: '14px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              height: '60px',
              padding: '0 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#e0f2fe',
                display: 'grid',
                placeItems: 'center',
                color: '#0284c7',
              }}
            >
              <Upload size={16} />
            </div>
            <div>
              <DialogTitle style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#092c5c' }}>
                Upload Tax Document for {client.name}
              </DialogTitle>
              <DialogDescription style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                Upload PDF files such as W-2, 1099, client ID, or tax return files.
              </DialogDescription>
            </div>
          </div>

          <form onSubmit={handleSaveDocument}>
            <div
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                backgroundColor: '#fafbfc',
              }}
            >
              {/* File Dropzone */}
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf,.pdf"
                onChange={handleFileSelected}
                style={{ display: 'none' }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #93c5fd',
                  borderRadius: '10px',
                  backgroundColor: uploadDocForm.selectedFile ? '#f0fdf4' : '#eff6ff',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {uploadDocForm.selectedFile ? (
                  <div>
                    <FileCheck2 size={36} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                    <b style={{ fontSize: '13px', color: '#166534', display: 'block' }}>
                      {uploadDocForm.selectedFile.name}
                    </b>
                    <span style={{ fontSize: '11px', color: '#15803d' }}>
                      {uploadDocForm.fileSize} · Click to change file
                    </span>
                  </div>
                ) : (
                  <div>
                    <FileUp size={36} color="#0284c7" style={{ margin: '0 auto 8px' }} />
                    <b style={{ fontSize: '13px', color: '#092c5c', display: 'block' }}>
                      Click to choose or browse PDF file
                    </b>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Supports .pdf documents up to 25 MB
                    </span>
                  </div>
                )}
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div>
                  <Label style={{ fontSize: '11px' }}>Document Name *</Label>
                  <Input
                    placeholder="e.g. 2026_W2_Statement.pdf"
                    value={uploadDocForm.customName}
                    onChange={(e) => setUploadDocForm({ ...uploadDocForm, customName: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <Label style={{ fontSize: '11px' }}>Tax Year Association</Label>
                    <select
                      className={selectClass}
                      value={uploadDocForm.taxYear}
                      onChange={(e) => setUploadDocForm({ ...uploadDocForm, taxYear: e.target.value })}
                    >
                      <option value="2027">2027</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="General">General / Identity</option>
                    </select>
                  </div>

                  <div>
                    <Label style={{ fontSize: '11px' }}>Document Type</Label>
                    <Input value="PDF Document" disabled style={{ backgroundColor: '#f8fafc', color: '#64748b' }} />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                height: '56px',
                padding: '0 20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadDocOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!uploadDocForm.customName && !uploadDocForm.selectedFile}>
                <Upload size={13} />
                Upload PDF
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  isBalance,
  isZero,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  isBalance?: boolean;
  isZero?: boolean;
}) {
  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px 18px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '94px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{label}</span>
        {icon}
      </div>
      <div style={{ margin: '6px 0 2px' }}>
        <b
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: isBalance ? (isZero ? '#16a34a' : '#dc2626') : '#092c5c',
          }}
        >
          {value}
        </b>
      </div>
      {sub && <small style={{ fontSize: '10px', color: '#94a3b8' }}>{sub}</small>}
    </article>
  );
}
