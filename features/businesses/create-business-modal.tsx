'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';
import { Building2, CircleDollarSign, FileText, Plus, ReceiptText, Trash2, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/lib/i18n/language-context';

const required = (label: string) => z.string().trim().min(1, `${label} is required`);
const money = z.coerce.number().min(0, 'Amount cannot be negative');
const partnerSchema = z.object({
  firstName: required('First name'),
  lastName: required('Last name'),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'Use 000-00-0000 format'),
  dob: required('Date of birth'),
  phone: z.string(),
  email: z.union([z.literal(''), z.string().email('Enter a valid email')]),
  address: z.string(),
  ownership: z.coerce.number().min(0).max(100),
});

const schema = z
  .object({
    taxMonth: required('Tax month'),
    taxYear: required('Tax year'),
    legalName: required('Legal business name'),
    dba: z.string(),
    ein: z.string().regex(/^\d{2}-\d{7}$/, 'Use XX-XXXXXXX format'),
    entityType: required('Entity type'),
    returnType: required('Tax return type'),
    phone: z.string(),
    email: z.union([z.literal(''), z.string().email('Enter a valid email')]),
    address: required('Address'),
    city: required('City'),
    state: required('State'),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code'),
    partners: z.array(partnerSchema).min(1),
    federalTax: money,
    stateTaxes: z.array(z.object({ state: required('State'), amount: money })),
    preparationFee: money,
    amountPaid: money,
    financeCategory: required('Finance category'),
    status: required('Status'),
    assignedStaff: required('Assigned staff'),
    notes: z.string(),
  })
  .superRefine((data, ctx) => {
    const total = data.partners.reduce((sum, p) => sum + Number(p.ownership || 0), 0);
    if (total > 100) ctx.addIssue({ code: 'custom', path: ['partners'], message: 'Total ownership cannot exceed 100%' });
  });

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const blankPartner = { firstName: '', lastName: '', ssn: '', dob: '', phone: '', email: '', address: '', ownership: 0 };
const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
];
const selectClass =
  'h-10 w-full rounded-md border border-[#d9e0e7] bg-white px-3 text-sm text-[#263142] outline-none focus:border-[#4b7ead] focus:ring-2 focus:ring-[#2b69a5]/10';

export function CreateBusinessModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { language } = useLanguage();
  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      taxMonth: '01',
      taxYear: '2026',
      legalName: '',
      dba: '',
      ein: '',
      entityType: 'partnership_1065',
      returnType: '1065',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: 'CA',
      zip: '',
      partners: [{ ...blankPartner, ownership: 100 }],
      federalTax: 0,
      stateTaxes: [],
      preparationFee: 0,
      amountPaid: 0,
      financeCategory: 'tax_preparation',
      status: 'new',
      assignedStaff: 'amy_tran',
      notes: '',
    },
  });

  const partners = useFieldArray({ control: form.control, name: 'partners' });
  const stateTaxes = useFieldArray({ control: form.control, name: 'stateTaxes' });
  const watchedPartners = useWatch({ control: form.control, name: 'partners' }) || [];
  const prep = useWatch({ control: form.control, name: 'preparationFee' }) || 0;
  const paid = useWatch({ control: form.control, name: 'amountPaid' }) || 0;
  const ownership = watchedPartners.reduce((sum, p) => sum + Number(p?.ownership || 0), 0);
  const balance = Number(prep) - Number(paid);

  const formatEin = (value: string) => {
    const d = value.replace(/\D/g, '').slice(0, 9);
    return d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d;
  };

  const formatSsn = (value: string) => {
    const d = value.replace(/\D/g, '').slice(0, 9);
    if (d.length > 5) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
    if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return d;
  };

  const submit = (values: FormValues) => {
    console.info('Validated business payload', {
      ...values,
      partners: values.partners.map((p) => ({ ...p, ssn: '***-**-' + p.ssn.slice(-4) })),
      ein: '**-***' + values.ein.slice(-4),
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="business-modal">
        <header className="modal-header">
          <div className="modal-heading-icon">
            <Building2 size={20} />
          </div>
          <div>
            <DialogTitle>
              {language === 'vi' ? 'Thêm Khách Hàng Doanh Nghiệp Mới' : 'Create Business Client'}
            </DialogTitle>
            <DialogDescription>
              {language === 'vi'
                ? 'Khai báo thông tin công ty, cơ cấu sở hữu, hồ sơ thuế và biểu phí dịch vụ.'
                : 'Add business, ownership, tax, and fee information.'}
            </DialogDescription>
          </div>
        </header>

        <form id="create-business" onSubmit={form.handleSubmit(submit)} className="modal-form">
          <div className="modal-scroll">
            <FormSection
              icon={<Building2 />}
              title={language === 'vi' ? 'Thông Tin Doanh Nghiệp' : 'Business Information'}
              description={
                language === 'vi'
                  ? 'Pháp nhân kinh doanh, kỳ tính thuế và thông tin liên lạc.'
                  : 'Business identity, filing period, and contact details.'
              }
            >
              <div className="modal-grid cols-4">
                <FormField label={language === 'vi' ? 'Tháng Thuế' : 'Tax Month'} error={form.formState.errors.taxMonth?.message} required>
                  <select className={selectClass} {...form.register('taxMonth')}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Năm Thuế' : 'Tax Year'} error={form.formState.errors.taxYear?.message} required>
                  <select className={selectClass} {...form.register('taxYear')}>
                    {[2026, 2025, 2024, 2023].map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Loại Hình Doanh Nghiệp' : 'Entity Type'} error={form.formState.errors.entityType?.message} required>
                  <select className={selectClass} {...form.register('entityType')}>
                    <option value="partnership_1065">{language === 'vi' ? 'Hợp danh (Partnership 1065)' : 'Partnership'}</option>
                    <option value="s_corporation_1120s">{language === 'vi' ? 'Công ty S-Corp (1120-S)' : 'S Corporation'}</option>
                    <option value="c_corporation_1120">{language === 'vi' ? 'Công ty C-Corp (1120)' : 'C Corporation'}</option>
                    <option value="sole_proprietor">{language === 'vi' ? 'Hộ kinh doanh (Sole Proprietor)' : 'Sole Proprietor'}</option>
                    <option value="single_member_llc">{language === 'vi' ? 'Công ty LLC 1 thành viên' : 'Single Member LLC'}</option>
                    <option value="other">{language === 'vi' ? 'Khác' : 'Other'}</option>
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Mẫu Tờ Khai' : 'Tax Return Type'} error={form.formState.errors.returnType?.message} required>
                  <select className={selectClass} {...form.register('returnType')}>
                    <option value="1065">Form 1065</option>
                    <option value="1120-S">Form 1120-S</option>
                    <option value="1120">Form 1120</option>
                    <option value="schedule-c">Schedule C</option>
                  </select>
                </FormField>

                <FormField label={language === 'vi' ? 'Tên Pháp Lý Công Ty' : 'Legal Business Name'} error={form.formState.errors.legalName?.message} required span="span-2">
                  <Input placeholder={language === 'vi' ? 'Tên đăng ký kinh doanh' : 'Legal business name'} {...form.register('legalName')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Tên Thương Mại (DBA)' : 'DBA'} span="span-2">
                  <Input placeholder={language === 'vi' ? 'Doing Business As' : 'Doing Business As'} {...form.register('dba')} />
                </FormField>

                <FormField label={language === 'vi' ? 'Mã Số EIN' : 'EIN'} error={form.formState.errors.ein?.message} required>
                  <Input
                    placeholder="XX-XXXXXXX"
                    inputMode="numeric"
                    {...form.register('ein')}
                    onChange={(e) => form.setValue('ein', formatEin(e.target.value), { shouldValidate: true })}
                  />
                </FormField>
                <FormField label={language === 'vi' ? 'Số Điện Thoại' : 'Phone'}>
                  <Input type="tel" placeholder="+1 555-555-5555" {...form.register('phone')} />
                </FormField>
                <FormField label="Email" error={form.formState.errors.email?.message} span="span-2">
                  <Input type="email" placeholder="business@example.com" {...form.register('email')} />
                </FormField>

                <FormField label={language === 'vi' ? 'Địa Chỉ Trụ Sở' : 'Address'} error={form.formState.errors.address?.message} required span="span-2">
                  <Input placeholder={language === 'vi' ? 'Số nhà, tên đường, số phòng...' : 'Street address'} {...form.register('address')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Thành Phố' : 'City'} error={form.formState.errors.city?.message} required>
                  <Input placeholder={language === 'vi' ? 'Thành phố' : 'City'} {...form.register('city')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Tiểu Bang' : 'State'} error={form.formState.errors.state?.message} required>
                  <select className={selectClass} {...form.register('state')}>
                    {states.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label={language === 'vi' ? 'Mã Bưu Chính ZIP' : 'ZIP Code'} error={form.formState.errors.zip?.message} required>
                  <Input placeholder={language === 'vi' ? 'Mã ZIP' : 'ZIP Code'} {...form.register('zip')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              icon={<UsersRound />}
              title={language === 'vi' ? 'Thành Viên Góp Vốn & Chủ Sở Hữu' : 'Partners / Owners'}
              description={
                language === 'vi'
                  ? 'Khai báo đầy đủ các thành viên góp vốn và tỷ lệ sở hữu.'
                  : 'Add every partner or owner associated with this business.'
              }
              aside={
                <div className={`ownership-total ${ownership > 100 ? 'invalid' : ''}`}>
                  <span>{language === 'vi' ? 'Tổng tỷ lệ sở hữu' : 'Total ownership'}</span>
                  <strong>{ownership.toFixed(2)}%</strong>
                </div>
              }
            >
              {form.formState.errors.partners?.root?.message && (
                <p className="section-error">{form.formState.errors.partners.root.message}</p>
              )}
              {typeof form.formState.errors.partners?.message === 'string' && (
                <p className="section-error">{form.formState.errors.partners.message}</p>
              )}
              <div className="dynamic-stack">
                {partners.fields.map((partner, index) => (
                  <div className="dynamic-card" key={partner.id}>
                    <div className="dynamic-title">
                      <span>{index + 1}</span>
                      <strong>{language === 'vi' ? `Thành viên #${index + 1}` : `Partner #${index + 1}`}</strong>
                      {index > 0 && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => partners.remove(index)}>
                          <Trash2 size={14} />
                          {language === 'vi' ? 'Xóa' : 'Delete'}
                        </Button>
                      )}
                    </div>
                    <div className="modal-grid cols-4">
                      <FormField
                        label={language === 'vi' ? 'Tên' : 'First Name'}
                        error={form.formState.errors.partners?.[index]?.firstName?.message}
                        required
                      >
                        <Input placeholder={language === 'vi' ? 'Tên' : 'First name'} {...form.register(`partners.${index}.firstName`)} />
                      </FormField>
                      <FormField
                        label={language === 'vi' ? 'Họ' : 'Last Name'}
                        error={form.formState.errors.partners?.[index]?.lastName?.message}
                        required
                      >
                        <Input placeholder={language === 'vi' ? 'Họ' : 'Last name'} {...form.register(`partners.${index}.lastName`)} />
                      </FormField>
                      <FormField
                        label={language === 'vi' ? 'Số SSN' : 'SSN'}
                        error={form.formState.errors.partners?.[index]?.ssn?.message}
                        required
                      >
                        <Input
                          placeholder="000-00-0000"
                          autoComplete="off"
                          inputMode="numeric"
                          {...form.register(`partners.${index}.ssn`)}
                          onChange={(e) =>
                            form.setValue(`partners.${index}.ssn`, formatSsn(e.target.value), { shouldValidate: true })
                          }
                        />
                      </FormField>
                      <FormField
                        label={language === 'vi' ? 'Ngày Sinh' : 'DOB'}
                        error={form.formState.errors.partners?.[index]?.dob?.message}
                        required
                      >
                        <Input type="date" {...form.register(`partners.${index}.dob`)} />
                      </FormField>
                      <FormField label={language === 'vi' ? 'Số Điện Thoại' : 'Phone'}>
                        <Input type="tel" placeholder="(555) 000-0000" {...form.register(`partners.${index}.phone`)} />
                      </FormField>
                      <FormField label="Email" error={form.formState.errors.partners?.[index]?.email?.message}>
                        <Input type="email" placeholder="partner@example.com" {...form.register(`partners.${index}.email`)} />
                      </FormField>
                      <FormField label={language === 'vi' ? 'Địa Chỉ' : 'Address'} span="span-2">
                        <Input placeholder={language === 'vi' ? 'Địa chỉ cá nhân' : 'Address'} {...form.register(`partners.${index}.address`)} />
                      </FormField>
                      <FormField
                        label={language === 'vi' ? 'Tỷ Lệ Sở Hữu' : 'Ownership'}
                        error={form.formState.errors.partners?.[index]?.ownership?.message}
                        required
                      >
                        <div className="input-suffix">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            {...form.register(`partners.${index}.ownership`)}
                          />
                          <span>%</span>
                        </div>
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
                onClick={() => partners.append({ ...blankPartner })}
              >
                <Plus size={14} /> {language === 'vi' ? 'Thêm Thành Viên' : 'Add Partner'}
              </Button>
            </FormSection>

            <FormSection
              icon={<CircleDollarSign />}
              title={language === 'vi' ? 'Tổng Hợp Thuế & Phí Dịch Vụ' : 'Tax & Fee'}
              description={
                language === 'vi'
                  ? 'Theo dõi thuế Liên bang, Tiểu bang, phí dịch vụ và thanh toán.'
                  : 'Track federal, state, preparation, and payment amounts.'
              }
            >
              <div className="modal-grid cols-4 tax-summary">
                <FormField label={language === 'vi' ? 'Thuế Liên Bang ($)' : 'Federal Tax Amount'}>
                  <MoneyInput registration={form.register('federalTax')} />
                </FormField>
                <FormField label={language === 'vi' ? 'Phí Dịch Vụ ($)' : 'Preparation Fee'}>
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
                  <strong>{language === 'vi' ? 'Thuế Tiểu Bang (State Tax)' : 'State Tax Amounts'}</strong>
                  <span>{language === 'vi' ? 'Thêm không giới hạn các tiểu bang kê khai.' : 'Add unlimited state jurisdictions.'}</span>
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

              {!stateTaxes.fields.length && (
                <div className="state-empty">
                  {language === 'vi' ? 'Chưa có tờ khai tiểu bang nào được thêm.' : 'No state tax amounts added.'}
                </div>
              )}

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
                          <option key={s}>{s}</option>
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
                      className="cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="modal-grid cols-3 admin-grid">
                <FormField label={language === 'vi' ? 'Danh Mục Dịch Vụ' : 'Finance Category'} required>
                  <select className={selectClass} {...form.register('financeCategory')}>
                    <option value="tax_preparation">{language === 'vi' ? 'Khai Thuế (Tax Preparation)' : 'Tax Preparation'}</option>
                    <option value="bookkeeping">{language === 'vi' ? 'Kế Toán Sổ Sách (Bookkeeping)' : 'Bookkeeping'}</option>
                    <option value="consulting">{language === 'vi' ? 'Tư Vấn Tài Chính (Consulting)' : 'Consulting'}</option>
                    <option value="other">{language === 'vi' ? 'Dịch Vụ Khác' : 'Other'}</option>
                  </select>
                </FormField>
                <FormField label={language === 'vi' ? 'Trạng Thái Hồ Sơ' : 'Tax Status'} required>
                  <select className={selectClass} {...form.register('status')}>
                    <option value="new">{language === 'vi' ? 'Mới Tạo (New)' : 'New'}</option>
                    <option value="waiting_documents">{language === 'vi' ? 'Chờ Giấy Tờ (Waiting Docs)' : 'Waiting Documents'}</option>
                    <option value="documents_received">{language === 'vi' ? 'Đã Nhận Giấy Tờ' : 'Documents Received'}</option>
                    <option value="in_preparation">{language === 'vi' ? 'Đang Soạn Hồ Sơ' : 'In Preparation'}</option>
                    <option value="missing_information">{language === 'vi' ? 'Thiếu Thông Tin' : 'Missing Information'}</option>
                    <option value="review">{language === 'vi' ? 'Đang Kiểm Tra (Review)' : 'Review'}</option>
                    <option value="signature_pending">{language === 'vi' ? 'Chờ Ký Tên' : 'Signature Pending'}</option>
                    <option value="ready_to_file">{language === 'vi' ? 'Sẵn Sàng Nộp' : 'Ready to File'}</option>
                    <option value="e_filed">{language === 'vi' ? 'Đã Nộp IRS (E-Filed)' : 'E-Filed'}</option>
                    <option value="accepted">{language === 'vi' ? 'IRS Đã Chấp Nhận' : 'Accepted'}</option>
                    <option value="rejected">{language === 'vi' ? 'IRS Từ Chối' : 'Rejected'}</option>
                    <option value="extension_filed">{language === 'vi' ? 'Đã Xin Gia Hạn' : 'Extension Filed'}</option>
                    <option value="completed">{language === 'vi' ? 'Đã Hoàn Tất (Completed)' : 'Completed'}</option>
                  </select>
                </FormField>
                <FormField label={language === 'vi' ? 'Nhân Viên Phụ Trách' : 'Assigned Staff'} required>
                  <select className={selectClass} {...form.register('assignedStaff')}>
                    <option value="amy_tran">Amy Tran</option>
                    <option value="daniel_lee">Daniel Lee</option>
                    <option value="sarah_kim">Sarah Kim</option>
                  </select>
                </FormField>
                <FormField label={language === 'vi' ? 'Ghi Chú Nội Bộ' : 'Notes'} span="span-3">
                  <Textarea
                    placeholder={language === 'vi' ? 'Ghi chú nội bộ về khách hàng hoặc hồ sơ thuế này…' : 'Internal notes about this client or tax case…'}
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
                <FileText size={15} />
                {language === 'vi' ? 'Lưu Doanh Nghiệp' : 'Save Business'}
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
