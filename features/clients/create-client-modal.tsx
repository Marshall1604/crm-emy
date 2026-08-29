'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';
import { CircleDollarSign, FileText, HeartHandshake, Plus, ReceiptText, Trash2, UserRound, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/lib/i18n/language-context';

export interface ClientRecord {
  // Summary / display
  id: string;
  name: string;
  initials: string;
  updated: string;

  // Primary taxpayer
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string;
  dob: string;
  filingStatus: string;
  phone: string;
  email: string;

  // Address
  address: string;
  city: string;
  state: string;
  zip: string;

  // Spouse (Married)
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseSsn?: string;
  spouseDob?: string;

  // Tax case & workflow
  year: string;
  returnType: string;
  status: string;
  staff: string;

  // Financials
  federalTax: number;
  fee: number;        // preparationFee
  amountPaid: number;
  balance: number;

  // State taxes
  stateTaxes: { state: string; amount: number }[];

  // Dependents / Additional Contacts
  dependents: {
    fullName: string;
    ssn: string;
    dob?: string;
    relationship: string;
    phone?: string;
    address?: string;
  }[];

  // Notes
  notes?: string;
}

const required = (label: string) => z.string().trim().min(1, `${label} is required`);
const money = z.coerce.number().min(0, 'Amount cannot be negative');

const clientSchema = z.object({
  firstName: required('First name'),
  middleName: z.string().optional(),
  lastName: required('Last name'),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'Use 000-00-0000 format'),
  dob: required('Date of birth'),
  filingStatus: required('Filing status'),
  phone: required('Phone number'),
  email: z.union([z.literal(''), z.string().email('Enter a valid email')]),
  address: required('Address'),
  city: required('City'),
  state: required('State'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code'),

  // Spouse info (optional, used when MFJ / MFS)
  spouseFirstName: z.string().optional(),
  spouseLastName: z.string().optional(),
  spouseSsn: z.string().optional(),
  spouseDob: z.string().optional(),

  // Tax case & workflow
  taxYear: required('Tax year'),
  returnType: required('Tax return type'),
  status: required('Status'),
  assignedStaff: required('Assigned staff'),

  // Financials
  federalTax: money,
  stateTaxes: z.array(z.object({ state: required('State'), amount: money })),
  preparationFee: money,
  amountPaid: money,
  notes: z.string().optional(),

  // Dependents / Additional Contacts
  dependents: z.array(z.object({
    fullName:     z.string().trim().min(1, 'Full name is required'),
    ssn:          z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'Use 000-00-0000 format').or(z.literal('')),
    dob:          z.string().optional(),
    relationship: z.string().min(1, 'Relationship is required'),
    phone:        z.string().optional(),
    address:      z.string().optional(),
  })),
});

type FormInput = z.input<typeof clientSchema>;
type FormValues = z.output<typeof clientSchema>;

const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

const staffMap: Record<string, string> = {
  'Amy Tran': 'Amy Tran',
  'Daniel Lee': 'Daniel Lee',
  'Sarah Kim': 'Sarah Kim',
};

const statusDisplayMap: Record<string, string> = {
  new: 'New',
  waiting_documents: 'Waiting Documents',
  documents_received: 'Documents Received',
  in_preparation: 'In Preparation',
  missing_information: 'Missing Information',
  review: 'Review',
  signature_pending: 'Signature Pending',
  ready_to_file: 'Ready to File',
  e_filed: 'E-Filed',
  accepted: 'Accepted',
  rejected: 'Rejected',
  extension_filed: 'Extension Filed',
  completed: 'Completed',
};

const selectClass = 'h-10 w-full rounded-md border border-[#d9e0e7] bg-white px-3 text-sm text-[#263142] outline-none focus:border-[#4b7ead] focus:ring-2 focus:ring-[#2b69a5]/10';

export function CreateClientModal({
  open,
  onOpenChange,
  onClientCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: (newClient: ClientRecord) => void;
}) {
  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      ssn: '',
      dob: '',
      filingStatus: 'single',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: 'CA',
      zip: '',
      spouseFirstName: '',
      spouseLastName: '',
      spouseSsn: '',
      spouseDob: '',
      taxYear: '2026',
      returnType: '1040',
      status: 'New',
      assignedStaff: 'Amy Tran',
      federalTax: 0,
      stateTaxes: [],
      preparationFee: 650,
      amountPaid: 0,
      notes: '',
      dependents: [],
    },
  });

  const stateTaxes = useFieldArray({ control: form.control, name: 'stateTaxes' });
  const dependents  = useFieldArray({ control: form.control, name: 'dependents' });
  const filingStatus = useWatch({ control: form.control, name: 'filingStatus' });
  const prep = useWatch({ control: form.control, name: 'preparationFee' }) || 0;
  const paid = useWatch({ control: form.control, name: 'amountPaid' }) || 0;
  const balance = Number(prep) - Number(paid);

  const formatSsn = (value: string) => {
    const d = value.replace(/\D/g, '').slice(0, 9);
    if (d.length > 5) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
    if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return d;
  };

  const formatPhone = (value: string) => {
    const d = value.replace(/\D/g, '').slice(0, 10);
    if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    if (d.length > 0) return `(${d}`;
    return d;
  };

  const submit = (values: FormValues) => {
    const fullName = values.spouseFirstName && values.filingStatus === 'married_jointly'
      ? `${values.firstName} & ${values.spouseFirstName} ${values.lastName}`
      : `${values.firstName} ${values.lastName}`;

    const initials = values.firstName && values.lastName
      ? `${values.firstName[0]}${values.lastName[0]}`.toUpperCase()
      : 'CL';

    const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newRecord: ClientRecord = {
      id: `${slug}-${Date.now().toString().slice(-4)}`,
      name: fullName,
      initials,
      updated: formattedDate,

      // Primary taxpayer
      firstName: values.firstName,
      middleName: values.middleName || '',
      lastName: values.lastName,
      ssn: values.ssn,
      dob: values.dob,
      filingStatus: values.filingStatus,
      phone: values.phone,
      email: values.email || `${slug}@example.com`,

      // Address
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,

      // Spouse
      spouseFirstName: values.spouseFirstName || '',
      spouseLastName: values.spouseLastName || '',
      spouseSsn: values.spouseSsn || '',
      spouseDob: values.spouseDob || '',

      // Tax case
      year: values.taxYear,
      returnType: values.returnType,
      status: values.status,
      staff: staffMap[values.assignedStaff] || values.assignedStaff,

      // Financials
      federalTax: Number(values.federalTax),
      fee: Number(values.preparationFee),
      amountPaid: Number(values.amountPaid),
      balance: Math.max(0, balance),

      // State taxes
      stateTaxes: values.stateTaxes,

      // Dependents
      dependents: values.dependents,

      // Notes
      notes: values.notes || '',
    };

    onClientCreated?.(newRecord);
    form.reset();
    onOpenChange(false);
  };

  const { language } = useLanguage();
  const isMarried = filingStatus === 'married_jointly' || filingStatus === 'married_separately';

  const statusDisplayMapVi: Record<string, string> = {
    'New': 'Mới tạo',
    'Waiting Documents': 'Chờ Giấy Tờ',
    'Documents Received': 'Đã Nhận Giấy Tờ',
    'In Preparation': 'Đang Soạn Hồ Sơ',
    'Missing Information': 'Thiếu Thông Tin',
    'Review': 'Đang Kiểm Tra',
    'Signature Pending': 'Chờ Ký Tên',
    'Ready to File': 'Sẵn Sàng Nộp',
    'E-Filed': 'Đã Nộp IRS',
    'Accepted': 'IRS Đã Chấp Nhận',
    'Rejected': 'IRS Từ Chối',
    'Extension Filed': 'Đã Xin Gia Hạn',
    'Completed': 'Đã Hoàn Tất',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="business-modal">
        <header className="modal-header">
          <div className="modal-heading-icon">
            <UserRound size={20} />
          </div>
          <div>
            <DialogTitle>
              {language === 'vi' ? 'Thêm Khách Hàng Cá Nhân Mới' : 'Add Individual Tax Client'}
            </DialogTitle>
            <DialogDescription>
              {language === 'vi'
                ? 'Khai báo thông tin cá nhân, tình trạng khai thuế, mẫu tờ khai 1040 và chi phí dịch vụ.'
                : 'Create taxpayer identity, filing status, return info, and fees.'}
            </DialogDescription>
          </div>
        </header>

        <form id="create-client-form" onSubmit={form.handleSubmit(submit)} className="modal-form">
          <div className="modal-scroll">
            {/* Primary Taxpayer Information */}
            <FormSection
              icon={<UserRound />}
              title={language === 'vi' ? 'Thông Tin Người Nộp Thuế' : 'Taxpayer Information'}
              description={
                language === 'vi'
                  ? 'Thông tin danh tính chính, số an sinh xã hội (SSN) và thông tin liên hệ.'
                  : 'Primary individual identity, SSN, and contact details.'
              }
            >
              <div className="modal-grid cols-4">
                <FormField label={language === 'vi' ? 'Tên' : 'First Name'} error={form.formState.errors.firstName?.message} required>
                  <Input placeholder={language === 'vi' ? 'Nhập tên' : 'First name'} {...form.register('firstName')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Tên đệm (M.I.)' : 'Middle Initial'}>
                  <Input placeholder="M.I." maxLength={5} {...form.register('middleName')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Họ' : 'Last Name'} error={form.formState.errors.lastName?.message} required span="span-2">
                  <Input placeholder={language === 'vi' ? 'Nhập họ' : 'Last name'} {...form.register('lastName')} />
                </FormField>

                <FormField label={language === 'vi' ? 'Số SSN' : 'SSN'} error={form.formState.errors.ssn?.message} required>
                  <Input
                    placeholder="000-00-0000"
                    autoComplete="off"
                    inputMode="numeric"
                    {...form.register('ssn')}
                    onChange={(e) => form.setValue('ssn', formatSsn(e.target.value), { shouldValidate: true })}
                  />
                </FormField>
                <FormField label={language === 'vi' ? 'Ngày Sinh' : 'Date of Birth'} error={form.formState.errors.dob?.message} required>
                  <Input type="date" {...form.register('dob')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Tình Trạng Khai Thuế' : 'Filing Status'} error={form.formState.errors.filingStatus?.message} required span="span-2">
                  <select className={selectClass} {...form.register('filingStatus')}>
                    <option value="single">{language === 'vi' ? 'Độc thân (Single)' : 'Single'}</option>
                    <option value="married_jointly">{language === 'vi' ? 'Vợ chồng khai chung (Married Filing Jointly)' : 'Married Filing Jointly'}</option>
                    <option value="married_separately">{language === 'vi' ? 'Vợ chồng khai riêng (Married Filing Separately)' : 'Married Filing Separately'}</option>
                    <option value="head_of_household">{language === 'vi' ? 'Chủ hộ gia đình (Head of Household)' : 'Head of Household'}</option>
                    <option value="qualifying_surviving_spouse">{language === 'vi' ? 'Góa phụ có người phụ thuộc (Qualifying Surviving Spouse)' : 'Qualifying Surviving Spouse'}</option>
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Số Điện Thoại' : 'Phone Number'} error={form.formState.errors.phone?.message} required>
                  <Input
                    type="tel"
                    placeholder="(555) 000-0000"
                    {...form.register('phone')}
                    onChange={(e) => form.setValue('phone', formatPhone(e.target.value), { shouldValidate: true })}
                  />
                </FormField>
                <FormField label="Email" error={form.formState.errors.email?.message} span="span-3">
                  <Input type="email" placeholder="client@example.com" {...form.register('email')} />
                </FormField>

                <FormField label={language === 'vi' ? 'Địa Chỉ Đường / Căn Hộ' : 'Street Address'} error={form.formState.errors.address?.message} required span="span-2">
                  <Input placeholder={language === 'vi' ? 'Số nhà, tên đường, căn hộ...' : '123 Main Street, Apt 4'} {...form.register('address')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Thành Phố' : 'City'} error={form.formState.errors.city?.message} required>
                  <Input placeholder={language === 'vi' ? 'Thành phố' : 'City'} {...form.register('city')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Tiểu Bang' : 'State'} error={form.formState.errors.state?.message} required>
                  <select className={selectClass} {...form.register('state')}>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label={language === 'vi' ? 'Mã Bưu Chính ZIP' : 'ZIP Code'} error={form.formState.errors.zip?.message} required>
                  <Input placeholder="90001" maxLength={10} {...form.register('zip')} />
                </FormField>
              </div>
            </FormSection>

            {/* Spouse Information (if Married) */}
            {isMarried && (
              <FormSection
                icon={<HeartHandshake />}
                title={language === 'vi' ? 'Thông Tin Vợ / Chồng' : 'Spouse Information'}
                description={
                  language === 'vi'
                    ? 'Thông tin người phối ngẫu cho hồ sơ khai chung (MFJ) hoặc khai riêng (MFS).'
                    : 'Spouse identity for Married Joint or Married Separate returns.'
                }
              >
                <div className="modal-grid cols-4">
                  <FormField label={language === 'vi' ? 'Tên Vợ / Chồng' : 'Spouse First Name'} span="span-2">
                    <Input placeholder={language === 'vi' ? 'Tên vợ / chồng' : 'Spouse first name'} {...form.register('spouseFirstName')} />
                  </FormField>
                  <FormField label={language === 'vi' ? 'Họ Vợ / Chồng' : 'Spouse Last Name'} span="span-2">
                    <Input placeholder={language === 'vi' ? 'Họ vợ / chồng' : 'Spouse last name'} {...form.register('spouseLastName')} />
                  </FormField>
                  <FormField label={language === 'vi' ? 'Số SSN Vợ / Chồng' : 'Spouse SSN'}>
                    <Input
                      placeholder="000-00-0000"
                      autoComplete="off"
                      inputMode="numeric"
                      {...form.register('spouseSsn')}
                      onChange={(e) => form.setValue('spouseSsn', formatSsn(e.target.value))}
                    />
                  </FormField>
                  <FormField label={language === 'vi' ? 'Ngày Sinh Vợ / Chồng' : 'Spouse Date of Birth'}>
                    <Input type="date" {...form.register('spouseDob')} />
                  </FormField>
                </div>
              </FormSection>
            )}

            {/* Tax Case & Workflow */}
            <FormSection
              icon={<FileText />}
              title={language === 'vi' ? 'Hồ Sơ Khai Thuế & Tiến Độ Xử Lý' : 'Tax Return & Workflow'}
              description={
                language === 'vi'
                  ? 'Năm khai thuế, mẫu tờ khai 1040, trạng thái xử lý và nhân viên phụ trách.'
                  : 'Filing year, Form 1040 variant, workflow status, and assigned tax preparer.'
              }
            >
              <div className="modal-grid cols-4">
                <FormField label={language === 'vi' ? 'Năm Thuế' : 'Tax Year'} error={form.formState.errors.taxYear?.message} required>
                  <select className={selectClass} {...form.register('taxYear')}>
                    {['2026', '2025', '2024', '2023'].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Mẫu Tờ Khai' : 'Return Type'} error={form.formState.errors.returnType?.message} required>
                  <select className={selectClass} {...form.register('returnType')}>
                    <option value="1040">{language === 'vi' ? 'Mẫu 1040 (Tiêu chuẩn)' : 'Form 1040 (Standard)'}</option>
                    <option value="1040-SR">{language === 'vi' ? 'Mẫu 1040-SR (Người cao tuổi 65+)' : 'Form 1040-SR (Seniors 65+)'}</option>
                    <option value="1040-NR">{language === 'vi' ? 'Mẫu 1040-NR (Người không cư trú)' : 'Form 1040-NR (Nonresident Alien)'}</option>
                    <option value="1040-X">{language === 'vi' ? 'Mẫu 1040-X (Tờ khai điều chỉnh)' : 'Form 1040-X (Amended Return)'}</option>
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Trạng Thái Xử Lý' : 'Workflow Status'} error={form.formState.errors.status?.message} required>
                  <select className={selectClass} {...form.register('status')}>
                    {Object.values(statusDisplayMap).map((st) => (
                      <option key={st} value={st}>
                        {language === 'vi' ? statusDisplayMapVi[st] || st : st}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Nhân Viên Phụ Trách' : 'Assigned Staff'} error={form.formState.errors.assignedStaff?.message} required>
                  <select className={selectClass} {...form.register('assignedStaff')}>
                    <option value="Amy Tran">Amy Tran</option>
                    <option value="Daniel Lee">Daniel Lee</option>
                    <option value="Sarah Kim">Sarah Kim</option>
                  </select>
                </FormField>
              </div>
            </FormSection>

            {/* Dependents / Additional Contacts */}
            <FormSection
              icon={<UsersRound />}
              title={language === 'vi' ? 'Người Phụ Thuộc & Người Liên Hệ Bổ Sung' : 'Dependents / Additional Contacts'}
              description={
                language === 'vi'
                  ? 'Thêm người phụ thuộc (con cái, người thân) hoặc người liên hệ liên quan.'
                  : 'Add dependents or additional contacts related to this tax return.'
              }
            >
              <div className="dynamic-stack">
                {dependents.fields.map((dep, index) => (
                  <div className="dynamic-card" key={dep.id}>
                    <div className="dynamic-title">
                      <span>{index + 1}</span>
                      <strong>{language === 'vi' ? `Người liên hệ #${index + 1}` : `Contact #${index + 1}`}</strong>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => dependents.remove(index)}
                      >
                        <Trash2 size={14} /> {language === 'vi' ? 'Xóa' : 'Remove'}
                      </Button>
                    </div>
                    <div className="modal-grid cols-4">
                      <FormField
                        label={language === 'vi' ? 'Họ và Tên' : 'Full Name'}
                        error={form.formState.errors.dependents?.[index]?.fullName?.message}
                        required
                        span="span-2"
                      >
                        <Input placeholder={language === 'vi' ? 'Họ và tên đầy đủ' : 'Full name'} {...form.register(`dependents.${index}.fullName`)} />
                      </FormField>

                      <FormField
                        label="SSN"
                        error={form.formState.errors.dependents?.[index]?.ssn?.message}
                      >
                        <Input
                          placeholder="000-00-0000"
                          autoComplete="off"
                          inputMode="numeric"
                          {...form.register(`dependents.${index}.ssn`)}
                          onChange={(e) =>
                            form.setValue(`dependents.${index}.ssn`, formatSsn(e.target.value))
                          }
                        />
                      </FormField>

                      <FormField label={language === 'vi' ? 'Ngày Sinh' : 'Date of Birth'}>
                        <Input type="date" {...form.register(`dependents.${index}.dob`)} />
                      </FormField>

                      <FormField
                        label={language === 'vi' ? 'Mối Quan Hệ' : 'Relationship'}
                        error={form.formState.errors.dependents?.[index]?.relationship?.message}
                        required
                        span="span-2"
                      >
                        <select
                          className={selectClass}
                          {...form.register(`dependents.${index}.relationship`)}
                        >
                          <option value="">{language === 'vi' ? '-- Chọn mối quan hệ --' : '-- Select Relationship --'}</option>
                          <option value="Child">{language === 'vi' ? 'Con cái (Child)' : 'Child'}</option>
                          <option value="Parent">{language === 'vi' ? 'Cha / Mẹ (Parent)' : 'Parent'}</option>
                          <option value="Grandchild">{language === 'vi' ? 'Cháu nội / ngoại (Grandchild)' : 'Grandchild'}</option>
                          <option value="Sibling">{language === 'vi' ? 'Anh / Chị / Em (Sibling)' : 'Sibling'}</option>
                          <option value="Foster Child">{language === 'vi' ? 'Con nuôi (Foster Child)' : 'Foster Child'}</option>
                          <option value="Other Relative">{language === 'vi' ? 'Người thân khác (Other Relative)' : 'Other Relative'}</option>
                          <option value="Non-Dependent Contact">{language === 'vi' ? 'Người liên hệ không phụ thuộc' : 'Non-Dependent Contact'}</option>
                        </select>
                      </FormField>

                      <FormField label={language === 'vi' ? 'Số Điện Thoại' : 'Phone'}>
                        <Input
                          type="tel"
                          placeholder="(555) 000-0000"
                          {...form.register(`dependents.${index}.phone`)}
                          onChange={(e) =>
                            form.setValue(
                              `dependents.${index}.phone`,
                              formatPhone(e.target.value)
                            )
                          }
                        />
                      </FormField>

                      <FormField label={language === 'vi' ? 'Địa Chỉ' : 'Address'}>
                        <Input placeholder={language === 'vi' ? 'Địa chỉ (nếu khác)' : 'Address (if different)'} {...form.register(`dependents.${index}.address`)} />
                      </FormField>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="add-row-btn cursor-pointer"
                onClick={() =>
                  dependents.append({
                    fullName: '',
                    ssn: '',
                    dob: '',
                    relationship: '',
                    phone: '',
                    address: '',
                  })
                }
              >
                <Plus size={14} /> {language === 'vi' ? 'Thêm Người Phụ Thuộc / Liên Hệ' : 'Add Dependent / Contact'}
              </Button>
            </FormSection>

            {/* Financial Summary & State Taxes */}
            <FormSection
              icon={<CircleDollarSign />}
              title={language === 'vi' ? 'Tổng Hợp Thuế & Phí Dịch Vụ' : 'Tax & Fee Summary'}
              description={
                language === 'vi'
                  ? 'Theo dõi số tiền thuế Liên bang, Tiểu bang, phí dịch vụ khai thuế và thanh toán.'
                  : 'Track federal, state tax liability, preparation fees, and client payments.'
              }
            >
              <div className="modal-grid cols-4 tax-summary">
                <FormField label={language === 'vi' ? 'Thuế Liên Bang ($)' : 'Federal Tax Amount'}>
                  <MoneyInput registration={form.register('federalTax')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Phí Dịch Vụ Khai Thuế ($)' : 'Preparation Fee'}>
                  <MoneyInput registration={form.register('preparationFee')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Số Tiền Đã Trả ($)' : 'Amount Paid'}>
                  <MoneyInput registration={form.register('amountPaid')} />
                </FormField>
                <div className={`balance-card ${balance < 0 ? 'credit' : ''}`}>
                  <span>{language === 'vi' ? 'Số tiền còn nợ' : 'Balance'}</span>
                  <strong>{currency(balance)}</strong>
                  <small>{language === 'vi' ? 'Phí − đã thanh toán' : 'Fee − amount paid'}</small>
                </div>
              </div>

              <div className="subsection-title">
                <div>
                  <strong>{language === 'vi' ? 'Thuế Tiểu Bang (State Tax)' : 'State Tax Returns'}</strong>
                  <span>{language === 'vi' ? 'Thêm không giới hạn các tiểu bang phát sinh nghĩa vụ thuế.' : 'Add multi-state filing obligations.'}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => stateTaxes.append({ state: 'CA', amount: 0 })}
                  className="cursor-pointer"
                >
                  <Plus size={14} /> {language === 'vi' ? 'Thêm Tiểu Bang' : 'Add State'}
                </Button>
              </div>

              {!stateTaxes.fields.length && <div className="state-empty">{language === 'vi' ? 'Chưa có tờ khai tiểu bang nào được thêm.' : 'No additional state tax returns added.'}</div>}

              <div className="state-list">
                {stateTaxes.fields.map((row, index) => (
                  <div className="state-row" key={row.id}>
                    <span className="row-number">{index + 1}</span>
                    <FormField
                      label={language === 'vi' ? 'Tiểu bang' : 'State'}
                      error={form.formState.errors.stateTaxes?.[index]?.state?.message}
                    >
                      <select className={selectClass} {...form.register(`stateTaxes.${index}.state`)}>
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField
                      label={language === 'vi' ? 'Số tiền thuế' : 'Tax Amount'}
                      error={form.formState.errors.stateTaxes?.[index]?.amount?.message}
                    >
                      <MoneyInput registration={form.register(`stateTaxes.${index}.amount`)} />
                    </FormField>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      aria-label={`Delete state ${index + 1}`}
                      onClick={() => stateTaxes.remove(index)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="admin-grid" style={{ marginTop: '16px', paddingTop: '16px' }}>
                <FormField label={language === 'vi' ? 'Ghi Chú Nội Bộ Khách Hàng' : 'Internal Client Notes'} span="span-4">
                  <Textarea
                    placeholder={language === 'vi' ? 'Ghi chú về chứng từ, giảm trừ thuế, hướng dẫn đặc biệt...' : 'Notes on client documentation, tax credits, deductions, or special instructions...'}
                    {...form.register('notes')}
                  />
                </FormField>
              </div>
            </FormSection>
          </div>

          <footer className="modal-footer">
            <div>
              <span>{language === 'vi' ? 'Số tiền còn nợ' : 'Balance due'}</span>
              <strong>{currency(balance)}</strong>
            </div>
            <div>
              <Button type="button" variant="invoice" onClick={() => form.trigger()} className="cursor-pointer">
                <ReceiptText size={15} />
                {language === 'vi' ? 'Tạo Hóa Đơn' : 'Invoice'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
              <Button type="submit" className="cursor-pointer">
                <Plus size={15} />
                {language === 'vi' ? 'Lưu Khách Hàng' : 'Save Client'}
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormSection({
  icon,
  title,
  description,
  aside,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="modal-section">
      <div className="modal-section-head">
        <span>{icon}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {aside}
      </div>
      <div className="modal-section-body">{children}</div>
    </section>
  );
}

function FormField({
  label,
  error,
  required = false,
  span = '',
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  span?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`modal-field ${span}`}>
      <Label>
        {label}
        {required && <b> *</b>}
      </Label>
      {children}
      {error && <p>{error}</p>}
    </div>
  );
}

function MoneyInput({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div className="money-input">
      <span>$</span>
      <Input type="number" min="0" step="0.01" {...registration} />
    </div>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}
