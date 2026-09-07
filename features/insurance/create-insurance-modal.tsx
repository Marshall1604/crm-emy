'use client';

import React, { useState } from 'react';
import {
  Shield,
  UserRound,
  FileText,
  Clock,
  MessageSquare,
  Plus,
  Calendar,
  Building2,
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
import { useLanguage } from '@/lib/i18n/language-context';
import { useStaffList } from '@/features/team/member-store';
import {
  InsuranceClient,
  calculateAge,
  formatInsuranceStatus,
  formatInsuranceType,
} from './insurance-types';

interface CreateInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newClient: InsuranceClient) => void;
}

const defaultCarriers = [
  'UnitedHealthcare',
  'Humana',
  'Aetna',
  'Anthem Blue Cross',
  'Kaiser Permanente',
  'Wellcare',
  'Cigna Healthcare',
  'Mutual of Omaha',
  'Blue Cross Blue Shield',
  'Molina Healthcare',
  'Prudential',
  'Khác',
];

const insuranceTypes = [
  'Medicare Advantage',
  'Original Medicare',
  'Medigap',
  'Part D',
  'ACA (Obamacare)',
  'Life Insurance',
  'Khác',
];

const statusOptions = [
  { key: 'Mới', vi: 'Mới tạo', en: 'New' },
  { key: 'Đang tư vấn', vi: 'Đang tư vấn', en: 'In Consultation' },
  { key: 'Đang phục vụ', vi: 'Đang phục vụ', en: 'Active Service' },
  { key: 'Ngừng chăm sóc', vi: 'Ngừng chăm sóc', en: 'Inactive / Paused' },
];

const staffList = ['Amy Tran', 'Daniel Lee', 'Sarah Kim', 'Michael Vu'];

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
];

const selectClass =
  'h-10 w-full rounded-md border border-[#d9e0e7] bg-white px-3 text-sm text-[#263142] outline-none focus:border-[#4b7ead] focus:ring-2 focus:ring-[#2b69a5]/10';

export function CreateInsuranceModal({
  isOpen,
  onClose,
  onSave,
}: CreateInsuranceModalProps) {
  const { language } = useLanguage();
  const { staffNames } = useStaffList();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [state, setState] = useState('CA');
  const [zipCode, setZipCode] = useState('');
  const [status, setStatus] = useState<string>('Mới');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [carrier, setCarrier] = useState('UnitedHealthcare');
  const [customCarrier, setCustomCarrier] = useState('');
  const [insuranceType, setInsuranceType] = useState<string>('Medicare Advantage');
  const [planName, setPlanName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (staffNames.length > 0 && !assignedStaff) {
      setAssignedStaff(staffNames[0]);
    }
  }, [staffNames, assignedStaff]);

  const calculatedAge = calculateAge(dob);

  const formatPhone = (value: string) => {
    const d = value.replace(/\D/g, '').slice(0, 10);
    if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    if (d.length > 0) return `(${d}`;
    return d;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName =
        language === 'vi' ? 'Họ và tên là trường bắt buộc' : 'Full name is required';
    }
    if (!assignedStaff.trim()) {
      newErrors.assignedStaff =
        language === 'vi' ? 'Vui lòng chọn nhân viên phụ trách' : 'Assigned staff is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCarrier = carrier === 'Khác' ? customCarrier.trim() || 'Khác' : carrier;

    const newRecord: InsuranceClient = {
      id: 'ins-' + Date.now(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      dob: dob || undefined,
      state: state || undefined,
      zipCode: zipCode.trim() || undefined,
      status,
      assignedStaff,
      carrier: finalCarrier || undefined,
      insuranceType,
      planName: planName.trim() || undefined,
      effectiveDate: effectiveDate || undefined,
      nextFollowUpDate: nextFollowUpDate || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newRecord);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setDob('');
    setState('CA');
    setZipCode('');
    setStatus('Mới');
    setAssignedStaff('Amy Tran');
    setCarrier('UnitedHealthcare');
    setCustomCarrier('');
    setInsuranceType('Medicare Advantage');
    setPlanName('');
    setEffectiveDate('');
    setNextFollowUpDate('');
    setNotes('');
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="business-modal">
        {/* Header matching Clients Tab */}
        <header className="modal-header">
          <div className="modal-heading-icon">
            <Shield size={20} />
          </div>
          <div>
            <DialogTitle>
              {language === 'vi'
                ? 'Thêm Khách Hàng Bảo Hiểm Mới'
                : 'Add New Insurance Client'}
            </DialogTitle>
            <DialogDescription>
              {language === 'vi'
                ? 'Khai báo thông tin danh tính, gói bảo hiểm Medicare/ACA/Life, hãng bảo hiểm và lịch chăm sóc định kỳ.'
                : 'Create policyholder profile, coverage details, insurance carrier, and follow-up reminders.'}
            </DialogDescription>
          </div>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-scroll">
            {/* Section 1: Thông tin khách hàng */}
            <FormSection
              icon={<UserRound size={18} />}
              title={
                language === 'vi' ? '1. Thông Tin Khách Hàng' : '1. Client Information'
              }
              description={
                language === 'vi'
                  ? 'Họ tên nhận diện, số điện thoại, ngày sinh và khu vực sinh sống của khách hàng.'
                  : 'Primary individual identity, phone number, date of birth, and location.'
              }
            >
              <div className="modal-grid cols-4">
                <FormField
                  label={language === 'vi' ? 'Họ và tên' : 'Full Name'}
                  error={errors.fullName}
                  required
                  span="span-2"
                >
                  <Input
                    placeholder={
                      language === 'vi'
                        ? 'Ví dụ: David Harrison, Nguyễn Văn A'
                        : 'e.g. David Harrison, John Doe'
                    }
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                  />
                </FormField>

                <FormField
                  label={language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                  span="span-2"
                >
                  <Input
                    placeholder="(714) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                  />
                </FormField>

                <FormField
                  label={
                    calculatedAge !== null
                      ? language === 'vi'
                        ? `Ngày sinh (${calculatedAge} tuổi)`
                        : `Date of Birth (${calculatedAge} yrs)`
                      : language === 'vi'
                      ? 'Ngày sinh (DOB)'
                      : 'Date of Birth (DOB)'
                  }
                  span="span-2"
                >
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </FormField>

                <FormField
                  label={language === 'vi' ? 'Bang (State)' : 'State'}
                >
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={selectClass}
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label={language === 'vi' ? 'Mã ZIP' : 'ZIP Code'}
                >
                  <Input
                    placeholder="92843"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Section 2: Quản lý & Phân công */}
            <FormSection
              icon={<Clock size={18} />}
              title={
                language === 'vi'
                  ? '2. Trạng Thái & Nhân Viên Phụ Trách'
                  : '2. Status & Assigned Staff'
              }
              description={
                language === 'vi'
                  ? 'Tiến độ tư vấn và phân công nhân sự chịu trách nhiệm chăm sóc.'
                  : 'Workflow engagement stage and responsible team member.'
              }
            >
              <div className="modal-grid cols-2">
                <FormField
                  label={language === 'vi' ? 'Trạng thái khách hàng' : 'Client Status'}
                  required
                >
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={selectClass}
                  >
                    {statusOptions.map((s) => (
                      <option key={s.key} value={s.key}>
                        {language === 'vi' ? s.vi : s.en}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label={language === 'vi' ? 'Nhân viên phụ trách' : 'Assigned Staff'}
                  error={errors.assignedStaff}
                  required
                >
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{language === 'vi' ? '-- Chọn nhân viên --' : '-- Select Staff --'}</option>
                    {staffNames.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </FormSection>

            {/* Section 3: Chi tiết hợp đồng bảo hiểm */}
            <FormSection
              icon={<Shield size={18} />}
              title={
                language === 'vi'
                  ? '3. Hợp Đồng & Gói Bảo Hiểm'
                  : '3. Coverage & Policy Details'
              }
              description={
                language === 'vi'
                  ? 'Hãng bảo hiểm, loại sản phẩm, tên gói chi tiết và ngày bắt đầu hiệu lực.'
                  : 'Insurance carrier, product line, plan name, and coverage timeline.'
              }
            >
              <div className="modal-grid cols-2">
                <FormField
                  label={language === 'vi' ? 'Hãng bảo hiểm hiện tại' : 'Current Carrier'}
                >
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className={selectClass}
                  >
                    {defaultCarriers.map((c) => (
                      <option key={c} value={c}>
                        {c === 'Khác' && language === 'en' ? 'Other' : c}
                      </option>
                    ))}
                  </select>
                  {carrier === 'Khác' && (
                    <Input
                      placeholder={
                        language === 'vi'
                          ? 'Nhập tên hãng bảo hiểm...'
                          : 'Enter carrier name...'
                      }
                      value={customCarrier}
                      onChange={(e) => setCustomCarrier(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </FormField>

                <FormField
                  label={language === 'vi' ? 'Loại bảo hiểm' : 'Insurance Type'}
                >
                  <select
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    className={selectClass}
                  >
                    {insuranceTypes.map((t) => (
                      <option key={t} value={t}>
                        {formatInsuranceType(t, language)}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label={language === 'vi' ? 'Tên gói bảo hiểm (Tùy chọn)' : 'Plan Name (Optional)'}
                  span="span-2"
                >
                  <Input
                    placeholder={
                      language === 'vi'
                        ? 'Ví dụ: Aetna Medicare Value Plus Plan (HMO), Humana Gold Plus HMO'
                        : 'e.g. Aetna Medicare Value Plus Plan (HMO), Humana Gold Plus HMO'
                    }
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </FormField>

                <FormField
                  label={
                    language === 'vi'
                      ? 'Ngày hiệu lực bảo hiểm'
                      : 'Effective Date'
                  }
                >
                  <Input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                  />
                </FormField>

                <FormField
                  label={
                    language === 'vi'
                      ? 'Ngày liên hệ tiếp theo (Nhắc hẹn)'
                      : 'Next Follow-Up Date'
                  }
                >
                  <Input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Section 4: Ghi chú ngắn */}
            <FormSection
              icon={<MessageSquare size={18} />}
              title={language === 'vi' ? '4. Ghi Chú Ngắn' : '4. Notes & Reminders'}
              description={
                language === 'vi'
                  ? 'Ghi chú nhu cầu khách hàng, đợt ghi danh AEP hoặc nội dung trao đổi.'
                  : 'Client preferences, AEP enrollment notes, or general reminders.'
              }
            >
              <div className="modal-grid cols-1">
                <FormField label={language === 'vi' ? 'Nội dung ghi chú' : 'Case Notes'}>
                  <Textarea
                    rows={3}
                    placeholder={
                      language === 'vi'
                        ? 'Ví dụ: Muốn tư vấn lại vào tháng 10 đợt AEP; Đang so sánh Medigap Plan G...'
                        : 'e.g. Follow up in October during AEP; comparing Medigap Plan G...'
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </FormField>
              </div>
            </FormSection>
          </div>

          {/* Footer matching Clients Tab */}
          <footer className="modal-footer">
            <div className="modal-footer-actions">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
              <Button type="submit" className="cursor-pointer">
                <Plus size={15} />
                {language === 'vi' ? 'Lưu Khách Hàng' : 'Save Insurance Client'}
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
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
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
        {required && <b className="text-rose-500"> *</b>}
      </Label>
      {children}
      {error && <p className="text-rose-600 text-xs font-semibold mt-1">{error}</p>}
    </div>
  );
}